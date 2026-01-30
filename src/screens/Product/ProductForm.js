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
        type: "CURTAIN",
        unit: "m",
        basePrice: "",
        description: "",
        image: "",
        isActive: true,
      },
      imagePreview: null,
      imageFile: null,
      errors: {},
    };
    this.fileInputRef = React.createRef();
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
      const product = response.data || response;
      this.setState({
        formData: {
          name: product.name || "",
          code: product.code || "",
          type: product.type || "CURTAIN",
          unit: product.unit || "m",
          basePrice: product.basePrice || "",
          description: product.description || "",
          image: product.image || "",
          isActive: product.isActive !== undefined ? product.isActive : true,
        },
        imagePreview: product.image || null,
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin sản phẩm");
      this.setState({ loading: false });
    }
  };

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      formData: { 
        ...this.state.formData, 
        [name]: type === "checkbox" ? checked : value 
      },
      errors: { ...this.state.errors, [name]: "" },
    });
  };

  handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        toastError("Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)");
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toastError("Kích thước ảnh không được vượt quá 5MB");
        return;
      }
      
      this.setState({ imageFile: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({ imagePreview: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  handleRemoveImage = () => {
    this.setState({
      imageFile: null,
      imagePreview: null,
      formData: { ...this.state.formData, image: "" },
    });
    if (this.fileInputRef.current) {
      this.fileInputRef.current.value = "";
    }
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
    const { isEdit, formData, imageFile } = this.state;
    const { id } = this.props.match.params;

    try {
      // Upload image first if there's a new file
      let imageUrl = formData.image;
      if (imageFile) {
        try {
          const uploadResult = await productService.uploadImage(imageFile);
          imageUrl = uploadResult.url;
        } catch (imgError) {
          console.error("Image upload failed:", imgError);
          toastError("Upload hình ảnh thất bại: " + (imgError.message || "Lỗi không xác định"));
          this.setState({ submitting: false });
          return;
        }
      }

      const submitData = {
        name: formData.name,
        type: formData.type,
        unit: formData.unit,
        basePrice: parseFloat(formData.basePrice),
        description: formData.description || undefined,
        image: imageUrl || undefined,
        isActive: formData.isActive,
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
    const { isEdit, loading, submitting, formData, errors, imagePreview } = this.state;

    const productTypes = [
      { value: "CURTAIN", label: "Rèm" },
      { value: "EMBROIDERY", label: "Gia công thêu/đệm" },
      { value: "MATERIAL", label: "Nguyên vật liệu" },
      { value: "ACCESSORY", label: "Phụ kiện" },
    ];

    const units = [
      { value: "m", label: "Mét (m)" },
      { value: "m2", label: "Mét vuông (m²)" },
      { value: "piece", label: "Cái" },
      { value: "set", label: "Bộ" },
      { value: "kg", label: "Kg" },
    ];

    const imageBaseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3000';

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
                            <div className="custom-control custom-switch mt-2">
                              <input
                                type="checkbox"
                                className="custom-control-input"
                                id="isActive"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={this.handleChange}
                              />
                              <label className="custom-control-label" htmlFor="isActive">
                                {formData.isActive ? (
                                  <span className="badge badge-success">Đang kinh doanh</span>
                                ) : (
                                  <span className="badge badge-danger">Ngừng kinh doanh</span>
                                )}
                              </label>
                            </div>
                          </div>
                        </div>

                        {/* Image Upload */}
                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Hình ảnh sản phẩm</label>
                            <div className="row">
                              <div className="col-md-4">
                                <div
                                  style={{
                                    width: "100%",
                                    height: 200,
                                    border: "2px dashed #ddd",
                                    borderRadius: 8,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    overflow: "hidden",
                                    background: "#f9f9f9",
                                    position: "relative",
                                  }}
                                >
                                  {imagePreview ? (
                                    <>
                                      <img
                                        src={imagePreview.startsWith('http') ? imagePreview : `${imageBaseUrl}${imagePreview}`}
                                        alt="Preview"
                                        style={{
                                          maxWidth: "100%",
                                          maxHeight: "100%",
                                          objectFit: "contain",
                                        }}
                                      />
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        style={{
                                          position: "absolute",
                                          top: 8,
                                          right: 8,
                                        }}
                                        onClick={this.handleRemoveImage}
                                      >
                                        <i className="fa fa-times"></i>
                                      </button>
                                    </>
                                  ) : (
                                    <div className="text-center text-muted">
                                      <i className="fa fa-image fa-3x mb-2"></i>
                                      <br />
                                      <small>Chưa có hình ảnh</small>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="col-md-8">
                                <input
                                  type="file"
                                  ref={this.fileInputRef}
                                  className="form-control-file"
                                  accept="image/*"
                                  onChange={this.handleImageChange}
                                  style={{ display: "none" }}
                                  id="imageInput"
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline-primary mb-2"
                                  onClick={() => this.fileInputRef.current?.click()}
                                >
                                  <i className="fa fa-upload mr-1"></i>
                                  Chọn hình ảnh
                                </button>
                                <p className="text-muted mb-1">
                                  <small>
                                    • Định dạng: JPG, PNG, GIF, WEBP<br />
                                    • Kích thước tối đa: 5MB<br />
                                    • Khuyến nghị: 800x800 pixels
                                  </small>
                                </p>
                                {formData.image && !this.state.imageFile && (
                                  <p className="text-info mb-0">
                                    <small>
                                      <i className="fa fa-check-circle mr-1"></i>
                                      Đã có hình ảnh được lưu
                                    </small>
                                  </p>
                                )}
                              </div>
                            </div>
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
                              placeholder="Nhập mô tả sản phẩm (thông số kỹ thuật, chất liệu, màu sắc...)"
                              rows="4"
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
