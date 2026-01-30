/**
 * WorkOrder List Screen
 * Danh sách lệnh sản xuất
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import WorkOrderTable from "../../components/WorkOrder/WorkOrderTable";
import WorkOrderFilter from "../../components/WorkOrder/WorkOrderFilter";
import { workOrderService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class WorkOrderList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workOrders: [],
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
        step: "",
        dateFrom: "",
        dateTo: "",
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadWorkOrders();
  }

  loadWorkOrders = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      const response = await workOrderService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      this.setState({
        workOrders: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách lệnh sản xuất");
      this.setState({ loading: false });
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadWorkOrders()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadWorkOrders()
    );
  };

  handleStatusChange = async (id, status) => {
    try {
      await workOrderService.updateStatus(id, status);
      toastSuccess("Cập nhật trạng thái thành công");
      this.loadWorkOrders();
    } catch (error) {
      toastError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  render() {
    const { workOrders, loading, pagination, filters } = this.state;

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
              HeaderText="Lệnh sản xuất"
              Breadcrumb={[
                { name: "Sản xuất", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Lệnh sản xuất</h2>
                  </div>
                  <div className="body">
                    <WorkOrderFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <WorkOrderTable
                      workOrders={workOrders}
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

export default connect(mapStateToProps, {})(WorkOrderList);
