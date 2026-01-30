/**
 * QC Record List Screen
 * Danh sách kiểm tra chất lượng
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import QCTable from "../../components/QC/QCTable";
import QCFilter from "../../components/QC/QCFilter";
import { qcService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class QCList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      loading: true,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: "",
        result: "",
        dateFrom: "",
        dateTo: "",
      },
      stats: {
        total: 0,
        passed: 0,
        failed: 0,
        pending: 0,
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadRecords();
    this.loadStats();
  }

  loadRecords = async () => {
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
      if (filters.result) params.result = filters.result;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await qcService.getAll(params);

      this.setState({
        records: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách QC");
      this.setState({ loading: false });
    }
  };

  loadStats = async () => {
    try {
      const response = await qcService.getStats();
      this.setState({ stats: response.data || this.state.stats });
    } catch (error) {
      console.error("Load QC stats error:", error);
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadRecords()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadRecords()
    );
  };

  render() {
    const { records, loading, pagination, filters, stats } = this.state;

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
              HeaderText="Kiểm tra chất lượng"
              Breadcrumb={[
                { name: "QC", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            {/* Stats Cards */}
            <div className="row clearfix">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-primary text-white rounded-circle">
                        <i className="fa fa-check-circle fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Tổng kiểm tra</span>
                        <h4 className="mb-0">{stats.total}</h4>
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
                        <i className="fa fa-thumbs-up fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Đạt</span>
                        <h4 className="mb-0 text-success">{stats.passed}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-danger text-white rounded-circle">
                        <i className="fa fa-thumbs-down fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Không đạt</span>
                        <h4 className="mb-0 text-danger">{stats.failed}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-warning text-white rounded-circle">
                        <i className="fa fa-clock-o fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Chờ kiểm tra</span>
                        <h4 className="mb-0 text-warning">{stats.pending}</h4>
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
                    <h2>Danh sách kiểm tra</h2>
                    <Link
                      to="/qc-create"
                      className="btn btn-primary btn-sm float-right"
                    >
                      <i className="fa fa-plus"></i> Tạo kiểm tra
                    </Link>
                  </div>
                  <div className="body">
                    <QCFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <QCTable
                      records={records}
                      loading={loading}
                      pagination={pagination}
                      onPageChange={this.handlePageChange}
                      onRefresh={this.loadRecords}
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

export default connect(mapStateToProps, {})(QCList);
