/**
 * WorkOrder Create Screen
 * Tạo lệnh sản xuất mới
 */

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { workOrderService, orderService, productService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

// Production steps configuration
const PRODUCTION_STEPS = [
  { id: "CUTTING", name: "Cắt vải", order: 1 },
  { id: "SEWING", name: "May", order: 2 },
  { id: "EMBROIDERY", name: "Thêu", order: 3 },
  { id: "FINISHING", name: "Hoàn thiện", order: 4 },
  { id: "QC", name: "Kiểm tra QC", order: 5 },
  { id: "PACKAGING", name: "Đóng gói", order: 6 },
];

class WorkOrderCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orderId: "",
        orderItemId: "",
        productId: "",
        quantity: 1,
        priority: "NORMAL",
        plannedStartDate: "",
        plannedEndDate: "",
        notes: "",
        steps: PRODUCTION_STEPS.map((step) => ({
          stepId: step.id,
          name: step.name,
          order: step.order,
          enabled: true,
          assignedTo: "",
          estimatedHours: "",
        })),
      },
      orders: [],
      orderItems: [],
      products: [],
      loading: false,
      loadingOrders: true,
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadOrders();
    this.loadProducts();

    // Check if creating from order
    const params = new URLSearchParams(this.props.location.search);
    const orderId = params.get("orderId");
    if (orderId) {
      this.handleOrderChange({ target: { value: orderId } });
    }
  }

  loadOrders = async () => {
    try {
      const response = await orderService.getAll({
        page: 1,
        limit: 100,
        status: "CONFIRMED",
      });
      this.setState({
        orders: response.data || [],
        loadingOrders: false,
      });
    } catch (error) {
      toastError("Không thể tải danh sách đơn hàng");
      this.setState({ loadingOrders: false });
    }
  };

  loadProducts = async () => {
    try {
      const response = await productService.getAll({
        page: 1,
        limit: 100,
      });
      this.setState({
        products: response.data || [],
      });
    } catch (error) {
      console.error("Error loading products:", error);
    }
  };

  handleOrderChange = async (e) => {
    const orderId = e.target.value;
    this.setState({
      formData: {
        ...this.state.formData,
        orderId,
        orderItemId: "",
      },
      orderItems: [],
    });

    if (orderId) {
      try {
        const response = await orderService.getById(orderId);
        const order = response.data;
        this.setState({
          orderItems: order.items || [],
        });
      } catch (error) {
        toastError("Không thể tải chi tiết đơn hàng");
      }
    }
  };

  handleOrderItemChange = (e) => {
    const orderItemId = e.target.value;
    const { orderItems } = this.state;
    const selectedItem = orderItems.find((item) => item.id === orderItemId);

    this.setState({
      formData: {
        ...this.state.formData,
        orderItemId,
        productId: selectedItem?.productId || "",
        quantity: selectedItem?.quantity || 1,
      },
    });
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: { ...this.state.formData, [name]: value },
      errors: { ...this.state.errors, [name]: "" },
    });
  };

  handleStepChange = (index, field, value) => {
    const { formData } = this.state;
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    this.setState({
      formData: { ...formData, steps: newSteps },
    });
  };

  toggleStep = (index) => {
    const { formData } = this.state;
    const newSteps = [...formData.steps];
    newSteps[index] = { ...newSteps[index], enabled: !newSteps[index].enabled };
    this.setState({
      formData: { ...formData, steps: newSteps },
    });
  };

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.orderId) {
      errors.orderId = "Vui lòng chọn đơn hàng";
    }
    if (!formData.orderItemId) {
      errors.orderItemId = "Vui lòng chọn sản phẩm trong đơn hàng";
    }
    if (!formData.quantity || formData.quantity < 1) {
      errors.quantity = "Số lượng phải lớn hơn 0";
    }
    if (!formData.plannedStartDate) {
      errors.plannedStartDate = "Vui lòng chọn ngày bắt đầu dự kiến";
    }
    if (!formData.plannedEndDate) {
      errors.plannedEndDate = "Vui lòng chọn ngày hoàn thành dự kiến";
    }
    if (formData.plannedStartDate && formData.plannedEndDate) {
      if (new Date(formData.plannedEndDate) < new Date(formData.plannedStartDate)) {
        errors.plannedEndDate = "Ngày hoàn thành phải sau ngày bắt đầu";
      }
    }

    const enabledSteps = formData.steps.filter((s) => s.enabled);
    if (enabledSteps.length === 0) {
      errors.steps = "Phải chọn ít nhất một công đoạn sản xuất";
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validate()) {
      toastError("Vui lòng kiểm tra lại thông tin");
      return;
    }

    this.setState({ loading: true });

    try {
      const { formData } = this.state;

      // Prepare data for API
      const submitData = {
        orderId: formData.orderId,
        orderItemId: formData.orderItemId,
        productId: formData.productId,
        quantity: parseInt(formData.quantity),
        priority: formData.priority,
        plannedStartDate: formData.plannedStartDate,
        plannedEndDate: formData.plannedEndDate,
        notes: formData.notes,
        steps: formData.steps
          .filter((s) => s.enabled)
          .map((s, idx) => ({
            stepId: s.stepId,
            name: s.name,
            order: idx + 1,
            assignedTo: s.assignedTo || null,
            estimatedHours: s.estimatedHours ? parseInt(s.estimatedHours) : null,
          })),
      };

      await workOrderService.create(submitData);
      toastSuccess("Tạo lệnh sản xuất thành công");
      this.props.history.push("/work-orders");
    } catch (error) {
      toastError(error.message || "Không thể tạo lệnh sản xuất");
      this.setState({ loading: false });
    }
  };

  render() {
    const {
      formData,
      orders,
      orderItems,
      products,
      loading,
      loadingOrders,
      errors,
    } = this.state;

    const selectedOrderItem = orderItems.find(
      (item) => item.id === formData.orderItemId
    );
    const selectedProduct = products.find(
      (p) => p.id === formData.productId
    );

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
              HeaderText="Tạo lệnh sản xuất"
              Breadcrumb={[
                { name: "Sản xuất", navigate: "/work-orders" },
                { name: "Tạo lệnh SX", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-8 col-md-12">
                <form onSubmit={this.handleSubmit}>
                  {/* Thông tin đơn hàng */}
                  <div className="card">
                    <div className="header">
                      <h2>
                        <i className="fa fa-shopping-cart mr-2"></i>
                        Thông tin đơn hàng
                      </h2>
                    </div>
                    <div className="body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Đơn hàng <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control ${
                                errors.orderId ? "is-invalid" : ""
                              }`}
                              name="orderId"
                              value={formData.orderId}
                              onChange={this.handleOrderChange}
                              disabled={loadingOrders}
                            >
                              <option value="">-- Chọn đơn hàng --</option>
                              {orders.map((order) => (
                                <option key={order.id} value={order.id}>
                                  {order.code} - {order.customer?.name}
                                </option>
                              ))}
                            </select>
                            {errors.orderId && (
                              <div className="invalid-feedback">
                                {errors.orderId}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Sản phẩm <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control ${
                                errors.orderItemId ? "is-invalid" : ""
                              }`}
                              name="orderItemId"
                              value={formData.orderItemId}
                              onChange={this.handleOrderItemChange}
                              disabled={!formData.orderId}
                            >
                              <option value="">-- Chọn sản phẩm --</option>
                              {orderItems.map((item) => (
                                <option key={item.id} value={item.id}>
                                  {item.product?.name || item.productName} - SL:{" "}
                                  {item.quantity}
                                </option>
                              ))}
                            </select>
                            {errors.orderItemId && (
                              <div className="invalid-feedback">
                                {errors.orderItemId}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {selectedOrderItem && (
                        <div className="alert alert-info">
                          <strong>Chi tiết sản phẩm:</strong>
                          <br />
                          {selectedProduct?.name || selectedOrderItem.productName}
                          {selectedOrderItem.specifications && (
                            <>
                              <br />
                              <small>
                                Kích thước: {selectedOrderItem.specifications.width}m x{" "}
                                {selectedOrderItem.specifications.height}m
                              </small>
                            </>
                          )}
                        </div>
                      )}

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Số lượng sản xuất{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="number"
                              className={`form-control ${
                                errors.quantity ? "is-invalid" : ""
                              }`}
                              name="quantity"
                              value={formData.quantity}
                              onChange={this.handleChange}
                              min="1"
                            />
                            {errors.quantity && (
                              <div className="invalid-feedback">
                                {errors.quantity}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Độ ưu tiên</label>
                            <select
                              className="form-control"
                              name="priority"
                              value={formData.priority}
                              onChange={this.handleChange}
                            >
                              <option value="LOW">Thấp</option>
                              <option value="NORMAL">Bình thường</option>
                              <option value="HIGH">Cao</option>
                              <option value="URGENT">Gấp</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Ngày bắt đầu dự kiến{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className={`form-control ${
                                errors.plannedStartDate ? "is-invalid" : ""
                              }`}
                              name="plannedStartDate"
                              value={formData.plannedStartDate}
                              onChange={this.handleChange}
                            />
                            {errors.plannedStartDate && (
                              <div className="invalid-feedback">
                                {errors.plannedStartDate}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Ngày hoàn thành dự kiến{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <input
                              type="date"
                              className={`form-control ${
                                errors.plannedEndDate ? "is-invalid" : ""
                              }`}
                              name="plannedEndDate"
                              value={formData.plannedEndDate}
                              onChange={this.handleChange}
                            />
                            {errors.plannedEndDate && (
                              <div className="invalid-feedback">
                                {errors.plannedEndDate}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
                          onChange={this.handleChange}
                          rows="3"
                          placeholder="Ghi chú về lệnh sản xuất..."
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  {/* Công đoạn sản xuất */}
                  <div className="card">
                    <div className="header">
                      <h2>
                        <i className="fa fa-tasks mr-2"></i>
                        Công đoạn sản xuất
                      </h2>
                    </div>
                    <div className="body">
                      {errors.steps && (
                        <div className="alert alert-danger">{errors.steps}</div>
                      )}

                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th style={{ width: "50px" }}>
                                <i className="fa fa-check-square"></i>
                              </th>
                              <th>Công đoạn</th>
                              <th>Người thực hiện</th>
                              <th style={{ width: "120px" }}>
                                Thời gian (giờ)
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {formData.steps.map((step, index) => (
                              <tr
                                key={step.stepId}
                                className={!step.enabled ? "text-muted" : ""}
                              >
                                <td>
                                  <label className="fancy-checkbox">
                                    <input
                                      type="checkbox"
                                      checked={step.enabled}
                                      onChange={() => this.toggleStep(index)}
                                    />
                                    <span></span>
                                  </label>
                                </td>
                                <td>
                                  <strong>{step.name}</strong>
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    value={step.assignedTo}
                                    onChange={(e) =>
                                      this.handleStepChange(
                                        index,
                                        "assignedTo",
                                        e.target.value
                                      )
                                    }
                                    disabled={!step.enabled}
                                    placeholder="Nhập tên..."
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    className="form-control form-control-sm"
                                    value={step.estimatedHours}
                                    onChange={(e) =>
                                      this.handleStepChange(
                                        index,
                                        "estimatedHours",
                                        e.target.value
                                      )
                                    }
                                    disabled={!step.enabled}
                                    min="0"
                                    placeholder="0"
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Buttons */}
                  <div className="card">
                    <div className="body">
                      <div className="d-flex justify-content-between">
                        <Link
                          to="/work-orders"
                          className="btn btn-outline-secondary"
                        >
                          <i className="fa fa-arrow-left mr-2"></i>
                          Quay lại
                        </Link>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? (
                            <>
                              <span className="spinner-border spinner-border-sm mr-2"></span>
                              Đang xử lý...
                            </>
                          ) : (
                            <>
                              <i className="fa fa-save mr-2"></i>
                              Tạo lệnh sản xuất
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              {/* Sidebar - Hướng dẫn */}
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-info-circle mr-2"></i>
                      Hướng dẫn
                    </h2>
                  </div>
                  <div className="body">
                    <div className="alert alert-info mb-3">
                      <strong>Quy trình tạo lệnh sản xuất:</strong>
                    </div>
                    <ol className="pl-3">
                      <li className="mb-2">
                        Chọn đơn hàng đã được xác nhận (CONFIRMED)
                      </li>
                      <li className="mb-2">
                        Chọn sản phẩm cần sản xuất trong đơn hàng
                      </li>
                      <li className="mb-2">
                        Nhập số lượng và thời gian dự kiến
                      </li>
                      <li className="mb-2">
                        Cấu hình các công đoạn sản xuất
                      </li>
                      <li className="mb-2">
                        Phân công người thực hiện (tùy chọn)
                      </li>
                    </ol>

                    <hr />

                    <div className="alert alert-warning mb-0">
                      <strong>Lưu ý:</strong>
                      <ul className="pl-3 mb-0 mt-2">
                        <li>
                          Các công đoạn không cần thiết có thể bỏ chọn
                        </li>
                        <li>
                          Lệnh SX sau khi tạo sẽ ở trạng thái "Chờ sản xuất"
                        </li>
                        <li>
                          Có thể cập nhật tiến độ trong màn chi tiết
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Priority Legend */}
                <div className="card">
                  <div className="header">
                    <h2>Độ ưu tiên</h2>
                  </div>
                  <div className="body">
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <span className="badge badge-secondary mr-2">Thấp</span>
                        Không gấp, có thể làm sau
                      </li>
                      <li className="mb-2">
                        <span className="badge badge-info mr-2">Bình thường</span>
                        Sản xuất theo kế hoạch
                      </li>
                      <li className="mb-2">
                        <span className="badge badge-warning mr-2">Cao</span>
                        Ưu tiên sản xuất trước
                      </li>
                      <li className="mb-0">
                        <span className="badge badge-danger mr-2">Gấp</span>
                        Cần hoàn thành ngay
                      </li>
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
}

const mapStateToProps = ({ navigationReducer }) => {
  return { navigationReducer };
};

export default connect(mapStateToProps)(withRouter(WorkOrderCreate));
