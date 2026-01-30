/**
 * Order Detail Screen
 * Chi tiết đơn hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { orderService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class OrderDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      order: null,
      loading: true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { id } = this.props.match.params;
    this.loadOrder(id);
  }

  loadOrder = async (id) => {
    try {
      const response = await orderService.getById(id);
      this.setState({
        order: response.data,
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin đơn hàng");
      this.setState({ loading: false });
    }
  };

  handleStatusChange = async (status) => {
    const { order } = this.state;
    const confirmMsg = this.getStatusConfirmMessage(status);
    
    if (!window.confirm(confirmMsg)) return;

    try {
      await orderService.updateStatus(order.id, status);
      toastSuccess("Cập nhật trạng thái thành công");
      this.loadOrder(order.id);
    } catch (error) {
      toastError(error.message || "Không thể cập nhật trạng thái");
    }
  };

  getStatusConfirmMessage = (status) => {
    const messages = {
      CONFIRMED: "Xác nhận đơn hàng này?",
      IN_PRODUCTION: "Chuyển đơn hàng sang trạng thái sản xuất?",
      READY_FOR_DELIVERY: "Xác nhận đơn hàng đã sẵn sàng giao?",
      DELIVERED: "Xác nhận đã giao hàng?",
      COMPLETED: "Xác nhận hoàn thành đơn hàng?",
      CANCELLED: "Hủy đơn hàng này?",
    };
    return messages[status] || "Xác nhận thay đổi trạng thái?";
  };

  getStatusBadge = (status) => {
    const statuses = {
      PENDING: { label: "Chờ xác nhận", class: "badge-warning" },
      CONFIRMED: { label: "Đã xác nhận", class: "badge-info" },
      IN_PRODUCTION: { label: "Đang sản xuất", class: "badge-primary" },
      READY_FOR_DELIVERY: { label: "Sẵn sàng giao", class: "badge-success" },
      PARTIALLY_DELIVERED: { label: "Giao một phần", class: "badge-info" },
      DELIVERED: { label: "Đã giao", class: "badge-success" },
      COMPLETED: { label: "Hoàn thành", class: "badge-success" },
      CANCELLED: { label: "Đã hủy", class: "badge-danger" },
    };
    const statusInfo = statuses[status] || { label: status, class: "badge-secondary" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  getNextStatuses = (currentStatus) => {
    const transitions = {
      PENDING: ["CONFIRMED", "CANCELLED"],
      CONFIRMED: ["IN_PRODUCTION", "CANCELLED"],
      IN_PRODUCTION: ["READY_FOR_DELIVERY"],
      READY_FOR_DELIVERY: ["DELIVERED"],
      DELIVERED: ["COMPLETED"],
    };
    return transitions[currentStatus] || [];
  };

  render() {
    const { order, loading } = this.state;

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

    if (!order) {
      return (
        <div className="container-fluid">
          <div className="alert alert-danger">Không tìm thấy đơn hàng</div>
        </div>
      );
    }

    const nextStatuses = this.getNextStatuses(order.status);

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
              HeaderText={`Đơn hàng ${order.code}`}
              Breadcrumb={[
                { name: "Đơn hàng", navigate: "/orders" },
                { name: order.code, navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {/* Thông tin đơn hàng */}
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Thông tin đơn hàng</h2>
                    {order.status === "PENDING" && (
                      <Link
                        to={`/order-edit/${order.id}`}
                        className="btn btn-sm btn-outline-primary float-right"
                      >
                        <i className="fa fa-edit"></i> Sửa
                      </Link>
                    )}
                  </div>
                  <div className="body">
                    <div className="mb-4 text-center">
                      <h4 className="mb-2">{order.code}</h4>
                      {this.getStatusBadge(order.status)}
                    </div>

                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <strong>Ngày tạo:</strong>
                        <span className="float-right">{this.formatDate(order.createdAt)}</span>
                      </li>
                      <li className="mb-3">
                        <strong>Người tạo:</strong>
                        <span className="float-right">{order.createdBy?.name || "-"}</span>
                      </li>
                      <li className="mb-3">
                        <strong>Tổng tiền:</strong>
                        <span className="float-right text-primary font-weight-bold">
                          {this.formatCurrency(order.totalAmount)}
                        </span>
                      </li>
                    </ul>

                    {/* Action buttons */}
                    {nextStatuses.length > 0 && (
                      <div className="mt-4">
                        <h6>Thao tác:</h6>
                        {nextStatuses.map((status) => (
                          <button
                            key={status}
                            className={`btn btn-sm mr-2 mb-2 ${
                              status === "CANCELLED" ? "btn-danger" : "btn-primary"
                            }`}
                            onClick={() => this.handleStatusChange(status)}
                          >
                            {this.getStatusActionLabel(status)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Thông tin khách hàng */}
                <div className="card">
                  <div className="header">
                    <h2>Khách hàng</h2>
                  </div>
                  <div className="body">
                    <h5>
                      <Link to={`/customer-detail/${order.customer?.id}`}>
                        {order.customer?.name}
                      </Link>
                    </h5>
                    <p className="text-muted mb-2">{order.customer?.code}</p>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fa fa-phone mr-2"></i>
                        {order.customer?.phone || "-"}
                      </li>
                      <li className="mb-2">
                        <i className="fa fa-envelope mr-2"></i>
                        {order.customer?.email || "-"}
                      </li>
                      <li>
                        <i className="fa fa-map-marker mr-2"></i>
                        {order.deliveryAddress || order.customer?.address || "-"}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Danh sách sản phẩm */}
              <div className="col-lg-8 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Chi tiết đơn hàng ({order.items?.length || 0} sản phẩm)</h2>
                  </div>
                  <div className="body table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Sản phẩm</th>
                          <th>Kích thước</th>
                          <th className="text-center">SL</th>
                          <th className="text-right">Đơn giá</th>
                          <th className="text-right">Thành tiền</th>
                        </tr>
                      </thead>
                      <tbody>
                        {order.items?.map((item, index) => (
                          <tr key={item.id || index}>
                            <td>{index + 1}</td>
                            <td>
                              <strong>{item.product?.name || item.description}</strong>
                              {item.location && (
                                <small className="d-block text-muted">
                                  Vị trí: {item.location}
                                </small>
                              )}
                            </td>
                            <td>
                              {item.width && item.height
                                ? `${item.width} x ${item.height}`
                                : "-"}
                            </td>
                            <td className="text-center">{item.quantity}</td>
                            <td className="text-right">
                              {this.formatCurrency(item.unitPrice)}
                            </td>
                            <td className="text-right">
                              {this.formatCurrency(item.quantity * item.unitPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-light">
                          <th colSpan="5" className="text-right">
                            Tổng cộng:
                          </th>
                          <th className="text-right text-primary">
                            {this.formatCurrency(order.totalAmount)}
                          </th>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>

                {/* Ghi chú */}
                {order.notes && (
                  <div className="card">
                    <div className="header">
                      <h2>Ghi chú</h2>
                    </div>
                    <div className="body">
                      <p className="mb-0">{order.notes}</p>
                    </div>
                  </div>
                )}

                {/* Lịch sử */}
                <div className="card">
                  <div className="header">
                    <h2>Lịch sử đơn hàng</h2>
                  </div>
                  <div className="body">
                    <ul className="timeline">
                      {order.history?.map((item, index) => (
                        <li key={index} className="timeline-item">
                          <div className="timeline-badge">
                            <i className="fa fa-circle"></i>
                          </div>
                          <div className="timeline-panel">
                            <div className="timeline-heading">
                              <h6 className="timeline-title">
                                {this.getStatusBadge(item.status)}
                              </h6>
                              <small className="text-muted">
                                {this.formatDate(item.createdAt)}
                              </small>
                            </div>
                            {item.note && (
                              <div className="timeline-body">
                                <p>{item.note}</p>
                              </div>
                            )}
                          </div>
                        </li>
                      )) || (
                        <li className="text-muted">Chưa có lịch sử</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getStatusActionLabel = (status) => {
    const labels = {
      CONFIRMED: "Xác nhận đơn",
      IN_PRODUCTION: "Chuyển sản xuất",
      READY_FOR_DELIVERY: "Sẵn sàng giao",
      DELIVERED: "Xác nhận đã giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Hủy đơn",
    };
    return labels[status] || status;
  };
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(withRouter(OrderDetail));
