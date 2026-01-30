/**
 * Delivery Form Screen
 * Tạo/Sửa phiếu giao hàng
 */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { deliveryService, orderService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class DeliveryForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      loading: false,
      submitting: false,
      orders: [],
      formData: {
        orderId: "",
        scheduledDate: new Date().toISOString().split("T")[0],
        scheduledTime: "09:00",
        driverName: "",
        driverPhone: "",
        vehicleNumber: "",
        deliveryAddress: "",
        notes: "",
        items: [],
      },
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadOrders();

    const { id } = this.props.match.params;
    if (id) {
      this.setState({ isEdit: true });
      this.loadDelivery(id);
    }

    // Check if orderId from query params
    const params = new URLSearchParams(this.props.location.search);
    const orderId = params.get("orderId");
    if (orderId) {
      this.handleOrderChange(orderId);
    }
  }

  loadOrders = async () => {
    try {
      const response = await orderService.getAll({
        limit: 100,
        status: "READY_FOR_DELIVERY",
      });
      this.setState({ orders: response.data || [] });
    } catch (error) {
      console.error("Load orders error:", error);
    }
  };

  loadDelivery = async (id) => {
    this.setState({ loading: true });
    try {
      const response = await deliveryService.getById(id);
      this.setState({
        formData: {
          ...response.data,
          scheduledDate: response.data.scheduledDate?.split("T")[0],
        },
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin phiếu giao");
      this.setState({ loading: false });
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: { ...this.state.formData, [name]: value },
      errors: { ...this.state.errors, [name]: "" },
    });
  };

  handleOrderChange = async (orderId) => {
    if (!orderId) {
      this.setState({
        formData: {
          ...this.state.formData,
          orderId: "",
          deliveryAddress: "",
          items: [],
        },
      });
      return;
    }

    try {
      const response = await orderService.getById(orderId);
      const order = response.data;

      this.setState({
        formData: {
          ...this.state.formData,
          orderId,
          deliveryAddress: order.deliveryAddress || order.customer?.address || "",
          items:
            order.items?.map((item) => ({
              orderItemId: item.id,
              productName: item.product?.name,
              quantity: item.quantity,
              deliverQuantity: item.quantity - (item.deliveredQuantity || 0),
              location: item.location,
            })) || [],
        },
      });
    } catch (error) {
      console.error("Load order error:", error);
    }
  };

  handleItemChange = (index, field, value) => {
    const { items } = this.state.formData;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    this.setState({
      formData: { ...this.state.formData, items: newItems },
    });
  };

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.orderId) {
      errors.orderId = "Vui lòng chọn đơn hàng";
    }
    if (!formData.scheduledDate) {
      errors.scheduledDate = "Vui lòng chọn ngày giao";
    }
    if (!formData.deliveryAddress) {
      errors.deliveryAddress = "Vui lòng nhập địa chỉ giao hàng";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validate()) return;

    this.setState({ submitting: true });
    const { isEdit, formData } = this.state;
    const { id } = this.props.match.params;

    try {
      if (isEdit) {
        await deliveryService.update(id, formData);
        toastSuccess("Cập nhật phiếu giao thành công");
      } else {
        await deliveryService.create(formData);
        toastSuccess("Tạo phiếu giao thành công");
      }
      this.props.history.push("/deliveries");
    } catch (error) {
      if (error.errors) {
        this.setState({ errors: error.errors });
      }
      toastError(error.message || "Có lỗi xảy ra");
    } finally {
      this.setState({ submitting: false });
    }
  };

  render() {
    const { isEdit, loading, submitting, formData, errors, orders } = this.state;

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
              HeaderText={isEdit ? "Sửa phiếu giao" : "Tạo phiếu giao"}
              Breadcrumb={[
                { name: "Giao hàng", navigate: "/deliveries" },
                { name: isEdit ? "Sửa" : "Tạo mới", navigate: "" },
              ]}
            />

            <form onSubmit={this.handleSubmit}>
              <div className="row clearfix">
                {/* Thông tin phiếu giao */}
                <div className="col-lg-4 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Thông tin phiếu giao</h2>
                    </div>
                    <div className="body">
                      <div className="form-group">
                        <label>
                          Đơn hàng <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.orderId ? "is-invalid" : ""}`}
                          name="orderId"
                          value={formData.orderId}
                          onChange={(e) => this.handleOrderChange(e.target.value)}
                          disabled={isEdit}
                        >
                          <option value="">-- Chọn đơn hàng --</option>
                          {orders.map((order) => (
                            <option key={order.id} value={order.id}>
                              {order.code} - {order.customer?.name}
                            </option>
                          ))}
                        </select>
                        {errors.orderId && (
                          <div className="invalid-feedback">{errors.orderId}</div>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-md-7">
                          <div className="form-group">
                            <label>
                              Ngày giao <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className={`form-control ${
                                errors.scheduledDate ? "is-invalid" : ""
                              }`}
                              name="scheduledDate"
                              value={formData.scheduledDate}
                              onChange={this.handleChange}
                            />
                            {errors.scheduledDate && (
                              <div className="invalid-feedback">{errors.scheduledDate}</div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-5">
                          <div className="form-group">
                            <label>Giờ giao</label>
                            <input
                              type="time"
                              className="form-control"
                              name="scheduledTime"
                              value={formData.scheduledTime}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          Địa chỉ giao <span className="text-danger">*</span>
                        </label>
                        <textarea
                          className={`form-control ${
                            errors.deliveryAddress ? "is-invalid" : ""
                          }`}
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={this.handleChange}
                          rows="3"
                          placeholder="Nhập địa chỉ giao hàng"
                        />
                        {errors.deliveryAddress && (
                          <div className="invalid-feedback">{errors.deliveryAddress}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
                          onChange={this.handleChange}
                          rows="2"
                          placeholder="Ghi chú giao hàng"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Thông tin vận chuyển */}
                  <div className="card">
                    <div className="header">
                      <h2>Thông tin vận chuyển</h2>
                    </div>
                    <div className="body">
                      <div className="form-group">
                        <label>Tài xế</label>
                        <input
                          type="text"
                          className="form-control"
                          name="driverName"
                          value={formData.driverName}
                          onChange={this.handleChange}
                          placeholder="Tên tài xế"
                        />
                      </div>

                      <div className="form-group">
                        <label>SĐT tài xế</label>
                        <input
                          type="text"
                          className="form-control"
                          name="driverPhone"
                          value={formData.driverPhone}
                          onChange={this.handleChange}
                          placeholder="Số điện thoại"
                        />
                      </div>

                      <div className="form-group">
                        <label>Biển số xe</label>
                        <input
                          type="text"
                          className="form-control"
                          name="vehicleNumber"
                          value={formData.vehicleNumber}
                          onChange={this.handleChange}
                          placeholder="VD: 51A-123.45"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <button
                      type="submit"
                      className="btn btn-primary btn-block"
                      disabled={submitting}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save mr-2"></i>
                          {isEdit ? "Cập nhật" : "Tạo phiếu giao"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={() => this.props.history.push("/deliveries")}
                    >
                      <i className="fa fa-times mr-2"></i> Hủy
                    </button>
                  </div>
                </div>

                {/* Danh sách sản phẩm giao */}
                <div className="col-lg-8 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Sản phẩm giao hàng</h2>
                    </div>
                    <div className="body">
                      {formData.items.length === 0 ? (
                        <div className="text-center text-muted py-5">
                          <i className="fa fa-truck fa-3x mb-3"></i>
                          <p>Vui lòng chọn đơn hàng để xem danh sách sản phẩm</p>
                        </div>
                      ) : (
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Sản phẩm</th>
                                <th>Vị trí lắp</th>
                                <th className="text-center">SL đặt</th>
                                <th className="text-center">SL giao</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.items.map((item, index) => (
                                <tr key={index}>
                                  <td>{item.productName}</td>
                                  <td>
                                    <small className="text-muted">
                                      {item.location || "-"}
                                    </small>
                                  </td>
                                  <td className="text-center">{item.quantity}</td>
                                  <td style={{ width: "120px" }}>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm text-center"
                                      value={item.deliverQuantity}
                                      onChange={(e) =>
                                        this.handleItemChange(
                                          index,
                                          "deliverQuantity",
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      min="0"
                                      max={item.quantity}
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(withRouter(DeliveryForm));
