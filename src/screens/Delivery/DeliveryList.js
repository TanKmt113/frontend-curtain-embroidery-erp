/**
 * Delivery List Screen
 * Danh sách giao hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import DeliveryTable from "../../components/Delivery/DeliveryTable";
import DeliveryFilter from "../../components/Delivery/DeliveryFilter";
import { deliveryService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class DeliveryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveries: [],
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
      stats: {
        pending: 0,
        inProgress: 0,
        completed: 0,
        today: 0,
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadDeliveries();
    this.loadStats();
  }

  loadDeliveries = async () => {
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

      const response = await deliveryService.getAll(params);

      this.setState({
        deliveries: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách giao hàng");
      this.setState({ loading: false });
    }
  };

  loadStats = async () => {
    try {
      const response = await deliveryService.getStats();
      this.setState({ stats: response.data || this.state.stats });
    } catch (error) {
      console.error("Load delivery stats error:", error);
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadDeliveries()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadDeliveries()
    );
  };

  handleStatusChange = async (id, status) => {
    try {
      await deliveryService.updateStatus(id, status);
      toastSuccess("Cập nhật trạng thái thành công");
      this.loadDeliveries();
      this.loadStats();
    } catch (error) {
      toastError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  render() {
    const { deliveries, loading, pagination, filters, stats } = this.state;

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
              HeaderText="Quản lý giao hàng"
              Breadcrumb={[
                { name: "Giao hàng", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            {/* Stats Cards */}
            <div className="row clearfix">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-warning text-white rounded-circle">
                        <i className="fa fa-clock-o fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Chờ giao</span>
                        <h4 className="mb-0 text-warning">{stats.pending}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-primary text-white rounded-circle">
                        <i className="fa fa-truck fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Đang giao</span>
                        <h4 className="mb-0 text-primary">{stats.inProgress}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-success text-white rounded-circle">
                        <i className="fa fa-check-circle fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Đã giao</span>
                        <h4 className="mb-0 text-success">{stats.completed}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-info text-white rounded-circle">
                        <i className="fa fa-calendar fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Hôm nay</span>
                        <h4 className="mb-0 text-info">{stats.today}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Danh sách giao hàng</h2>
                    <div className="float-right">
                      <Link
                        to="/delivery-create"
                        className="btn btn-primary btn-sm mr-2"
                      >
                        <i className="fa fa-plus"></i> Tạo phiếu giao
                      </Link>
                      <Link
                        to="/delivery-schedule"
                        className="btn btn-info btn-sm"
                      >
                        <i className="fa fa-calendar"></i> Lịch giao hàng
                      </Link>
                    </div>
                  </div>
                  <div className="body">
                    <DeliveryFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <DeliveryTable
                      deliveries={deliveries}
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

export default connect(mapStateToProps, {})(DeliveryList);
