import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo-white.svg";
import { resetPassword, clearError } from "../../actions/AuthAction";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      errors: {},
      token: "",
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoad: false });
    }, 500);
    
    document.body.classList.remove("theme-cyan", "theme-purple", "theme-blue", "theme-green", "theme-orange", "theme-blush");
    
    // Lấy token từ URL query params
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      this.setState({ token });
    }
    
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
    const { password, confirmPassword, token } = this.state;
    const errors = {};

    if (!token) {
      errors.token = 'Token không hợp lệ';
    }

    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu mới';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      errors.password = 'Mật khẩu phải có chữ hoa, chữ thường và số';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) return;

    const { token, password } = this.state;
    const result = await this.props.resetPassword(token, password);
    
    if (result.success) {
      // Redirect to login after 3 seconds
      setTimeout(() => {
        this.props.history.push('/login');
      }, 3000);
    }
  };

  togglePassword = (field) => {
    this.setState({ [field]: !this.state[field] });
  };

  render() {
    const { isLoading, success, error } = this.props;
    const { isLoad, password, confirmPassword, showPassword, showConfirmPassword, errors, token } = this.state;

    return (
      <div className="theme-cyan">
        {/* Page Loader */}
        <div className="page-loader-wrapper" style={{ display: isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30">
              <img src={require('../../assets/images/logo-icon.svg')} width="48" height="48" alt="Logo" />
            </div>
            <p>Đang tải...</p>
          </div>
        </div>

        <div className="hide-border">
          <div className="vertical-align-wrap">
            <div className="vertical-align-middle auth-main">
              <div className="auth-box">
                {/* Logo */}
                <div className="top">
                  <img src={Logo} alt="Logo" style={{ height: "40px", margin: "10px" }} />
                </div>

                {/* Reset Password Card */}
                <div className="card">
                  <div className="header">
                    <p className="lead">Đặt lại mật khẩu</p>
                  </div>
                  <div className="body">
                    {/* Success Alert */}
                    {success && (
                      <div className="alert alert-success" role="alert">
                        <i className="fa fa-check-circle mr-2"></i>
                        Mật khẩu đã được đặt lại thành công! Đang chuyển hướng đến trang đăng nhập...
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

                    {/* Invalid Token */}
                    {!token && (
                      <div className="alert alert-warning" role="alert">
                        <i className="fa fa-exclamation-triangle mr-2"></i>
                        Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
                      </div>
                    )}

                    {!success && token && (
                      <>
                        <p className="text-muted">
                          Nhập mật khẩu mới cho tài khoản của bạn.
                        </p>

                        <form onSubmit={this.handleSubmit} className="form-auth-small">
                          {/* New Password Field */}
                          <div className="form-group">
                            <label className="control-label" htmlFor="password">
                              Mật khẩu mới <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="fa fa-lock"></i>
                                </span>
                              </div>
                              <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                placeholder="Nhập mật khẩu mới"
                                value={password}
                                onChange={this.handleChange}
                                disabled={isLoading}
                              />
                              <div className="input-group-append">
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => this.togglePassword('showPassword')}
                                  tabIndex="-1"
                                >
                                  <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                </button>
                              </div>
                            </div>
                            {errors.password && (
                              <small className="text-danger">{errors.password}</small>
                            )}
                            <small className="text-muted">
                              Mật khẩu phải có ít nhất 6 ký tự, bao gồm chữ hoa, chữ thường và số.
                            </small>
                          </div>

                          {/* Confirm Password Field */}
                          <div className="form-group">
                            <label className="control-label" htmlFor="confirmPassword">
                              Xác nhận mật khẩu <span className="text-danger">*</span>
                            </label>
                            <div className="input-group">
                              <div className="input-group-prepend">
                                <span className="input-group-text">
                                  <i className="fa fa-lock"></i>
                                </span>
                              </div>
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
                            className="btn btn-primary btn-lg btn-block"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <i className="fa fa-spinner fa-spin mr-2"></i>
                                Đang xử lý...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-check mr-2"></i>
                                Đặt lại mật khẩu
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    )}

                    {/* Back to Login */}
                    <div className="bottom text-center mt-4">
                      <Link to="/login" className="btn btn-outline-secondary">
                        <i className="fa fa-arrow-left mr-2"></i>
                        Quay lại đăng nhập
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-3">
                  <small className="text-muted">
                    © {new Date().getFullYear()} Rèm & Thêu ERP. All rights reserved.
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  isLoading: auth.resetPasswordLoading,
  success: auth.resetPasswordSuccess,
  error: auth.resetPasswordError,
});

const mapDispatchToProps = {
  resetPassword,
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);
