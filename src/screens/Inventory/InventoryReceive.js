/**
 * Inventory Receive Screen
 * Nhập kho
 */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { inventoryService, productService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class InventoryReceive extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitting: false,
      products: [],
      formData: {
        type: "PURCHASE",
        notes: "",
        items: [],
      },
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadProducts();
  }

  loadProducts = async () => {
    try {
      const response = await productService.getAll({ limit: 100 });
      this.setState({ products: response.data || [] });
    } catch (error) {
      console.error("Load products error:", error);
    }
  };

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: { ...this.state.formData, [name]: value },
      errors: { ...this.state.errors, [name]: "" },
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
            quantity: 1,
            unitCost: 0,
            location: "",
            notes: "",
          },
        ],
      },
    });
  };

  handleItemChange = (index, field, value) => {
    const { items } = this.state.formData;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
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
      return total + (item.quantity || 0) * (item.unitCost || 0);
    }, 0);
  };

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (formData.items.length === 0) {
      errors.items = "Vui lòng thêm ít nhất một sản phẩm";
    }

    formData.items.forEach((item, index) => {
      if (!item.productId) {
        errors[`item_${index}_productId`] = "Vui lòng chọn sản phẩm";
      }
      if (!item.quantity || item.quantity <= 0) {
        errors[`item_${index}_quantity`] = "Số lượng phải lớn hơn 0";
      }
    });

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    if (!this.validate()) return;

    this.setState({ submitting: true });
    const { formData } = this.state;

    try {
      await inventoryService.receive(formData);
      toastSuccess("Nhập kho thành công");
      this.props.history.push("/inventory");
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

  receiveTypes = [
    { value: "PURCHASE", label: "Mua hàng" },
    { value: "RETURN", label: "Hàng trả về" },
    { value: "ADJUSTMENT", label: "Điều chỉnh" },
    { value: "TRANSFER", label: "Chuyển kho" },
  ];

  render() {
    const { submitting, formData, errors, products } = this.state;

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
              HeaderText="Nhập kho"
              Breadcrumb={[
                { name: "Kho hàng", navigate: "/inventory" },
                { name: "Nhập kho", navigate: "" },
              ]}
            />

            <form onSubmit={this.handleSubmit}>
              <div className="row clearfix">
                <div className="col-lg-8 col-md-12">
                  {/* Danh sách sản phẩm nhập */}
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
                          <i className="fa fa-inbox fa-3x mb-3"></i>
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
                        <div className="table-responsive">
                          <table className="table">
                            <thead>
                              <tr>
                                <th style={{ width: "30%" }}>Sản phẩm</th>
                                <th style={{ width: "15%" }}>Số lượng</th>
                                <th style={{ width: "20%" }}>Đơn giá nhập</th>
                                <th style={{ width: "15%" }}>Vị trí</th>
                                <th style={{ width: "15%" }}>Thành tiền</th>
                                <th style={{ width: "5%" }}></th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.items.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <select
                                      className={`form-control form-control-sm ${
                                        errors[`item_${index}_productId`]
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      value={item.productId}
                                      onChange={(e) =>
                                        this.handleItemChange(
                                          index,
                                          "productId",
                                          e.target.value
                                        )
                                      }
                                    >
                                      <option value="">-- Chọn --</option>
                                      {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                          {p.code} - {p.name}
                                        </option>
                                      ))}
                                    </select>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className={`form-control form-control-sm ${
                                        errors[`item_${index}_quantity`]
                                          ? "is-invalid"
                                          : ""
                                      }`}
                                      value={item.quantity}
                                      onChange={(e) =>
                                        this.handleItemChange(
                                          index,
                                          "quantity",
                                          parseInt(e.target.value) || 0
                                        )
                                      }
                                      min="1"
                                    />
                                  </td>
                                  <td>
                                    <div className="input-group input-group-sm">
                                      <input
                                        type="number"
                                        className="form-control"
                                        value={item.unitCost}
                                        onChange={(e) =>
                                          this.handleItemChange(
                                            index,
                                            "unitCost",
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                        min="0"
                                      />
                                      <div className="input-group-append">
                                        <span className="input-group-text">đ</span>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={item.location}
                                      onChange={(e) =>
                                        this.handleItemChange(
                                          index,
                                          "location",
                                          e.target.value
                                        )
                                      }
                                      placeholder="A1-01"
                                    />
                                  </td>
                                  <td className="font-weight-bold text-primary">
                                    {this.formatCurrency(
                                      (item.quantity || 0) * (item.unitCost || 0)
                                    )}
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => this.handleRemoveItem(index)}
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr className="bg-light">
                                <th colSpan="4" className="text-right">
                                  Tổng giá trị:
                                </th>
                                <th className="text-primary">
                                  {this.formatCurrency(this.calculateTotal())}
                                </th>
                                <th></th>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Thông tin phiếu nhập</h2>
                    </div>
                    <div className="body">
                      <div className="form-group">
                        <label>Loại nhập kho</label>
                        <select
                          className="form-control"
                          name="type"
                          value={formData.type}
                          onChange={this.handleChange}
                        >
                          {this.receiveTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
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

                      <hr />

                      <div className="mb-3">
                        <div className="d-flex justify-content-between">
                          <span>Số sản phẩm:</span>
                          <strong>{formData.items.length}</strong>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span>Tổng số lượng:</span>
                          <strong>
                            {formData.items.reduce(
                              (sum, item) => sum + (item.quantity || 0),
                              0
                            )}
                          </strong>
                        </div>
                        <div className="d-flex justify-content-between mt-2">
                          <span className="font-weight-bold">Tổng giá trị:</span>
                          <strong className="text-primary">
                            {this.formatCurrency(this.calculateTotal())}
                          </strong>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={submitting || formData.items.length === 0}
                      >
                        {submitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm mr-2"></span>
                            Đang xử lý...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-save mr-2"></i> Xác nhận nhập kho
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-block"
                        onClick={() => this.props.history.push("/inventory")}
                      >
                        <i className="fa fa-times mr-2"></i> Hủy
                      </button>
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

export default connect(mapStateToProps, {})(withRouter(InventoryReceive));
