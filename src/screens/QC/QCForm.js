/**
 * QC Record Form Screen
 * Tạo/Cập nhật kiểm tra chất lượng
 */

import React from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { qcService, workOrderService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class QCForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEdit: false,
      loading: false,
      submitting: false,
      workOrders: [],
      formData: {
        workOrderId: "",
        checkDate: new Date().toISOString().split("T")[0],
        result: "",
        notes: "",
        defects: [],
        images: [],
      },
      errors: {},
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadWorkOrders();

    const { id } = this.props.match.params;
    if (id) {
      this.setState({ isEdit: true });
      this.loadQCRecord(id);
    }

    // Check if workOrderId from query params
    const params = new URLSearchParams(this.props.location.search);
    const workOrderId = params.get("workOrderId");
    if (workOrderId) {
      this.setState({
        formData: { ...this.state.formData, workOrderId },
      });
    }
  }

  loadWorkOrders = async () => {
    try {
      const response = await workOrderService.getAll({
        limit: 100,
        status: "IN_PROGRESS",
      });
      this.setState({ workOrders: response.data || [] });
    } catch (error) {
      console.error("Load work orders error:", error);
    }
  };

  loadQCRecord = async (id) => {
    this.setState({ loading: true });
    try {
      const response = await qcService.getById(id);
      this.setState({
        formData: {
          ...response.data,
          checkDate: response.data.checkDate?.split("T")[0],
        },
        loading: false,
      });
    } catch (error) {
      toastError("Không thể tải thông tin kiểm tra");
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

  handleAddDefect = () => {
    this.setState({
      formData: {
        ...this.state.formData,
        defects: [
          ...this.state.formData.defects,
          { type: "", description: "", severity: "MINOR" },
        ],
      },
    });
  };

  handleDefectChange = (index, field, value) => {
    const { defects } = this.state.formData;
    const newDefects = [...defects];
    newDefects[index] = { ...newDefects[index], [field]: value };
    this.setState({
      formData: { ...this.state.formData, defects: newDefects },
    });
  };

  handleRemoveDefect = (index) => {
    const { defects } = this.state.formData;
    this.setState({
      formData: {
        ...this.state.formData,
        defects: defects.filter((_, i) => i !== index),
      },
    });
  };

  validate = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.workOrderId) {
      errors.workOrderId = "Vui lòng chọn lệnh sản xuất";
    }
    if (!formData.result) {
      errors.result = "Vui lòng chọn kết quả kiểm tra";
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
        await qcService.update(id, formData);
        toastSuccess("Cập nhật kiểm tra thành công");
      } else {
        await qcService.create(formData);
        toastSuccess("Tạo kiểm tra thành công");
      }
      this.props.history.push("/qc");
    } catch (error) {
      if (error.errors) {
        this.setState({ errors: error.errors });
      }
      toastError(error.message || "Có lỗi xảy ra");
    } finally {
      this.setState({ submitting: false });
    }
  };

  defectTypes = [
    { value: "SIZE_MISMATCH", label: "Sai kích thước" },
    { value: "COLOR_DEFECT", label: "Lỗi màu sắc" },
    { value: "FABRIC_DAMAGE", label: "Vải bị hư" },
    { value: "SEWING_DEFECT", label: "Lỗi đường may" },
    { value: "EMBROIDERY_DEFECT", label: "Lỗi thêu" },
    { value: "ACCESSORY_MISSING", label: "Thiếu phụ kiện" },
    { value: "OTHER", label: "Lỗi khác" },
  ];

  severities = [
    { value: "MINOR", label: "Nhẹ", class: "badge-info" },
    { value: "MAJOR", label: "Trung bình", class: "badge-warning" },
    { value: "CRITICAL", label: "Nghiêm trọng", class: "badge-danger" },
  ];

  render() {
    const { isEdit, loading, submitting, formData, errors, workOrders } = this.state;

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
              HeaderText={isEdit ? "Sửa kiểm tra" : "Tạo kiểm tra"}
              Breadcrumb={[
                { name: "QC", navigate: "/qc" },
                { name: isEdit ? "Sửa" : "Tạo mới", navigate: "" },
              ]}
            />

            <form onSubmit={this.handleSubmit}>
              <div className="row clearfix">
                <div className="col-lg-8 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Thông tin kiểm tra</h2>
                    </div>
                    <div className="body">
                      <div className="row">
                        <div className="col-md-6">
                          <div className="form-group">
                            <label>
                              Lệnh sản xuất <span className="text-danger">*</span>
                            </label>
                            <select
                              className={`form-control ${errors.workOrderId ? "is-invalid" : ""}`}
                              name="workOrderId"
                              value={formData.workOrderId}
                              onChange={this.handleChange}
                            >
                              <option value="">-- Chọn lệnh sản xuất --</option>
                              {workOrders.map((wo) => (
                                <option key={wo.id} value={wo.id}>
                                  {wo.code} - {wo.orderItem?.product?.name}
                                </option>
                              ))}
                            </select>
                            {errors.workOrderId && (
                              <div className="invalid-feedback">{errors.workOrderId}</div>
                            )}
                          </div>
                        </div>

                        <div className="col-md-6">
                          <div className="form-group">
                            <label>Ngày kiểm tra</label>
                            <input
                              type="date"
                              className="form-control"
                              name="checkDate"
                              value={formData.checkDate}
                              onChange={this.handleChange}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>
                          Kết quả kiểm tra <span className="text-danger">*</span>
                        </label>
                        <div className={errors.result ? "is-invalid" : ""}>
                          <div className="btn-group btn-group-toggle w-100" data-toggle="buttons">
                            <label
                              className={`btn ${
                                formData.result === "PASSED"
                                  ? "btn-success"
                                  : "btn-outline-success"
                              }`}
                            >
                              <input
                                type="radio"
                                name="result"
                                value="PASSED"
                                checked={formData.result === "PASSED"}
                                onChange={this.handleChange}
                              />
                              <i className="fa fa-check mr-2"></i> ĐẠT
                            </label>
                            <label
                              className={`btn ${
                                formData.result === "FAILED"
                                  ? "btn-danger"
                                  : "btn-outline-danger"
                              }`}
                            >
                              <input
                                type="radio"
                                name="result"
                                value="FAILED"
                                checked={formData.result === "FAILED"}
                                onChange={this.handleChange}
                              />
                              <i className="fa fa-times mr-2"></i> KHÔNG ĐẠT
                            </label>
                            <label
                              className={`btn ${
                                formData.result === "REWORK"
                                  ? "btn-warning"
                                  : "btn-outline-warning"
                              }`}
                            >
                              <input
                                type="radio"
                                name="result"
                                value="REWORK"
                                checked={formData.result === "REWORK"}
                                onChange={this.handleChange}
                              />
                              <i className="fa fa-refresh mr-2"></i> LÀM LẠI
                            </label>
                          </div>
                        </div>
                        {errors.result && (
                          <div className="text-danger mt-1" style={{ fontSize: "80%" }}>
                            {errors.result}
                          </div>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Ghi chú</label>
                        <textarea
                          className="form-control"
                          name="notes"
                          value={formData.notes}
                          onChange={this.handleChange}
                          rows="3"
                          placeholder="Nhập ghi chú kiểm tra"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Danh sách lỗi */}
                  <div className="card">
                    <div className="header">
                      <h2>Danh sách lỗi phát hiện</h2>
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary float-right"
                        onClick={this.handleAddDefect}
                      >
                        <i className="fa fa-plus"></i> Thêm lỗi
                      </button>
                    </div>
                    <div className="body">
                      {formData.defects.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <i className="fa fa-check-circle fa-3x mb-3 text-success"></i>
                          <p>Không có lỗi nào được ghi nhận</p>
                        </div>
                      ) : (
                        formData.defects.map((defect, index) => (
                          <div key={index} className="card border mb-3">
                            <div className="card-body">
                              <div className="row">
                                <div className="col-md-4">
                                  <div className="form-group mb-2">
                                    <label>Loại lỗi</label>
                                    <select
                                      className="form-control form-control-sm"
                                      value={defect.type}
                                      onChange={(e) =>
                                        this.handleDefectChange(index, "type", e.target.value)
                                      }
                                    >
                                      <option value="">-- Chọn --</option>
                                      {this.defectTypes.map((type) => (
                                        <option key={type.value} value={type.value}>
                                          {type.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="form-group mb-2">
                                    <label>Mức độ</label>
                                    <select
                                      className="form-control form-control-sm"
                                      value={defect.severity}
                                      onChange={(e) =>
                                        this.handleDefectChange(index, "severity", e.target.value)
                                      }
                                    >
                                      {this.severities.map((s) => (
                                        <option key={s.value} value={s.value}>
                                          {s.label}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </div>
                                <div className="col-md-4">
                                  <div className="form-group mb-2">
                                    <label>Mô tả</label>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={defect.description}
                                      onChange={(e) =>
                                        this.handleDefectChange(
                                          index,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                      placeholder="Mô tả chi tiết"
                                    />
                                  </div>
                                </div>
                                <div className="col-md-1 d-flex align-items-end">
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger mb-2"
                                    onClick={() => this.handleRemoveDefect(index)}
                                  >
                                    <i className="fa fa-trash"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="col-lg-4 col-md-12">
                  <div className="card">
                    <div className="header">
                      <h2>Thao tác</h2>
                    </div>
                    <div className="body">
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
                            {isEdit ? "Cập nhật" : "Lưu kiểm tra"}
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary btn-block"
                        onClick={() => this.props.history.push("/qc")}
                      >
                        <i className="fa fa-times mr-2"></i> Hủy
                      </button>
                    </div>
                  </div>

                  {/* Tips */}
                  <div className="card bg-light">
                    <div className="body">
                      <h6>
                        <i className="fa fa-info-circle text-info mr-2"></i>
                        Hướng dẫn
                      </h6>
                      <ul className="mb-0 pl-3">
                        <li className="mb-2">
                          <strong>Đạt:</strong> Sản phẩm đạt yêu cầu chất lượng
                        </li>
                        <li className="mb-2">
                          <strong>Không đạt:</strong> Sản phẩm không thể sửa chữa
                        </li>
                        <li>
                          <strong>Làm lại:</strong> Sản phẩm cần sửa chữa và kiểm tra lại
                        </li>
                      </ul>
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

export default connect(mapStateToProps, {})(withRouter(QCForm));
