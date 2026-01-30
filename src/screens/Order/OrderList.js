/**
 * Order List Screen
 * Danh sách đơn hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import OrderTable from "../../components/Order/OrderTable";
import OrderFilter from "../../components/Order/OrderFilter";
import { orderService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class OrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      loading: true,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadOrders();
  }

  loadOrders = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      // Build query params, only include non-empty values
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Only add filter params if they have values
      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await orderService.getAll(params);

      this.setState({
        orders: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách đơn hàng");
      this.setState({ loading: false });
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadOrders()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadOrders()
    );
  };

  handleStatusChange = async (id, status) => {
    try {
      await orderService.updateStatus(id, status);
      toastSuccess("Cập nhật trạng thái thành công");
      this.loadOrders();
    } catch (error) {
      toastError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  render() {
    const { orders, loading, pagination, filters } = this.state;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Danh sách đơn hàng"
              Breadcrumb={[
                { name: "Đơn hàng", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Đơn hàng</h2>
                    <Link
                      to="/order-create"
                      className="btn btn-primary btn-sm float-right"
                    >
                      <i className="fa fa-plus"></i> Tạo đơn hàng
                    </Link>
                  </div>
                  <div className="body">
                    <OrderFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <OrderTable
                      orders={orders}
                      loading={loading}
                      pagination={pagination}
                      onPageChange={this.handlePageChange}
                      onStatusChange={this.handleStatusChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(OrderList);
