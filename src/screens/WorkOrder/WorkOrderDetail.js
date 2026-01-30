/**
 * WorkOrder Detail Screen
 * Chi tiết lệnh sản xuất - Cập nhật tiến độ công đoạn
 */

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ProductionSteps from "../../components/WorkOrder/ProductionSteps";
import { workOrderService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class WorkOrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      workOrder: null,
      loading: true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { id } = this.props.match.params;
    this.loadWorkOrder(id);
  }

  loadWorkOrder = async (id) => {
    try {
      const response = await workOrderService.getById(id);
      this.setState({
        workOrder: response.data,
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin lệnh sản xuất");
      this.setState({ loading: false });
    }
  };

  handleStepUpdate = async (stepId, data) => {
    const { workOrder } = this.state;
    try {
      await workOrderService.updateStep(workOrder.id, stepId, data);
      toastSuccess("Cập nhật công đoạn thành công");
      this.loadWorkOrder(workOrder.id);
    } catch (error) {
      toastError(error.message || "Không thể cập nhật công đoạn");
    }
  };

  getStatusBadge = (status) => {
    const statuses = {
      PENDING: { label: "Chờ sản xuất", class: "badge-warning" },
      IN_PROGRESS: { label: "Đang sản xuất", class: "badge-primary" },
      COMPLETED: { label: "Hoàn thành", class: "badge-success" },
      ON_HOLD: { label: "Tạm dừng", class: "badge-secondary" },
      CANCELLED: { label: "Đã hủy", class: "badge-danger" },
    };
    const statusInfo = statuses[status] || { label: status, class: "badge-secondary" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  calculateProgress = () => {
    const { workOrder } = this.state;
    if (!workOrder?.steps?.length) return 0;
    
    const completedSteps = workOrder.steps.filter(
      (step) => step.status === "COMPLETED"
    ).length;
    return Math.round((completedSteps / workOrder.steps.length) * 100);
  };

  render() {
    const { workOrder, loading } = this.state;

    if (loading) {
      return (
        <div className="container-fluid">
          <div className="text-center p-5">
            <div className="spinner-border text-primary" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        </div>
      );
    }

    if (!workOrder) {
      return (
        <div className="container-fluid">
          <div className="alert alert-danger">Không tìm thấy lệnh sản xuất</div>
        </div>
      );
    }

    const progress = this.calculateProgress();

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
              HeaderText={`Lệnh sản xuất ${workOrder.code}`}
              Breadcrumb={[
                { name: "Sản xuất", navigate: "/work-orders" },
                { name: workOrder.code, navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {/* Thông tin lệnh sản xuất */}
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Thông tin chung</h2>
                  </div>
                  <div className="body">
                    <div className="mb-4 text-center">
                      <h4 className="mb-2">{workOrder.code}</h4>
                      {this.getStatusBadge(workOrder.status)}
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="d-flex justify-content-between mb-1">
                        <small>Tiến độ</small>
                        <small>{progress}%</small>
                      </div>
                      <div className="progress" style={{ height: "10px" }}>
                        <div
                          className={`progress-bar ${
                            progress === 100 ? "bg-success" : "bg-primary"
                          }`}
                          role="progressbar"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <strong>Đơn hàng:</strong>
                        <Link
                          to={`/order-detail/${workOrder.orderItem?.order?.id}`}
                          className="float-right text-primary"
                        >
                          {workOrder.orderItem?.order?.code}
                        </Link>
                      </li>
                      <li className="mb-3">
                        <strong>Sản phẩm:</strong>
                        <span className="float-right">
                          {workOrder.orderItem?.product?.name}
                        </span>
                      </li>
                      <li className="mb-3">
                        <strong>Số lượng:</strong>
                        <span className="float-right">{workOrder.orderItem?.quantity}</span>
                      </li>
                      <li className="mb-3">
                        <strong>Kích thước:</strong>
                        <span className="float-right">
                          {workOrder.orderItem?.width} x {workOrder.orderItem?.height} cm
                        </span>
                      </li>
                      <li className="mb-3">
                        <strong>Vị trí:</strong>
                        <span className="float-right">
                          {workOrder.orderItem?.location || "-"}
                        </span>
                      </li>
                      <li className="mb-3">
                        <strong>Ngày bắt đầu:</strong>
                        <span className="float-right">
                          {this.formatDate(workOrder.startDate)}
                        </span>
                      </li>
                      <li className="mb-3">
                        <strong>Ngày dự kiến HT:</strong>
                        <span className="float-right">
                          {this.formatDate(workOrder.expectedEndDate)}
                        </span>
                      </li>
                      <li className="mb-3">
                        <strong>Ngày hoàn thành:</strong>
                        <span className="float-right">
                          {this.formatDate(workOrder.actualEndDate)}
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Khách hàng */}
                <div className="card">
                  <div className="header">
                    <h2>Khách hàng</h2>
                  </div>
                  <div className="body">
                    <h5>{workOrder.orderItem?.order?.customer?.name}</h5>
                    <p className="text-muted mb-2">
                      {workOrder.orderItem?.order?.customer?.phone}
                    </p>
                  </div>
                </div>

                {/* Ghi chú */}
                {workOrder.notes && (
                  <div className="card">
                    <div className="header">
                      <h2>Ghi chú</h2>
                    </div>
                    <div className="body">
                      <p className="mb-0">{workOrder.notes}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Công đoạn sản xuất */}
              <div className="col-lg-8 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Công đoạn sản xuất</h2>
                  </div>
                  <div className="body">
                    <ProductionSteps
                      steps={workOrder.steps || []}
                      onStepUpdate={this.handleStepUpdate}
                    />
                  </div>
                </div>

                {/* Lịch sử */}
                <div className="card">
                  <div className="header">
                    <h2>Lịch sử cập nhật</h2>
                  </div>
                  <div className="body">
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>Thời gian</th>
                            <th>Công đoạn</th>
                            <th>Trạng thái</th>
                            <th>Người thực hiện</th>
                            <th>Ghi chú</th>
                          </tr>
                        </thead>
                        <tbody>
                          {workOrder.history?.map((item, index) => (
                            <tr key={index}>
                              <td>{this.formatDate(item.createdAt)}</td>
                              <td>{item.step?.name || "-"}</td>
                              <td>{this.getStatusBadge(item.status)}</td>
                              <td>{item.user?.name || "-"}</td>
                              <td>{item.note || "-"}</td>
                            </tr>
                          )) || (
                            <tr>
                              <td colSpan="5" className="text-center text-muted">
                                Chưa có lịch sử
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
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

export default connect(mapStateToProps, {})(withRouter(WorkOrderDetail));
