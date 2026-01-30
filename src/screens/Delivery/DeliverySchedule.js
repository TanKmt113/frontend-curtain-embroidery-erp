/**
 * Delivery Schedule Screen
 * Lịch giao hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { deliveryService } from "../../api";
import { toastError } from "../../utils/toast";

class DeliverySchedule extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deliveries: [],
      loading: true,
      currentDate: new Date(),
      viewMode: "week", // week | month
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadSchedule();
  }

  loadSchedule = async () => {
    const { currentDate, viewMode } = this.state;
    this.setState({ loading: true });

    const startDate = this.getStartDate(currentDate, viewMode);
    const endDate = this.getEndDate(currentDate, viewMode);

    try {
      const response = await deliveryService.getSchedule({
        startDate: startDate.toISOString().split("T")[0],
        endDate: endDate.toISOString().split("T")[0],
      });

      this.setState({
        deliveries: response.data || [],
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải lịch giao hàng");
      this.setState({ loading: false });
    }
  };

  getStartDate = (date, mode) => {
    const d = new Date(date);
    if (mode === "week") {
      const day = d.getDay();
      d.setDate(d.getDate() - day + 1); // Monday
    } else {
      d.setDate(1);
    }
    return d;
  };

  getEndDate = (date, mode) => {
    const d = new Date(date);
    if (mode === "week") {
      const day = d.getDay();
      d.setDate(d.getDate() - day + 7); // Sunday
    } else {
      d.setMonth(d.getMonth() + 1);
      d.setDate(0);
    }
    return d;
  };

  handlePrev = () => {
    const { currentDate, viewMode } = this.state;
    const d = new Date(currentDate);
    if (viewMode === "week") {
      d.setDate(d.getDate() - 7);
    } else {
      d.setMonth(d.getMonth() - 1);
    }
    this.setState({ currentDate: d }, () => this.loadSchedule());
  };

  handleNext = () => {
    const { currentDate, viewMode } = this.state;
    const d = new Date(currentDate);
    if (viewMode === "week") {
      d.setDate(d.getDate() + 7);
    } else {
      d.setMonth(d.getMonth() + 1);
    }
    this.setState({ currentDate: d }, () => this.loadSchedule());
  };

  handleToday = () => {
    this.setState({ currentDate: new Date() }, () => this.loadSchedule());
  };

  handleViewModeChange = (mode) => {
    this.setState({ viewMode: mode }, () => this.loadSchedule());
  };

  getDeliveriesForDate = (date) => {
    const { deliveries } = this.state;
    const dateStr = date.toISOString().split("T")[0];
    return deliveries.filter(
      (d) => d.scheduledDate?.split("T")[0] === dateStr
    );
  };

  getStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      IN_PROGRESS: "primary",
      DELIVERED: "success",
      CANCELLED: "danger",
    };
    return colors[status] || "secondary";
  };

  formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
  };

  renderWeekView = () => {
    const { currentDate } = this.state;
    const startDate = this.getStartDate(currentDate, "week");
    const days = [];
    const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

    for (let i = 0; i < 7; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      days.push(d);
    }

    return (
      <div className="row">
        {days.map((day, index) => {
          const dayDeliveries = this.getDeliveriesForDate(day);
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div key={index} className="col-md">
              <div className={`card ${isToday ? "border-primary" : ""}`}>
                <div
                  className={`card-header text-center ${
                    isToday ? "bg-primary text-white" : ""
                  }`}
                >
                  <strong>{dayNames[index]}</strong>
                  <br />
                  <span>{day.getDate()}/{day.getMonth() + 1}</span>
                </div>
                <div className="card-body p-2" style={{ minHeight: "200px" }}>
                  {dayDeliveries.length === 0 ? (
                    <p className="text-muted text-center small">Không có lịch</p>
                  ) : (
                    dayDeliveries.map((delivery) => (
                      <Link
                        key={delivery.id}
                        to={`/delivery-detail/${delivery.id}`}
                        className={`d-block p-2 mb-2 rounded bg-${this.getStatusColor(
                          delivery.status
                        )} text-white text-decoration-none`}
                        style={{ fontSize: "12px" }}
                      >
                        <strong>{this.formatTime(delivery.scheduledTime)}</strong>
                        <br />
                        {delivery.order?.code}
                        <br />
                        <small>{delivery.order?.customer?.name}</small>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  render() {
    const { loading, currentDate, viewMode } = this.state;
    const monthNames = [
      "Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6",
      "Tháng 7", "Tháng 8", "Tháng 9", "Tháng 10", "Tháng 11", "Tháng 12"
    ];

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
              HeaderText="Lịch giao hàng"
              Breadcrumb={[
                { name: "Giao hàng", navigate: "/deliveries" },
                { name: "Lịch giao", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <div className="row align-items-center">
                      <div className="col-md-4">
                        <div className="btn-group">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={this.handlePrev}
                          >
                            <i className="fa fa-chevron-left"></i>
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={this.handleToday}
                          >
                            Hôm nay
                          </button>
                          <button
                            className="btn btn-outline-secondary"
                            onClick={this.handleNext}
                          >
                            <i className="fa fa-chevron-right"></i>
                          </button>
                        </div>
                      </div>
                      <div className="col-md-4 text-center">
                        <h4 className="mb-0">
                          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                        </h4>
                      </div>
                      <div className="col-md-4 text-right">
                        <div className="btn-group">
                          <button
                            className={`btn ${
                              viewMode === "week"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => this.handleViewModeChange("week")}
                          >
                            Tuần
                          </button>
                          <button
                            className={`btn ${
                              viewMode === "month"
                                ? "btn-primary"
                                : "btn-outline-primary"
                            }`}
                            onClick={() => this.handleViewModeChange("month")}
                          >
                            Tháng
                          </button>
                        </div>
                        <Link
                          to="/delivery-create"
                          className="btn btn-success ml-2"
                        >
                          <i className="fa fa-plus"></i> Tạo mới
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="body">
                    {loading ? (
                      <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : (
                      this.renderWeekView()
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="row">
              <div className="col-lg-12">
                <div className="card">
                  <div className="body py-2">
                    <div className="d-flex justify-content-center">
                      <span className="mr-4">
                        <span className="badge badge-warning mr-1">&nbsp;</span>
                        Chờ giao
                      </span>
                      <span className="mr-4">
                        <span className="badge badge-primary mr-1">&nbsp;</span>
                        Đang giao
                      </span>
                      <span className="mr-4">
                        <span className="badge badge-success mr-1">&nbsp;</span>
                        Đã giao
                      </span>
                      <span>
                        <span className="badge badge-danger mr-1">&nbsp;</span>
                        Đã hủy
                      </span>
                    </div>
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

export default connect(mapStateToProps, {})(DeliverySchedule);
