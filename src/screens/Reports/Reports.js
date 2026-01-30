/**
 * Reports Screen
 * Báo cáo tổng hợp
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";

// Danh sách báo cáo theo nhóm
const REPORT_GROUPS = [
  {
    id: "sales",
    title: "Báo cáo Kinh doanh",
    icon: "fa-line-chart",
    color: "#4CAF50",
    reports: [
      {
        id: "sales-summary",
        name: "Báo cáo doanh thu",
        description: "Tổng hợp doanh thu theo thời gian",
        icon: "fa-money",
      },
      {
        id: "quotation-report",
        name: "Báo cáo báo giá",
        description: "Thống kê báo giá gửi, duyệt, chuyển đổi",
        icon: "fa-calculator",
      },
      {
        id: "order-report",
        name: "Báo cáo đơn hàng",
        description: "Thống kê đơn hàng theo trạng thái",
        icon: "fa-shopping-cart",
      },
      {
        id: "customer-report",
        name: "Báo cáo khách hàng",
        description: "Phân tích khách hàng, doanh thu theo khách",
        icon: "fa-users",
      },
    ],
  },
  {
    id: "production",
    title: "Báo cáo Sản xuất",
    icon: "fa-industry",
    color: "#FF9800",
    reports: [
      {
        id: "work-order-report",
        name: "Báo cáo lệnh sản xuất",
        description: "Thống kê tiến độ sản xuất",
        icon: "fa-tasks",
      },
      {
        id: "productivity-report",
        name: "Báo cáo năng suất",
        description: "Phân tích năng suất theo công đoạn",
        icon: "fa-tachometer",
      },
      {
        id: "qc-report",
        name: "Báo cáo QC",
        description: "Thống kê kiểm tra chất lượng",
        icon: "fa-check-circle",
      },
    ],
  },
  {
    id: "inventory",
    title: "Báo cáo Kho",
    icon: "fa-cubes",
    color: "#2196F3",
    reports: [
      {
        id: "inventory-summary",
        name: "Báo cáo tồn kho",
        description: "Tình hình tồn kho hiện tại",
        icon: "fa-archive",
      },
      {
        id: "inventory-movement",
        name: "Báo cáo xuất nhập",
        description: "Thống kê xuất nhập kho theo thời gian",
        icon: "fa-exchange",
      },
      {
        id: "inventory-value",
        name: "Báo cáo giá trị kho",
        description: "Giá trị tồn kho theo danh mục",
        icon: "fa-dollar",
      },
    ],
  },
  {
    id: "delivery",
    title: "Báo cáo Giao hàng",
    icon: "fa-truck",
    color: "#9C27B0",
    reports: [
      {
        id: "delivery-report",
        name: "Báo cáo giao hàng",
        description: "Thống kê tình hình giao hàng",
        icon: "fa-send",
      },
      {
        id: "installation-report",
        name: "Báo cáo lắp đặt",
        description: "Thống kê tình hình lắp đặt",
        icon: "fa-wrench",
      },
    ],
  },
];

class Reports extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPeriod: "this_month",
      dateFrom: "",
      dateTo: "",
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handlePeriodChange = (e) => {
    this.setState({ selectedPeriod: e.target.value });
  };

  handleExport = (reportId, format) => {
    alert(`Xuất báo cáo ${reportId} định dạng ${format}`);
    // TODO: Implement export functionality
  };

  handleViewReport = (reportId) => {
    alert(`Xem báo cáo: ${reportId}`);
    // TODO: Navigate to specific report page or open modal
  };

  render() {
    const { selectedPeriod } = this.state;

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
              HeaderText="Báo cáo"
              Breadcrumb={[
                { name: "Tổng quan", navigate: "" },
                { name: "Báo cáo", navigate: "" },
              ]}
            />

            {/* Filter Bar */}
            <div className="row clearfix">
              <div className="col-12">
                <div className="card">
                  <div className="body">
                    <div className="row align-items-center">
                      <div className="col-md-3">
                        <div className="form-group mb-0">
                          <label className="mb-1">Kỳ báo cáo</label>
                          <select
                            className="form-control"
                            value={selectedPeriod}
                            onChange={this.handlePeriodChange}
                          >
                            <option value="today">Hôm nay</option>
                            <option value="yesterday">Hôm qua</option>
                            <option value="this_week">Tuần này</option>
                            <option value="last_week">Tuần trước</option>
                            <option value="this_month">Tháng này</option>
                            <option value="last_month">Tháng trước</option>
                            <option value="this_quarter">Quý này</option>
                            <option value="last_quarter">Quý trước</option>
                            <option value="this_year">Năm nay</option>
                            <option value="last_year">Năm trước</option>
                            <option value="custom">Tùy chọn...</option>
                          </select>
                        </div>
                      </div>
                      {selectedPeriod === "custom" && (
                        <>
                          <div className="col-md-2">
                            <div className="form-group mb-0">
                              <label className="mb-1">Từ ngày</label>
                              <input
                                type="date"
                                className="form-control"
                                value={this.state.dateFrom}
                                onChange={(e) =>
                                  this.setState({ dateFrom: e.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="col-md-2">
                            <div className="form-group mb-0">
                              <label className="mb-1">Đến ngày</label>
                              <input
                                type="date"
                                className="form-control"
                                value={this.state.dateTo}
                                onChange={(e) =>
                                  this.setState({ dateTo: e.target.value })
                                }
                              />
                            </div>
                          </div>
                        </>
                      )}
                      <div className="col-md-5 text-right">
                        <label className="mb-1 d-block">&nbsp;</label>
                        <button className="btn btn-outline-secondary mr-2">
                          <i className="fa fa-refresh mr-1"></i>
                          Làm mới
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="row clearfix">
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div
                        className="icon-in-bg bg-success text-white rounded-circle"
                        style={{ width: 50, height: 50, lineHeight: "50px", textAlign: "center" }}
                      >
                        <i className="fa fa-money fa-lg"></i>
                      </div>
                      <div className="ml-3">
                        <span className="text-muted">Doanh thu tháng</span>
                        <h4 className="mb-0">1.250.000.000₫</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div
                        className="icon-in-bg bg-info text-white rounded-circle"
                        style={{ width: 50, height: 50, lineHeight: "50px", textAlign: "center" }}
                      >
                        <i className="fa fa-shopping-cart fa-lg"></i>
                      </div>
                      <div className="ml-3">
                        <span className="text-muted">Đơn hàng mới</span>
                        <h4 className="mb-0">156</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div
                        className="icon-in-bg bg-warning text-white rounded-circle"
                        style={{ width: 50, height: 50, lineHeight: "50px", textAlign: "center" }}
                      >
                        <i className="fa fa-tasks fa-lg"></i>
                      </div>
                      <div className="ml-3">
                        <span className="text-muted">LSX hoàn thành</span>
                        <h4 className="mb-0">89</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div
                        className="icon-in-bg bg-danger text-white rounded-circle"
                        style={{ width: 50, height: 50, lineHeight: "50px", textAlign: "center" }}
                      >
                        <i className="fa fa-truck fa-lg"></i>
                      </div>
                      <div className="ml-3">
                        <span className="text-muted">Đơn đã giao</span>
                        <h4 className="mb-0">124</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Groups */}
            {REPORT_GROUPS.map((group) => (
              <div key={group.id} className="row clearfix">
                <div className="col-12">
                  <div className="card">
                    <div className="header">
                      <h2>
                        <i
                          className={`fa ${group.icon} mr-2`}
                          style={{ color: group.color }}
                        ></i>
                        {group.title}
                      </h2>
                    </div>
                    <div className="body">
                      <div className="row">
                        {group.reports.map((report) => (
                          <div key={report.id} className="col-lg-3 col-md-6 mb-3">
                            <div
                              className="card mb-0"
                              style={{
                                border: "1px solid #e0e0e0",
                                cursor: "pointer",
                                transition: "all 0.2s",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.boxShadow =
                                  "0 4px 12px rgba(0,0,0,0.15)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.boxShadow = "none";
                                e.currentTarget.style.transform = "translateY(0)";
                              }}
                              onClick={() => this.handleViewReport(report.id)}
                            >
                              <div className="body">
                                <div className="d-flex align-items-start">
                                  <div
                                    style={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: 8,
                                      background: `${group.color}20`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      marginRight: 12,
                                    }}
                                  >
                                    <i
                                      className={`fa ${report.icon}`}
                                      style={{ color: group.color, fontSize: 18 }}
                                    ></i>
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <h6 className="mb-1">{report.name}</h6>
                                    <small className="text-muted">
                                      {report.description}
                                    </small>
                                  </div>
                                </div>
                                <div className="mt-3 text-right">
                                  <button
                                    className="btn btn-sm btn-outline-primary mr-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.handleViewReport(report.id);
                                    }}
                                    title="Xem báo cáo"
                                  >
                                    <i className="fa fa-eye"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-success mr-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.handleExport(report.id, "excel");
                                    }}
                                    title="Xuất Excel"
                                  >
                                    <i className="fa fa-file-excel-o"></i>
                                  </button>
                                  <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      this.handleExport(report.id, "pdf");
                                    }}
                                    title="Xuất PDF"
                                  >
                                    <i className="fa fa-file-pdf-o"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ navigationReducer }) => {
  return { navigationReducer };
};

export default connect(mapStateToProps)(Reports);
