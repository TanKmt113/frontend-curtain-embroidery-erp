/**
 * Role List Screen
 * Quản lý phân quyền
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { userService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

// Permission definitions
const PERMISSIONS = {
  CUSTOMER: {
    label: "Khách hàng",
    actions: ["view", "create", "edit", "delete"],
  },
  PRODUCT: {
    label: "Sản phẩm",
    actions: ["view", "create", "edit", "delete"],
  },
  QUOTATION: {
    label: "Báo giá",
    actions: ["view", "create", "edit", "delete", "approve"],
  },
  ORDER: {
    label: "Đơn hàng",
    actions: ["view", "create", "edit", "delete", "confirm", "cancel"],
  },
  WORK_ORDER: {
    label: "Lệnh sản xuất",
    actions: ["view", "create", "edit", "delete", "update_progress"],
  },
  QC: {
    label: "Kiểm tra QC",
    actions: ["view", "create", "edit", "delete"],
  },
  INVENTORY: {
    label: "Kho hàng",
    actions: ["view", "receive", "issue", "adjust"],
  },
  DELIVERY: {
    label: "Giao hàng",
    actions: ["view", "create", "edit", "complete"],
  },
  REPORT: {
    label: "Báo cáo",
    actions: ["view", "export"],
  },
  SETTINGS: {
    label: "Cài đặt",
    actions: ["view", "manage_users", "manage_roles"],
  },
};

const ACTION_LABELS = {
  view: "Xem",
  create: "Tạo mới",
  edit: "Sửa",
  delete: "Xóa",
  approve: "Duyệt",
  confirm: "Xác nhận",
  cancel: "Hủy",
  update_progress: "Cập nhật tiến độ",
  receive: "Nhập kho",
  issue: "Xuất kho",
  adjust: "Điều chỉnh",
  complete: "Hoàn thành",
  export: "Xuất báo cáo",
  manage_users: "Quản lý người dùng",
  manage_roles: "Quản lý vai trò",
};

class RoleList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      roles: [],
      loading: true,
      showModal: false,
      selectedRole: null,
      formData: {
        name: "",
        code: "",
        description: "",
        permissions: {},
      },
      formErrors: {},
      formLoading: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadRoles();
  }

  loadRoles = async () => {
    this.setState({ loading: true });

    try {
      const response = await userService.getRoles();
      this.setState({
        roles: response.data || [],
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách vai trò");
      this.setState({ loading: false });
    }
  };

  openModal = (role = null) => {
    if (role) {
      this.setState({
        showModal: true,
        selectedRole: role,
        formData: {
          name: role.name || "",
          code: role.code || "",
          description: role.description || "",
          permissions: role.permissions || {},
        },
        formErrors: {},
      });
    } else {
      // Initialize empty permissions
      const emptyPermissions = {};
      Object.keys(PERMISSIONS).forEach((module) => {
        emptyPermissions[module] = [];
      });

      this.setState({
        showModal: true,
        selectedRole: null,
        formData: {
          name: "",
          code: "",
          description: "",
          permissions: emptyPermissions,
        },
        formErrors: {},
      });
    }
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      selectedRole: null,
      formErrors: {},
    });
  };

  handleFormChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      formData: { ...this.state.formData, [name]: value },
      formErrors: { ...this.state.formErrors, [name]: "" },
    });
  };

  handlePermissionChange = (module, action) => {
    const { formData } = this.state;
    const modulePermissions = formData.permissions[module] || [];

    let newPermissions;
    if (modulePermissions.includes(action)) {
      newPermissions = modulePermissions.filter((a) => a !== action);
    } else {
      newPermissions = [...modulePermissions, action];
    }

    this.setState({
      formData: {
        ...formData,
        permissions: {
          ...formData.permissions,
          [module]: newPermissions,
        },
      },
    });
  };

  handleSelectAllModule = (module, checked) => {
    const { formData } = this.state;
    const actions = checked ? PERMISSIONS[module].actions : [];

    this.setState({
      formData: {
        ...formData,
        permissions: {
          ...formData.permissions,
          [module]: actions,
        },
      },
    });
  };

  validateForm = () => {
    const { formData } = this.state;
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = "Vui lòng nhập tên vai trò";
    }
    if (!formData.code.trim()) {
      errors.code = "Vui lòng nhập mã vai trò";
    } else if (!/^[A-Z_]+$/.test(formData.code)) {
      errors.code = "Mã vai trò chỉ chứa chữ in hoa và dấu gạch dưới";
    }

    this.setState({ formErrors: errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.setState({ formLoading: true });

    try {
      const { formData, selectedRole } = this.state;

      if (selectedRole) {
        await userService.updateRole(selectedRole.id, formData);
        toastSuccess("Cập nhật vai trò thành công");
      } else {
        await userService.createRole(formData);
        toastSuccess("Thêm vai trò thành công");
      }

      this.closeModal();
      this.loadRoles();
    } catch (error) {
      toastError(error.message || "Không thể lưu vai trò");
    } finally {
      this.setState({ formLoading: false });
    }
  };

  handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa vai trò này?")) return;

    try {
      await userService.deleteRole(id);
      toastSuccess("Xóa vai trò thành công");
      this.loadRoles();
    } catch (error) {
      toastError(error.message || "Không thể xóa vai trò");
    }
  };

  countPermissions = (permissions) => {
    if (!permissions) return 0;
    return Object.values(permissions).reduce(
      (total, actions) => total + (actions?.length || 0),
      0
    );
  };

  render() {
    const {
      roles,
      loading,
      showModal,
      selectedRole,
      formData,
      formErrors,
      formLoading,
    } = this.state;

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
              HeaderText="Quản lý phân quyền"
              Breadcrumb={[
                { name: "Cài đặt", navigate: "" },
                { name: "Phân quyền", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                {/* Header */}
                <div className="card">
                  <div className="body">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-0">
                          <i className="fa fa-shield mr-2"></i>
                          Danh sách vai trò
                        </h5>
                      </div>
                      <button
                        className="btn btn-primary"
                        onClick={() => this.openModal()}
                      >
                        <i className="fa fa-plus mr-2"></i>
                        Thêm vai trò
                      </button>
                    </div>
                  </div>
                </div>

                {/* Roles Grid */}
                {loading ? (
                  <div className="card">
                    <div className="body text-center p-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                ) : roles.length === 0 ? (
                  <div className="card">
                    <div className="body text-center p-5">
                      <i className="fa fa-shield fa-3x text-muted mb-3"></i>
                      <p className="text-muted">Chưa có vai trò nào</p>
                    </div>
                  </div>
                ) : (
                  <div className="row">
                    {roles.map((role) => (
                      <div key={role.id} className="col-lg-4 col-md-6">
                        <div className="card">
                          <div className="header">
                            <h2>
                              <span className="badge badge-primary mr-2">
                                {role.code}
                              </span>
                              {role.name}
                            </h2>
                            <ul className="header-dropdown">
                              <li className="dropdown">
                                <a
                                  href="#!"
                                  className="dropdown-toggle"
                                  data-toggle="dropdown"
                                  role="button"
                                  aria-haspopup="true"
                                  aria-expanded="false"
                                  onClick={(e) => e.preventDefault()}
                                >
                                  <i className="icon-options"></i>
                                </a>
                                <ul className="dropdown-menu dropdown-menu-right">
                                  <li>
                                    <a
                                      href="#!"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        this.openModal(role);
                                      }}
                                    >
                                      <i className="fa fa-pencil mr-2"></i>
                                      Chỉnh sửa
                                    </a>
                                  </li>
                                  {!["ADMIN", "MANAGER"].includes(role.code) && (
                                    <li>
                                      <a
                                        href="#!"
                                        className="text-danger"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          this.handleDelete(role.id);
                                        }}
                                      >
                                        <i className="fa fa-trash mr-2"></i>
                                        Xóa
                                      </a>
                                    </li>
                                  )}
                                </ul>
                              </li>
                            </ul>
                          </div>
                          <div className="body">
                            <p className="text-muted mb-3">
                              {role.description || "Không có mô tả"}
                            </p>

                            <div className="mb-3">
                              <small className="text-muted">Quyền hạn:</small>
                              <h4 className="mb-0">
                                {this.countPermissions(role.permissions)} quyền
                              </h4>
                            </div>

                            <div className="mb-3">
                              <small className="text-muted">Người dùng:</small>
                              <h4 className="mb-0">{role.userCount || 0} người</h4>
                            </div>

                            {/* Permission Summary */}
                            <div>
                              {Object.entries(PERMISSIONS)
                                .filter(
                                  ([module]) =>
                                    role.permissions?.[module]?.length > 0
                                )
                                .slice(0, 3)
                                .map(([module, config]) => (
                                  <span
                                    key={module}
                                    className="badge badge-light mr-1 mb-1"
                                  >
                                    {config.label}
                                  </span>
                                ))}
                              {Object.entries(PERMISSIONS).filter(
                                ([module]) =>
                                  role.permissions?.[module]?.length > 0
                              ).length > 3 && (
                                <span className="badge badge-secondary">
                                  +
                                  {Object.entries(PERMISSIONS).filter(
                                    ([module]) =>
                                      role.permissions?.[module]?.length > 0
                                  ).length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Add/Edit Role */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-xl">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedRole ? "Cập nhật vai trò" : "Thêm vai trò mới"}
                  </h5>
                  <button
                    type="button"
                    className="close"
                    onClick={this.closeModal}
                  >
                    <span>&times;</span>
                  </button>
                </div>
                <form onSubmit={this.handleSubmit}>
                  <div className="modal-body">
                    {/* Basic Info */}
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Tên vai trò <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.name ? "is-invalid" : ""
                            }`}
                            name="name"
                            value={formData.name}
                            onChange={this.handleFormChange}
                            placeholder="VD: Quản lý kho"
                          />
                          {formErrors.name && (
                            <div className="invalid-feedback">
                              {formErrors.name}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>
                            Mã vai trò <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className={`form-control ${
                              formErrors.code ? "is-invalid" : ""
                            }`}
                            name="code"
                            value={formData.code}
                            onChange={this.handleFormChange}
                            placeholder="VD: WAREHOUSE"
                            disabled={selectedRole?.code === "ADMIN"}
                          />
                          {formErrors.code && (
                            <div className="invalid-feedback">
                              {formErrors.code}
                            </div>
                          )}
                          <small className="text-muted">
                            Chỉ dùng chữ in hoa và dấu gạch dưới
                          </small>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Mô tả</label>
                          <input
                            type="text"
                            className="form-control"
                            name="description"
                            value={formData.description}
                            onChange={this.handleFormChange}
                            placeholder="Mô tả vai trò"
                          />
                        </div>
                      </div>
                    </div>

                    <hr />

                    {/* Permissions */}
                    <h6 className="mb-3">
                      <i className="fa fa-key mr-2"></i>
                      Phân quyền chức năng
                    </h6>

                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead className="thead-light">
                          <tr>
                            <th style={{ width: "200px" }}>Module</th>
                            <th className="text-center">Tất cả</th>
                            {Object.keys(ACTION_LABELS).map((action) => (
                              <th key={action} className="text-center">
                                {ACTION_LABELS[action]}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(PERMISSIONS).map(
                            ([module, config]) => {
                              const modulePermissions =
                                formData.permissions[module] || [];
                              const isAllSelected =
                                config.actions.every((a) =>
                                  modulePermissions.includes(a)
                                );

                              return (
                                <tr key={module}>
                                  <td>
                                    <strong>{config.label}</strong>
                                  </td>
                                  <td className="text-center">
                                    <label className="fancy-checkbox mb-0">
                                      <input
                                        type="checkbox"
                                        checked={isAllSelected}
                                        onChange={(e) =>
                                          this.handleSelectAllModule(
                                            module,
                                            e.target.checked
                                          )
                                        }
                                      />
                                      <span></span>
                                    </label>
                                  </td>
                                  {Object.keys(ACTION_LABELS).map((action) => (
                                    <td key={action} className="text-center">
                                      {config.actions.includes(action) ? (
                                        <label className="fancy-checkbox mb-0">
                                          <input
                                            type="checkbox"
                                            checked={modulePermissions.includes(
                                              action
                                            )}
                                            onChange={() =>
                                              this.handlePermissionChange(
                                                module,
                                                action
                                              )
                                            }
                                          />
                                          <span></span>
                                        </label>
                                      ) : (
                                        <span className="text-muted">-</span>
                                      )}
                                    </td>
                                  ))}
                                </tr>
                              );
                            }
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={this.closeModal}
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={formLoading}
                    >
                      {formLoading ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save mr-2"></i>
                          {selectedRole ? "Cập nhật" : "Thêm mới"}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = ({ navigationReducer }) => {
  return { navigationReducer };
};

export default connect(mapStateToProps)(RoleList);
