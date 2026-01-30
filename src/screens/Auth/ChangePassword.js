import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo-white.svg";
import { changePassword, clearError } from "../../actions/AuthAction";

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
      showCurrentPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
      errors: {},
    };
  }

  componentDidMount() {
    this.props.clearError();
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
      errors: { ...this.state.errors, [name]: '' },
    });
  };

  validateForm = () => {
    const { currentPassword, newPassword, confirmPassword } = this.state;
    const errors = {};

    if (!currentPassword) {
      errors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!newPassword) {
      errors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword = 'Mật khẩu phải có chữ hoa, chữ thường và số';
    } else if (newPassword === currentPassword) {
      errors.newPassword = 'Mật khẩu mới phải khác mật khẩu hiện tại';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) return;

    const { currentPassword, newPassword } = this.state;
    const result = await this.props.changePassword(currentPassword, newPassword);
    
    if (result.success) {
      this.setState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }
  };

  togglePassword = (field) => {
    this.setState({ [field]: !this.state[field] });
  };

  render() {
    const { isLoading, success, error, user } = this.props;
    const { 
      currentPassword, 
      newPassword, 
      confirmPassword, 
      showCurrentPassword, 
      showNewPassword, 
      showConfirmPassword, 
      errors 
    } = this.state;

    return (
      <div className="container-fluid">
        <div className="block-header">
          <div className="row clearfix">
            <div className="col-md-6 col-sm-12">
              <h2>Đổi mật khẩu</h2>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb">
                  <li className="breadcrumb-item">
                    <Link to="/dashboard">Trang chủ</Link>
                  </li>
                  <li className="breadcrumb-item">
                    <Link to="/profile">Tài khoản</Link>
                  </li>
                  <li className="breadcrumb-item active">Đổi mật khẩu</li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div className="row clearfix">
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="header">
                <h2>
                  <i className="fa fa-lock mr-2"></i>
                  Thay đổi mật khẩu
                </h2>
              </div>
              <div className="body">
                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success" role="alert">
                    <i className="fa fa-check-circle mr-2"></i>
                    Mật khẩu đã được thay đổi thành công!
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger alert-dismissible fade show" role="alert">
                    <i className="fa fa-exclamation-triangle mr-2"></i>
                    {error}
                    <button 
                      type="button" 
                      className="close" 
                      onClick={() => this.props.clearError()}
                    >
                      <span>&times;</span>
                    </button>
                  </div>
                )}

                <form onSubmit={this.handleSubmit}>
                  {/* Current Password */}
                  <div className="form-group">
                    <label htmlFor="currentPassword">
                      Mật khẩu hiện tại <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showCurrentPassword ? 'text' : 'password'}
                        className={`form-control ${errors.currentPassword ? 'is-invalid' : ''}`}
                        id="currentPassword"
                        name="currentPassword"
                        placeholder="Nhập mật khẩu hiện tại"
                        value={currentPassword}
                        onChange={this.handleChange}
                        disabled={isLoading}
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => this.togglePassword('showCurrentPassword')}
                          tabIndex="-1"
                        >
                          <i className={`fa ${showCurrentPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    {errors.currentPassword && (
                      <small className="text-danger">{errors.currentPassword}</small>
                    )}
                  </div>

                  {/* New Password */}
                  <div className="form-group">
                    <label htmlFor="newPassword">
                      Mật khẩu mới <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? 'text' : 'password'}
                        className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                        id="newPassword"
                        name="newPassword"
                        placeholder="Nhập mật khẩu mới"
                        value={newPassword}
                        onChange={this.handleChange}
                        disabled={isLoading}
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => this.togglePassword('showNewPassword')}
                          tabIndex="-1"
                        >
                          <i className={`fa ${showNewPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    {errors.newPassword && (
                      <small className="text-danger">{errors.newPassword}</small>
                    )}
                    <small className="text-muted">
                      Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.
                    </small>
                  </div>

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Xác nhận mật khẩu <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu mới"
                        value={confirmPassword}
                        onChange={this.handleChange}
                        disabled={isLoading}
                      />
                      <div className="input-group-append">
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => this.togglePassword('showConfirmPassword')}
                          tabIndex="-1"
                        >
                          <i className={`fa ${showConfirmPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>
                    {errors.confirmPassword && (
                      <small className="text-danger">{errors.confirmPassword}</small>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <i className="fa fa-spinner fa-spin mr-2"></i>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="fa fa-save mr-2"></i>
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Password Tips */}
          <div className="col-md-6 col-lg-4">
            <div className="card">
              <div className="header">
                <h2>
                  <i className="fa fa-info-circle mr-2"></i>
                  Lưu ý bảo mật
                </h2>
              </div>
              <div className="body">
                <ul className="list-unstyled">
                  <li className="mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    Sử dụng ít nhất 6 ký tự
                  </li>
                  <li className="mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    Kết hợp chữ hoa và chữ thường
                  </li>
                  <li className="mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    Thêm ít nhất một chữ số
                  </li>
                  <li className="mb-3">
                    <i className="fa fa-check text-success mr-2"></i>
                    Có thể thêm ký tự đặc biệt (!@#$%...)
                  </li>
                  <li className="mb-3">
                    <i className="fa fa-times text-danger mr-2"></i>
                    Không sử dụng thông tin cá nhân
                  </li>
                  <li className="mb-3">
                    <i className="fa fa-times text-danger mr-2"></i>
                    Không chia sẻ mật khẩu với người khác
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isLoading: auth.changePasswordLoading,
  success: auth.changePasswordSuccess,
  error: auth.changePasswordError,
  user: auth.user,
});

const mapDispatchToProps = {
  changePassword,
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ChangePassword);
