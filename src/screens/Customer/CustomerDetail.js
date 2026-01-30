/**
 * Customer Detail Screen
 * Chi tiết khách hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { customerService } from "../../api";
import { toastError } from "../../utils/toast";

class CustomerDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customer: null,
      orders: [],
      loading: true,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { id } = this.props.match.params;
    this.loadCustomer(id);
  }

  loadCustomer = async (id) => {
    try {
      // Chỉ load thông tin khách hàng trước
      const customerRes = await customerService.getById(id);
      
      this.setState({
        customer: customerRes.data,
        loading: false,
      });

      // Thử load lịch sử đơn hàng nếu API hỗ trợ
      try {
        const ordersRes = await customerService.getOrderHistory(id, { limit: 10 });
        this.setState({
          orders: ordersRes.data || [],
        });
      } catch (e) {
        // API order history chưa có, bỏ qua
        console.log("Order history API not available");
      }
    } catch (error) {
      toastError("Không thể tải thông tin khách hàng");
      this.setState({ loading: false });
    }
  };

  getCustomerTypeBadge = (type) => {
    const types = {
      INDIVIDUAL: { label: "Cá nhân", class: "badge-info" },
      COMPANY: { label: "Công ty", class: "badge-primary" },
      CONSIGNMENT: { label: "Ký gửi", class: "badge-warning" },
    };
    const typeInfo = types[type] || { label: type, class: "badge-secondary" };
    return <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>;
  };

  formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
  };

  render() {
    const { customer, orders, loading } = this.state;

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

    if (!customer) {
      return (
        <div className="container-fluid">
          <div className="alert alert-danger">Không tìm thấy khách hàng</div>
        </div>
      );
    }

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
              HeaderText="Chi tiết khách hàng"
              Breadcrumb={[
                { name: "Khách hàng", navigate: "/customers" },
                { name: customer.name, navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {/* Thông tin khách hàng */}
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>Thông tin khách hàng</h2>
                    <Link
                      to={`/customer-edit/${customer.id}`}
                      className="btn btn-sm btn-outline-primary float-right"
                    >
                      <i className="fa fa-edit"></i> Sửa
                    </Link>
                  </div>
                  <div className="body">
                    <div className="text-center mb-4">
                      <div
                        className="rounded-circle bg-primary text-white d-inline-flex align-items-center justify-content-center"
                        style={{ width: 80, height: 80, fontSize: 32 }}
                      >
                        {customer.name.charAt(0).toUpperCase()}
                      </div>
                      <h4 className="mt-3 mb-1">{customer.name}</h4>
                      <p className="mb-2">{this.getCustomerTypeBadge(customer.type)}</p>
                      <p className="text-muted">{customer.code}</p>
                    </div>

                    <ul className="list-unstyled">
                      <li className="mb-3">
                        <i className="fa fa-phone text-primary mr-2"></i>
                        <strong>Điện thoại:</strong> {customer.phone || "-"}
                      </li>
                      <li className="mb-3">
                        <i className="fa fa-envelope text-primary mr-2"></i>
                        <strong>Email:</strong> {customer.email || "-"}
                      </li>
                      <li className="mb-3">
                        <i className="fa fa-map-marker text-primary mr-2"></i>
                        <strong>Địa chỉ:</strong> {customer.address || "-"}
                      </li>
                      {customer.type === "COMPANY" && (
                        <>
                          <li className="mb-3">
                            <i className="fa fa-building text-primary mr-2"></i>
                            <strong>MST:</strong> {customer.taxCode || "-"}
                          </li>
                          <li className="mb-3">
                            <i className="fa fa-user text-primary mr-2"></i>
                            <strong>Liên hệ:</strong> {customer.contactPerson || "-"}
                          </li>
                        </>
                      )}
                      <li className="mb-3">
                        <i className="fa fa-calendar text-primary mr-2"></i>
                        <strong>Ngày tạo:</strong> {this.formatDate(customer.createdAt)}
                      </li>
                    </ul>

                    {customer.notes && (
                      <div className="mt-3 p-3 bg-light rounded">
                        <strong>Ghi chú:</strong>
                        <p className="mb-0 mt-2">{customer.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Thống kê và lịch sử */}
              <div className="col-lg-8 col-md-12">
                {/* Thống kê */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="card">
                      <div className="body text-center">
                        <h3 className="mb-1 text-primary">{customer.totalOrders || 0}</h3>
                        <p className="mb-0 text-muted">Tổng đơn hàng</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="body text-center">
                        <h3 className="mb-1 text-success">
                          {this.formatCurrency(customer.totalRevenue || 0)}
                        </h3>
                        <p className="mb-0 text-muted">Tổng doanh thu</p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card">
                      <div className="body text-center">
                        <h3 className="mb-1 text-warning">
                          {this.formatCurrency(customer.outstandingAmount || 0)}
                        </h3>
                        <p className="mb-0 text-muted">Công nợ</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lịch sử đơn hàng */}
                <div className="card">
                  <div className="header">
                    <h2>Lịch sử đơn hàng</h2>
                    <Link
                      to={`/order-create?customerId=${customer.id}`}
                      className="btn btn-sm btn-primary float-right"
                    >
                      <i className="fa fa-plus"></i> Tạo đơn hàng
                    </Link>
                  </div>
                  <div className="body table-responsive">
                    {orders.length > 0 ? (
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Mã đơn</th>
                            <th>Ngày tạo</th>
                            <th>Tổng tiền</th>
                            <th>Trạng thái</th>
                            <th></th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <tr key={order.id}>
                              <td>
                                <Link to={`/order-detail/${order.id}`}>
                                  {order.code}
                                </Link>
                              </td>
                              <td>{this.formatDate(order.createdAt)}</td>
                              <td>{this.formatCurrency(order.totalAmount)}</td>
                              <td>
                                <span className={`badge badge-${this.getOrderStatusColor(order.status)}`}>
                                  {this.getOrderStatusLabel(order.status)}
                                </span>
                              </td>
                              <td>
                                <Link
                                  to={`/order-detail/${order.id}`}
                                  className="btn btn-sm btn-outline-info"
                                >
                                  <i className="fa fa-eye"></i>
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center text-muted py-4">
                        <i className="fa fa-inbox fa-3x mb-3"></i>
                        <p>Chưa có đơn hàng nào</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  getOrderStatusColor = (status) => {
    const colors = {
      PENDING: "warning",
      CONFIRMED: "info",
      IN_PRODUCTION: "primary",
      READY_FOR_DELIVERY: "success",
      DELIVERED: "success",
      COMPLETED: "success",
      CANCELLED: "danger",
    };
    return colors[status] || "secondary";
  };

  getOrderStatusLabel = (status) => {
    const labels = {
      PENDING: "Chờ xác nhận",
      CONFIRMED: "Đã xác nhận",
      IN_PRODUCTION: "Đang sản xuất",
      READY_FOR_DELIVERY: "Sẵn sàng giao",
      DELIVERED: "Đã giao",
      COMPLETED: "Hoàn thành",
      CANCELLED: "Đã hủy",
    };
    return labels[status] || status;
  };
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(withRouter(CustomerDetail));
