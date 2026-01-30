/**
 * Product Form Screen
 * Tạo/Sửa sản phẩm
 */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { productService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class ProductForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      loading: false,
      submitting: false,
      formData: {
        name: "",
        code: "",
        type: "CURTAIN_FABRIC",
        unit: "m",
        basePrice: "",
        description: "",
        specifications: "",
        status: "ACTIVE",
      },
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ isEdit: true });
      this.loadProduct(id);
    }
  }

  loadProduct = async (id) => {
    this.setState({ loading: true });
    try {
      const response = await productService.getById(id);
      this.setState({
        formData: response.data,
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin sản phẩm");
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

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Vui lòng nhập tên sản phẩm";
    }
    if (!formData.basePrice || formData.basePrice <= 0) {
      errors.basePrice = "Vui lòng nhập giá hợp lệ";
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
      const submitData = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
      };

      if (isEdit) {
        await productService.update(id, submitData);
        toastSuccess("Cập nhật sản phẩm thành công");
      } else {
        await productService.create(submitData);
        toastSuccess("Tạo sản phẩm thành công");
      }
      this.props.history.push("/products");
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
    const { isEdit, loading, submitting, formData, errors } = this.state;

    const productTypes = [
      { value: "CURTAIN_FABRIC", label: "Rèm vải" },
      { value: "CURTAIN_ROMAN", label: "Rèm roman" },
      { value: "CURTAIN_ROLLER", label: "Rèm cuốn" },
      { value: "CURTAIN_VERTICAL", label: "Rèm lá dọc" },
      { value: "CUSHION", label: "Đệm/Gối" },
      { value: "EMBROIDERY", label: "Dịch vụ thêu" },
      { value: "ACCESSORY", label: "Phụ kiện" },
    ];

    const units = [
      { value: "m", label: "Mét (m)" },
      { value: "m2", label: "Mét vuông (m²)" },
      { value: "piece", label: "Cái" },
      { value: "set", label: "Bộ" },
      { value: "kg", label: "Kg" },
    ];

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
              HeaderText={isEdit ? "Sửa sản phẩm" : "Thêm sản phẩm"}
              Breadcrumb={[
                { name: "Sản phẩm", navigate: "/products" },
                { name: isEdit ? "Sửa" : "Thêm mới", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>{isEdit ? "Cập nhật thông tin" : "Thông tin sản phẩm mới"}</h2>
                  </div>
                  <div className="body">
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Tên sản phẩm <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.name ? "is-invalid" : ""}`}
                              name="name"
                              value={formData.name}
                              onChange={this.handleChange}
                              placeholder="Nhập tên sản phẩm"
                            />
                            {errors.name && (
                              <div className="invalid-feedback">{errors.name}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Mã sản phẩm</label>
                            <input
                              type="text"
                              className="form-control"
                              name="code"
                              value={formData.code}
                              onChange={this.handleChange}
                              placeholder="Để trống sẽ tự động tạo"
                              disabled={isEdit}
                            />
                            <small className="text-muted">
                              Mã sẽ được tạo tự động nếu để trống
                            </small>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Loại sản phẩm</label>
                            <select
                              className="form-control"
                              name="type"
                              value={formData.type}
                              onChange={this.handleChange}
                            >
                              {productTypes.map((type) => (
                                <option key={type.value} value={type.value}>
                                  {type.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Đơn vị tính</label>
                            <select
                              className="form-control"
                              name="unit"
                              value={formData.unit}
                              onChange={this.handleChange}
                            >
                              {units.map((unit) => (
                                <option key={unit.value} value={unit.value}>
                                  {unit.label}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Giá cơ bản <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <input
                                type="number"
                                className={`form-control ${errors.basePrice ? "is-invalid" : ""}`}
                                name="basePrice"
                                value={formData.basePrice}
                                onChange={this.handleChange}
                                placeholder="Nhập giá"
                                min="0"
                              />
                              <div className="input-group-append">
                                <span className="input-group-text">VNĐ</span>
                              </div>
                              {errors.basePrice && (
                                <div className="invalid-feedback">{errors.basePrice}</div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Trạng thái</label>
                            <select
                              className="form-control"
                              name="status"
                              value={formData.status}
                              onChange={this.handleChange}
                            >
                              <option value="ACTIVE">Đang kinh doanh</option>
                              <option value="INACTIVE">Ngừng kinh doanh</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Mô tả</label>
                            <textarea
                              className="form-control"
                              name="description"
                              value={formData.description}
                              onChange={this.handleChange}
                              placeholder="Nhập mô tả sản phẩm"
                              rows="3"
                            />
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Thông số kỹ thuật</label>
                            <textarea
                              className="form-control"
                              name="specifications"
                              value={formData.specifications}
                              onChange={this.handleChange}
                              placeholder="Nhập thông số kỹ thuật (kích thước, chất liệu, màu sắc...)"
                              rows="3"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group mt-4">
                        <button
                          type="submit"
                          className="btn btn-primary mr-2"
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
                              {isEdit ? "Cập nhật" : "Tạo mới"}
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => this.props.history.push("/products")}
                        >
                          <i className="fa fa-times mr-1"></i> Hủy
                        </button>
                      </div>
                    </form>
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

export default connect(mapStateToProps, {})(withRouter(ProductForm));
