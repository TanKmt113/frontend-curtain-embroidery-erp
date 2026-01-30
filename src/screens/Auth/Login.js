import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../assets/images/logo-white.svg";
import { login, clearError } from "../actions/AuthAction";

class Login extends React.Component {
  constructor(props) {
    super(props);
    
    // Kiểm tra remember me
    const rememberedEmail = localStorage.getItem('rememberedEmail') || '';
    const rememberMe = localStorage.getItem('rememberMe') === 'true';
    
    this.state = {
      isLoad: true,
      email: rememberedEmail,
      password: "",
      rememberMe: rememberMe,
      showPassword: false,
      errors: {},
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoad: false });
    }, 500);
    
    // Xóa các theme class cũ
    document.body.classList.remove("theme-cyan", "theme-purple", "theme-blue", "theme-green", "theme-orange", "theme-blush");
    
    // Clear error khi mount
    this.props.clearError();
  }

  componentDidUpdate(prevProps) {
    // Redirect nếu đã đăng nhập
    if (this.props.isAuthenticated && !prevProps.isAuthenticated) {
      this.props.history.push('/dashboard');
    }
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type === 'checkbox' ? checked : value,
      errors: { ...this.state.errors, [name]: '' },
    });
  };

  validateForm = () => {
    const { email, password } = this.state;
    const errors = {};

    if (!email) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }

    if (!password) {
      errors.password = 'Vui lòng nhập mật khẩu';
    } else if (password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) return;

    const { email, password, rememberMe } = this.state;
    const result = await this.props.login(email, password, rememberMe);
    
    if (result.success) {
      this.props.history.push('/dashboard');
    }
  };

  togglePassword = () => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    const { isLoading, error } = this.props;
    const { isLoad, email, password, rememberMe, showPassword, errors } = this.state;

    return (
      <div className="theme-cyan">
        {/* Page Loader */}
        <div className="page-loader-wrapper" style={{ display: isLoad ? 'block' : 'none' }}>
          <div className="loader">
            <div className="m-t-30">
              <img src={require('../assets/images/logo-icon.svg')} width="48" height="48" alt="Logo" />
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

                {/* Login Card */}
                <div className="card">
                  <div className="header">
                    <p className="lead">Đăng nhập vào hệ thống</p>
                  </div>
                  <div className="body">
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

                    <form onSubmit={this.handleSubmit} className="form-auth-small">
                      {/* Email Field */}
                      <div className="form-group">
                        <label className="control-label" htmlFor="email">
                          Email <span className="text-danger">*</span>
                        </label>
                        <div className="input-group">
                          <div className="input-group-prepend">
                            <span className="input-group-text">
                              <i className="fa fa-envelope"></i>
                            </span>
                          </div>
                          <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            id="email"
                            name="email"
                            placeholder="Nhập email"
                            value={email}
                            onChange={this.handleChange}
                            disabled={isLoading}
                            autoComplete="email"
                          />
                        </div>
                        {errors.email && (
                          <small className="text-danger">{errors.email}</small>
                        )}
                      </div>

                      {/* Password Field */}
                      <div className="form-group">
                        <label className="control-label" htmlFor="password">
                          Mật khẩu <span className="text-danger">*</span>
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
                            placeholder="Nhập mật khẩu"
                            value={password}
                            onChange={this.handleChange}
                            disabled={isLoading}
                            autoComplete="current-password"
                          />
                          <div className="input-group-append">
                            <button
                              type="button"
                              className="btn btn-outline-secondary"
                              onClick={this.togglePassword}
                              tabIndex="-1"
                            >
                              <i className={`fa ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                            </button>
                          </div>
                        </div>
                        {errors.password && (
                          <small className="text-danger">{errors.password}</small>
                        )}
                      </div>

                      {/* Remember Me */}
                      <div className="form-group clearfix">
                        <label className="fancy-checkbox element-left">
                          <input
                            type="checkbox"
                            name="rememberMe"
                            checked={rememberMe}
                            onChange={this.handleChange}
                          />
                          <span>Ghi nhớ đăng nhập</span>
                        </label>
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
                            Đang đăng nhập...
                          </>
                        ) : (
                          <>
                            <i className="fa fa-sign-in mr-2"></i>
                            Đăng nhập
                          </>
                        )}
                      </button>

                      {/* Links */}
                      <div className="bottom">
                        <span className="helper-text m-b-10">
                          <i className="fa fa-lock"></i>{" "}
                          <Link to="/forgotpassword">Quên mật khẩu?</Link>
                        </span>
                      </div>
                    </form>
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
  isLoading: auth.isLoading,
  isAuthenticated: auth.isAuthenticated,
  error: auth.error,
});

const mapDispatchToProps = {
  login,
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
