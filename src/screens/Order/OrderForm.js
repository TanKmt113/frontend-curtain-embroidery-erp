/**
 * Order Form Screen
 * Tạo/Sửa đơn hàng
 */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import OrderItemForm from "../../components/Order/OrderItemForm";
import CustomerSelect from "../../components/Common/CustomerSelect";
import { orderService, customerService, productService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class OrderForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      loading: false,
      submitting: false,
      customers: [],
      products: [],
      formData: {
        customerId: "",
        deliveryAddress: "",
        notes: "",
        items: [],
      },
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadInitialData();
    
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ isEdit: true });
      this.loadOrder(id);
    }

    // Check if customerId from query params
    const params = new URLSearchParams(this.props.location.search);
    const customerId = params.get("customerId");
    if (customerId) {
      this.setState({
        formData: { ...this.state.formData, customerId },
      });
    }
  }

  loadInitialData = async () => {
    try {
      const [customersRes, productsRes] = await Promise.all([
        customerService.getAll({ limit: 100 }),
        productService.getAll({ limit: 100, status: "ACTIVE" }),
      ]);

      this.setState({
        customers: customersRes.data || [],
        products: productsRes.data || [],
      });
    } catch (error) {
      console.error("Load initial data error:", error);
    }
  };

  loadOrder = async (id) => {
    this.setState({ loading: true });
    try {
      const response = await orderService.getById(id);
      this.setState({
        formData: response.data,
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin đơn hàng");
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

  handleCustomerChange = (customerId) => {
    const customer = this.state.customers.find((c) => c.id === customerId);
    this.setState({
      formData: {
        ...this.state.formData,
        customerId,
        deliveryAddress: customer?.address || "",
      },
    });
  };

  handleAddItem = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        items: [
          ...this.state.formData.items,
          {
            productId: "",
            description: "",
            quantity: 1,
            unitPrice: 0,
            width: "",
            height: "",
            location: "",
          },
        ],
      },
    });
  };

  handleItemChange = (index, field, value) => {
    const { items } = this.state.formData;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Auto fill price when product selected
    if (field === "productId") {
      const product = this.state.products.find((p) => p.id === value);
      if (product) {
        newItems[index].unitPrice = product.basePrice;
        newItems[index].description = product.name;
      }
    }

    this.setState({
      formData: { ...this.state.formData, items: newItems },
    });
  };

  handleRemoveItem = (index) => {
    const { items } = this.state.formData;
    this.setState({
      formData: {
        ...this.state.formData,
        items: items.filter((_, i) => i !== index),
      },
    });
  };

  calculateTotal = () => {
    const { items } = this.state.formData;
    return items.reduce((total, item) => {
      return total + (item.quantity || 0) * (item.unitPrice || 0);
    }, 0);
  };

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.customerId) {
      errors.customerId = "Vui lòng chọn khách hàng";
    }
    if (formData.items.length === 0) {
      errors.items = "Vui lòng thêm ít nhất một sản phẩm";
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
        await orderService.update(id, formData);
        toastSuccess("Cập nhật đơn hàng thành công");
      } else {
        await orderService.create(formData);
        toastSuccess("Tạo đơn hàng thành công");
      }
      this.props.history.push("/orders");
    } catch (error) {
      if (error.errors) {
        this.setState({ errors: error.errors });
      }
      toastError(error.message || "Có lỗi xảy ra");
    } finally {
      this.setState({ submitting: false });
    }
  };

  formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  render() {
    const { isEdit, loading, submitting, formData, errors, customers, products } = this.state;

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
              HeaderText={isEdit ? "Sửa đơn hàng" : "Tạo đơn hàng"}
              Breadcrumb={[
                { name: "Đơn hàng", navigate: "/orders" },
                { name: isEdit ? "Sửa" : "Tạo mới", navigate: "" },
              ]}
            />

            <form onSubmit={this.handleSubmit}>
              <div className="row clearfix">
                {/* Thông tin khách hàng */}
                <div className="col-lg-4 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Thông tin khách hàng</h2>
                    </div>
                    <div className="body">
                      <div className="form-group">
                        <label>
                          Khách hàng <span className="text-danger">*</span>
                        </label>
                        <select
                          className={`form-control ${errors.customerId ? "is-invalid" : ""}`}
                          name="customerId"
                          value={formData.customerId}
                          onChange={(e) => this.handleCustomerChange(e.target.value)}
                        >
                          <option value="">-- Chọn khách hàng --</option>
                          {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                              {customer.code} - {customer.name}
                            </option>
                          ))}
                        </select>
                        {errors.customerId && (
                          <div className="invalid-feedback">{errors.customerId}</div>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Địa chỉ giao hàng</label>
                        <textarea
                          className="form-control"
                          name="deliveryAddress"
                          value={formData.deliveryAddress}
                          onChange={this.handleChange}
                          rows="3"
                          placeholder="Nhập địa chỉ giao hàng"
                        />
                      </div>

                      <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
                          onChange={this.handleChange}
                          rows="3"
                          placeholder="Nhập ghi chú"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Tổng tiền */}
                  <div className="card bg-primary text-white">
                    <div className="body">
                      <h5>Tổng tiền đơn hàng</h5>
                      <h2 className="mb-0">{this.formatCurrency(this.calculateTotal())}</h2>
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
                          <i className="fa fa-save mr-1"></i>
                          {isEdit ? "Cập nhật đơn hàng" : "Tạo đơn hàng"}
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-block"
                      onClick={() => this.props.history.push("/orders")}
                    >
                      <i className="fa fa-times mr-1"></i> Hủy
                    </button>
                  </div>
                </div>

                {/* Danh sách sản phẩm */}
                <div className="col-lg-8 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Danh sách sản phẩm</h2>
                      <button
                        type="button"
                        className="btn btn-success btn-sm float-right"
                        onClick={this.handleAddItem}
                      >
                        <i className="fa fa-plus"></i> Thêm sản phẩm
                      </button>
                    </div>
                    <div className="body">
                      {errors.items && (
                        <div className="alert alert-danger">{errors.items}</div>
                      )}

                      {formData.items.length === 0 ? (
                        <div className="text-center text-muted py-5">
                          <i className="fa fa-shopping-cart fa-3x mb-3"></i>
                          <p>Chưa có sản phẩm nào</p>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={this.handleAddItem}
                          >
                            <i className="fa fa-plus mr-1"></i> Thêm sản phẩm
                          </button>
                        </div>
                      ) : (
                        formData.items.map((item, index) => (
                          <OrderItemForm
                            key={index}
                            index={index}
                            item={item}
                            products={products}
                            onChange={this.handleItemChange}
                            onRemove={this.handleRemoveItem}
                          />
                        ))
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

export default connect(mapStateToProps, {})(withRouter(OrderForm));
