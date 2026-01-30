/**
 * User List Screen
 * Quản lý người dùng theo README spec
 * - Roles: ADMIN, SALES, PRODUCTION, QC, WAREHOUSE, INSTALLER, ACCOUNTANT
 * - Status: ACTIVE, INACTIVE, SUSPENDED
 */

import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";
import { userService } from "../../api";

// Định nghĩa roles theo schema Prisma
const USER_ROLES = [
  { value: "ADMIN", label: "Quản trị viên", color: "badge-danger" },
  { value: "SALES", label: "Nhân viên kinh doanh", color: "badge-info" },
  { value: "PRODUCTION", label: "Nhân viên sản xuất", color: "badge-warning" },
  { value: "QC", label: "Nhân viên QC", color: "badge-purple" },
  { value: "WAREHOUSE", label: "Nhân viên kho", color: "badge-success" },
  { value: "INSTALLER", label: "Nhân viên lắp đặt", color: "badge-primary" },
  { value: "ACCOUNTANT", label: "Kế toán", color: "badge-secondary" },
];

// Định nghĩa status theo schema Prisma
const USER_STATUS = [
  { value: "ACTIVE", label: "Hoạt động", color: "badge-success" },
  { value: "INACTIVE", label: "Không hoạt động", color: "badge-secondary" },
  { value: "SUSPENDED", label: "Bị tạm khóa", color: "badge-danger" },
];

class UserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      loading: true,
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: "",
        role: "",
        status: "",
      },
      showModal: false,
      modalMode: "create", // create | edit | changePassword | resetPassword
      selectedUser: null,
      formData: {
        fullName: "",
        email: "",
        phone: "",
        role: "SALES",
        password: "",
        confirmPassword: "",
        status: "ACTIVE",
        // For change password
        currentPassword: "",
        newPassword: "",
      },
      formErrors: {},
      formLoading: false,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadUsers();
  }

  loadUsers = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      const params = {
        page: pagination.page,
        pageSize: pagination.pageSize,
      };
      if (filters.search) params.search = filters.search;
      if (filters.role) params.role = filters.role;
      if (filters.status) params.status = filters.status;

      const response = await userService.getAll(params);

      this.setState({
        users: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      console.error("Error loading users:", error);
      this.setState({ loading: false, users: [] });
    }
  };

  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      {
        filters: { ...this.state.filters, [name]: value },
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadUsers()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadUsers()
    );
  };

  // Open modal for create new user
  openCreateModal = () => {
    this.setState({
      showModal: true,
      modalMode: "create",
      selectedUser: null,
      formData: {
        fullName: "",
        email: "",
        phone: "",
        role: "SALES",
        password: "",
        confirmPassword: "",
        status: "ACTIVE",
        currentPassword: "",
        newPassword: "",
      },
      formErrors: {},
    });
  };

  // Open modal for edit user
  openEditModal = (user) => {
    this.setState({
      showModal: true,
      modalMode: "edit",
      selectedUser: user,
      formData: {
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        role: user.role || "SALES",
        password: "",
        confirmPassword: "",
        status: user.status || "ACTIVE",
        currentPassword: "",
        newPassword: "",
      },
      formErrors: {},
    });
  };

  // Open modal for change password (user changes their own)
  openChangePasswordModal = (user) => {
    this.setState({
      showModal: true,
      modalMode: "changePassword",
      selectedUser: user,
      formData: {
        ...this.state.formData,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      formErrors: {},
    });
  };

  // Open modal for reset password (admin resets)
  openResetPasswordModal = (user) => {
    this.setState({
      showModal: true,
      modalMode: "resetPassword",
      selectedUser: user,
      formData: {
        ...this.state.formData,
        newPassword: "",
        confirmPassword: "",
      },
      formErrors: {},
    });
  };

  closeModal = () => {
    this.setState({
      showModal: false,
      selectedUser: null,
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

  validateForm = () => {
    const { formData, modalMode } = this.state;
    const errors = {};

    if (modalMode === "create" || modalMode === "edit") {
      if (!formData.fullName.trim()) {
        errors.fullName = "Vui lòng nhập họ tên";
      }
      if (!formData.email.trim()) {
        errors.email = "Vui lòng nhập email";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = "Email không hợp lệ";
      }
      if (!formData.role) {
        errors.role = "Vui lòng chọn vai trò";
      }
      
      if (modalMode === "create") {
        if (!formData.password) {
          errors.password = "Vui lòng nhập mật khẩu";
        } else if (formData.password.length < 6) {
          errors.password = "Mật khẩu phải có ít nhất 6 ký tự";
        }
        if (formData.password !== formData.confirmPassword) {
          errors.confirmPassword = "Mật khẩu xác nhận không khớp";
        }
      }
    }

    if (modalMode === "changePassword") {
      if (!formData.currentPassword) {
        errors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      }
      if (!formData.newPassword) {
        errors.newPassword = "Vui lòng nhập mật khẩu mới";
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    if (modalMode === "resetPassword") {
      if (!formData.newPassword) {
        errors.newPassword = "Vui lòng nhập mật khẩu mới";
      } else if (formData.newPassword.length < 6) {
        errors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      }
      if (formData.newPassword !== formData.confirmPassword) {
        errors.confirmPassword = "Mật khẩu xác nhận không khớp";
      }
    }

    this.setState({ formErrors: errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();

    if (!this.validateForm()) return;

    this.setState({ formLoading: true });

    try {
      const { formData, modalMode, selectedUser } = this.state;

      if (modalMode === "create") {
        // POST /api/v1/users
        await userService.create({
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          password: formData.password,
          status: formData.status,
        });
        alert("Thêm người dùng thành công");
      } else if (modalMode === "edit") {
        // PUT /api/v1/users/:id
        await userService.update(selectedUser.id, {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          role: formData.role,
          status: formData.status,
        });
        alert("Cập nhật người dùng thành công");
      } else if (modalMode === "changePassword") {
        // POST /api/v1/users/:id/change-password
        await userService.changePassword(selectedUser.id, {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        });
        alert("Đổi mật khẩu thành công");
      } else if (modalMode === "resetPassword") {
        // POST /api/v1/users/:id/reset-password
        await userService.resetPassword(selectedUser.id, {
          newPassword: formData.newPassword,
        });
        alert("Reset mật khẩu thành công");
      }

      this.closeModal();
      this.loadUsers();
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      this.setState({ formLoading: false });
    }
  };

  handleDelete = async (user) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng "${user.fullName}"?`)) {
      return;
    }

    try {
      // DELETE /api/v1/users/:id
      await userService.delete(user.id);
      alert("Xóa người dùng thành công");
      this.loadUsers();
    } catch (error) {
      alert(error.message || "Không thể xóa người dùng");
    }
  };

  handleToggleStatus = async (user) => {
    const newStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const action = newStatus === "ACTIVE" ? "kích hoạt" : "vô hiệu hóa";
    
    if (!window.confirm(`Bạn có chắc muốn ${action} tài khoản "${user.fullName}"?`)) {
      return;
    }

    try {
      await userService.update(user.id, { status: newStatus });
      alert(`Đã ${action} tài khoản thành công`);
      this.loadUsers();
    } catch (error) {
      alert(error.message || "Không thể cập nhật trạng thái");
    }
  };

  getRoleBadge = (role) => {
    const roleConfig = USER_ROLES.find((r) => r.value === role);
    return (
      <span className={`badge ${roleConfig?.color || "badge-secondary"}`}>
        {roleConfig?.label || role}
      </span>
    );
  };

  getStatusBadge = (status) => {
    const statusConfig = USER_STATUS.find((s) => s.value === status);
    return (
      <span className={`badge ${statusConfig?.color || "badge-secondary"}`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  renderModalContent = () => {
    const { modalMode, formData, formErrors, formLoading, selectedUser } = this.state;

    if (modalMode === "create" || modalMode === "edit") {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="modal-body">
            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Họ tên <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formErrors.fullName ? "is-invalid" : ""}`}
                    name="fullName"
                    value={formData.fullName}
                    onChange={this.handleFormChange}
                    placeholder="Nhập họ tên"
                  />
                  {formErrors.fullName && (
                    <div className="invalid-feedback">{formErrors.fullName}</div>
                  )}
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Email <span className="text-danger">*</span>
                  </label>
                  <input
                    type="email"
                    className={`form-control ${formErrors.email ? "is-invalid" : ""}`}
                    name="email"
                    value={formData.email}
                    onChange={this.handleFormChange}
                    placeholder="Nhập email"
                    disabled={modalMode === "edit"} // Email không thể sửa
                  />
                  {formErrors.email && (
                    <div className="invalid-feedback">{formErrors.email}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Điện thoại</label>
                  <input
                    type="text"
                    className="form-control"
                    name="phone"
                    value={formData.phone}
                    onChange={this.handleFormChange}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <label>
                    Vai trò <span className="text-danger">*</span>
                  </label>
                  <select
                    className={`form-control ${formErrors.role ? "is-invalid" : ""}`}
                    name="role"
                    value={formData.role}
                    onChange={this.handleFormChange}
                  >
                    {USER_ROLES.map((role) => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                  {formErrors.role && (
                    <div className="invalid-feedback">{formErrors.role}</div>
                  )}
                </div>
              </div>
            </div>

            {modalMode === "create" && (
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Mật khẩu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.password ? "is-invalid" : ""}`}
                      name="password"
                      value={formData.password}
                      onChange={this.handleFormChange}
                      placeholder="Nhập mật khẩu"
                    />
                    {formErrors.password && (
                      <div className="invalid-feedback">{formErrors.password}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>
                      Xác nhận mật khẩu <span className="text-danger">*</span>
                    </label>
                    <input
                      type="password"
                      className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={this.handleFormChange}
                      placeholder="Nhập lại mật khẩu"
                    />
                    {formErrors.confirmPassword && (
                      <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="row">
              <div className="col-md-6">
                <div className="form-group">
                  <label>Trạng thái</label>
                  <select
                    className="form-control"
                    name="status"
                    value={formData.status}
                    onChange={this.handleFormChange}
                  >
                    {USER_STATUS.map((status) => (
                      <option key={status.value} value={status.value}>
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.closeModal}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fa fa-save mr-2"></i>
                  {modalMode === "create" ? "Thêm mới" : "Cập nhật"}
                </>
              )}
            </button>
          </div>
        </form>
      );
    }

    if (modalMode === "changePassword") {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="modal-body">
            <p className="text-muted mb-3">
              Đổi mật khẩu cho: <strong>{selectedUser?.fullName}</strong>
            </p>
            <div className="form-group">
              <label>
                Mật khẩu hiện tại <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${formErrors.currentPassword ? "is-invalid" : ""}`}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={this.handleFormChange}
                placeholder="Nhập mật khẩu hiện tại"
              />
              {formErrors.currentPassword && (
                <div className="invalid-feedback">{formErrors.currentPassword}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Mật khẩu mới <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${formErrors.newPassword ? "is-invalid" : ""}`}
                name="newPassword"
                value={formData.newPassword}
                onChange={this.handleFormChange}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
              {formErrors.newPassword && (
                <div className="invalid-feedback">{formErrors.newPassword}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Xác nhận mật khẩu mới <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={this.handleFormChange}
                placeholder="Nhập lại mật khẩu mới"
              />
              {formErrors.confirmPassword && (
                <div className="invalid-feedback">{formErrors.confirmPassword}</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.closeModal}>
              Hủy
            </button>
            <button type="submit" className="btn btn-primary" disabled={formLoading}>
              {formLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  Đang lưu...
                </>
              ) : (
                <>
                  <i className="fa fa-key mr-2"></i>
                  Đổi mật khẩu
                </>
              )}
            </button>
          </div>
        </form>
      );
    }

    if (modalMode === "resetPassword") {
      return (
        <form onSubmit={this.handleSubmit}>
          <div className="modal-body">
            <div className="alert alert-warning">
              <i className="fa fa-warning mr-2"></i>
              Bạn đang reset mật khẩu cho: <strong>{selectedUser?.fullName}</strong>
            </div>
            <div className="form-group">
              <label>
                Mật khẩu mới <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${formErrors.newPassword ? "is-invalid" : ""}`}
                name="newPassword"
                value={formData.newPassword}
                onChange={this.handleFormChange}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
              {formErrors.newPassword && (
                <div className="invalid-feedback">{formErrors.newPassword}</div>
              )}
            </div>
            <div className="form-group">
              <label>
                Xác nhận mật khẩu mới <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${formErrors.confirmPassword ? "is-invalid" : ""}`}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={this.handleFormChange}
                placeholder="Nhập lại mật khẩu mới"
              />
              {formErrors.confirmPassword && (
                <div className="invalid-feedback">{formErrors.confirmPassword}</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={this.closeModal}>
              Hủy
            </button>
            <button type="submit" className="btn btn-warning" disabled={formLoading}>
              {formLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm mr-2"></span>
                  Đang xử lý...
                </>
              ) : (
                <>
                  <i className="fa fa-refresh mr-2"></i>
                  Reset mật khẩu
                </>
              )}
            </button>
          </div>
        </form>
      );
    }

    return null;
  };

  getModalTitle = () => {
    const { modalMode } = this.state;
    switch (modalMode) {
      case "create":
        return "Thêm người dùng mới";
      case "edit":
        return "Cập nhật người dùng";
      case "changePassword":
        return "Đổi mật khẩu";
      case "resetPassword":
        return "Reset mật khẩu";
      default:
        return "";
    }
  };

  render() {
    const { users, loading, pagination, filters, showModal } = this.state;

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
              HeaderText="Quản lý người dùng"
              Breadcrumb={[
                { name: "Cài đặt", navigate: "" },
                { name: "Người dùng", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                {/* Filter Card */}
                <div className="card">
                  <div className="body">
                    <div className="row">
                      <div className="col-md-4">
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm theo tên, email..."
                            name="search"
                            value={filters.search}
                            onChange={this.handleFilterChange}
                          />
                          <div className="input-group-append">
                            <span className="input-group-text">
                              <i className="icon-magnifier"></i>
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-control"
                          name="role"
                          value={filters.role}
                          onChange={this.handleFilterChange}
                        >
                          <option value="">-- Tất cả vai trò --</option>
                          {USER_ROLES.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-control"
                          name="status"
                          value={filters.status}
                          onChange={this.handleFilterChange}
                        >
                          <option value="">-- Trạng thái --</option>
                          {USER_STATUS.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4 text-right">
                        <button
                          className="btn btn-primary"
                          onClick={this.openCreateModal}
                        >
                          <i className="fa fa-plus mr-2"></i>
                          Thêm người dùng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Table */}
                <div className="card">
                  <div className="body">
                    {loading ? (
                      <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : users.length === 0 ? (
                      <div className="text-center p-5">
                        <i className="fa fa-users fa-3x text-muted mb-3"></i>
                        <p className="text-muted">Chưa có người dùng nào</p>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table table-hover table-custom">
                            <thead>
                              <tr>
                                <th>#</th>
                                <th>Người dùng</th>
                                <th>Email</th>
                                <th>Điện thoại</th>
                                <th>Vai trò</th>
                                <th>Trạng thái</th>
                                <th>Đăng nhập gần nhất</th>
                                <th className="text-center" style={{ width: 200 }}>
                                  Thao tác
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {users.map((user, index) => (
                                <tr key={user.id}>
                                  <td>
                                    {(pagination.page - 1) * pagination.pageSize + index + 1}
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div
                                        className="avatar mr-2"
                                        style={{
                                          width: 36,
                                          height: 36,
                                          borderRadius: "50%",
                                          background: "#e0e0e0",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                        }}
                                      >
                                        {user.avatar ? (
                                          <img
                                            src={user.avatar}
                                            alt=""
                                            style={{
                                              width: "100%",
                                              height: "100%",
                                              borderRadius: "50%",
                                              objectFit: "cover",
                                            }}
                                          />
                                        ) : (
                                          <span className="text-muted">
                                            {user.fullName?.charAt(0)?.toUpperCase()}
                                          </span>
                                        )}
                                      </div>
                                      <strong>{user.fullName}</strong>
                                    </div>
                                  </td>
                                  <td>{user.email}</td>
                                  <td>{user.phone || "-"}</td>
                                  <td>{this.getRoleBadge(user.role)}</td>
                                  <td>{this.getStatusBadge(user.status)}</td>
                                  <td>
                                    {user.lastLoginAt
                                      ? new Date(user.lastLoginAt).toLocaleString("vi-VN")
                                      : "-"}
                                  </td>
                                  <td className="text-center">
                                    <button
                                      className="btn btn-sm btn-outline-primary mr-1"
                                      onClick={() => this.openEditModal(user)}
                                      title="Sửa thông tin"
                                    >
                                      <i className="fa fa-pencil"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-warning mr-1"
                                      onClick={() => this.openResetPasswordModal(user)}
                                      title="Reset mật khẩu"
                                    >
                                      <i className="fa fa-key"></i>
                                    </button>
                                    <button
                                      className={`btn btn-sm ${
                                        user.status === "ACTIVE"
                                          ? "btn-outline-secondary"
                                          : "btn-outline-success"
                                      } mr-1`}
                                      onClick={() => this.handleToggleStatus(user)}
                                      title={
                                        user.status === "ACTIVE" ? "Vô hiệu hóa" : "Kích hoạt"
                                      }
                                    >
                                      <i
                                        className={`fa ${
                                          user.status === "ACTIVE" ? "fa-ban" : "fa-check"
                                        }`}
                                      ></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() => this.handleDelete(user)}
                                      title="Xóa người dùng"
                                    >
                                      <i className="fa fa-trash"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {/* Pagination */}
                        {pagination.totalPages > 1 && (
                          <div className="d-flex justify-content-between align-items-center mt-4">
                            <div>
                              Hiển thị {users.length} / {pagination.total} người dùng
                            </div>
                            <nav>
                              <ul className="pagination mb-0">
                                <li
                                  className={`page-item ${
                                    pagination.page === 1 ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => this.handlePageChange(pagination.page - 1)}
                                  >
                                    <i className="fa fa-angle-left"></i>
                                  </button>
                                </li>
                                {[...Array(pagination.totalPages)].map((_, i) => (
                                  <li
                                    key={i + 1}
                                    className={`page-item ${
                                      pagination.page === i + 1 ? "active" : ""
                                    }`}
                                  >
                                    <button
                                      className="page-link"
                                      onClick={() => this.handlePageChange(i + 1)}
                                    >
                                      {i + 1}
                                    </button>
                                  </li>
                                ))}
                                <li
                                  className={`page-item ${
                                    pagination.page === pagination.totalPages ? "disabled" : ""
                                  }`}
                                >
                                  <button
                                    className="page-link"
                                    onClick={() => this.handlePageChange(pagination.page + 1)}
                                  >
                                    <i className="fa fa-angle-right"></i>
                                  </button>
                                </li>
                              </ul>
                            </nav>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal */}
        {showModal && (
          <div
            className="modal fade show"
            style={{ display: "block", background: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">{this.getModalTitle()}</h5>
                  <button type="button" className="close" onClick={this.closeModal}>
                    <span>&times;</span>
                  </button>
                </div>
                {this.renderModalContent()}
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

export default connect(mapStateToProps)(UserList);
