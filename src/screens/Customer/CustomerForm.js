/**
 * Customer Form Screen
 * Tạo/Sửa khách hàng
 */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { customerService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class CustomerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      loading: false,
      submitting: false,
      formData: {
        name: "",
        type: "INDIVIDUAL",
        email: "",
        phone: "",
        address: "",
        taxCode: "",
        contactPerson: "",
        notes: "",
      },
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { id } = this.props.match.params;
    if (id) {
      this.setState({ isEdit: true });
      this.loadCustomer(id);
    }
  }

  loadCustomer = async (id) => {
    this.setState({ loading: true });
    try {
      const response = await customerService.getById(id);
      this.setState({
        formData: response.data,
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin khách hàng");
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
      errors.name = "Vui lòng nhập tên khách hàng";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Vui lòng nhập số điện thoại";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = "Email không hợp lệ";
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
        await customerService.update(id, formData);
        toastSuccess("Cập nhật khách hàng thành công");
      } else {
        await customerService.create(formData);
        toastSuccess("Tạo khách hàng thành công");
      }
      this.props.history.push("/customers");
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
              HeaderText={isEdit ? "Sửa khách hàng" : "Thêm khách hàng"}
              Breadcrumb={[
                { name: "Khách hàng", navigate: "/customers" },
                { name: isEdit ? "Sửa" : "Thêm mới", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>{isEdit ? "Cập nhật thông tin" : "Thông tin khách hàng mới"}</h2>
                  </div>
                  <div className="body">
                    <form onSubmit={this.handleSubmit}>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Tên khách hàng <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.name ? "is-invalid" : ""}`}
                              name="name"
                              value={formData.name}
                              onChange={this.handleChange}
                              placeholder="Nhập tên khách hàng"
                            />
                            {errors.name && (
                              <div className="invalid-feedback">{errors.name}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Loại khách hàng</label>
                            <select
                              className="form-control"
                              name="type"
                              value={formData.type}
                              onChange={this.handleChange}
                            >
                              <option value="INDIVIDUAL">Cá nhân</option>
                              <option value="COMPANY">Công ty</option>
                              <option value="CONSIGNMENT">Ký gửi</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Số điện thoại <span className="text-danger">*</span>
                            </label>
                            <input
                              type="text"
                              className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                              name="phone"
                              value={formData.phone}
                              onChange={this.handleChange}
                              placeholder="Nhập số điện thoại"
                            />
                            {errors.phone && (
                              <div className="invalid-feedback">{errors.phone}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Email</label>
                            <input
                              type="email"
                              className={`form-control ${errors.email ? "is-invalid" : ""}`}
                              name="email"
                              value={formData.email}
                              onChange={this.handleChange}
                              placeholder="Nhập email"
                            />
                            {errors.email && (
                              <div className="invalid-feedback">{errors.email}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Địa chỉ</label>
                            <textarea
                              className="form-control"
                              name="address"
                              value={formData.address}
                              onChange={this.handleChange}
                              placeholder="Nhập địa chỉ"
                              rows="2"
                            />
                          </div>
                        </div>

                        {formData.type === "COMPANY" && (
                          <>
                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Mã số thuế</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="taxCode"
                                  value={formData.taxCode}
                                  onChange={this.handleChange}
                                  placeholder="Nhập mã số thuế"
                                />
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="form-group">
                                <label>Người liên hệ</label>
                                <input
                                  type="text"
                                  className="form-control"
                                  name="contactPerson"
                                  value={formData.contactPerson}
                                  onChange={this.handleChange}
                                  placeholder="Nhập tên người liên hệ"
                                />
                              </div>
                            </div>
                          </>
                        )}

                        <div className="col-md-12">
                          <div className="form-group">
                            <label>Ghi chú</label>
                            <textarea
                              className="form-control"
                              name="notes"
                              value={formData.notes}
                              onChange={this.handleChange}
                              placeholder="Nhập ghi chú"
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
                          onClick={() => this.props.history.push("/customers")}
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

export default connect(mapStateToProps, {})(withRouter(CustomerForm));
