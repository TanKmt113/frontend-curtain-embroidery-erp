import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo-white.svg";
import { forgotPassword, clearError } from "../../actions/AuthAction";

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoad: true,
      email: "",
      errors: {},
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoad: false });
    }, 500);
    
    document.body.classList.remove("theme-cyan", "theme-purple", "theme-blue", "theme-green", "theme-orange", "theme-blush");
    if (this.props.clearError) {
      this.props.clearError();
    }
  }

  handleChange = (e) => {
    this.setState({
      email: e.target.value,
      errors: {},
    });
  };

  validateForm = () => {
    const { email } = this.state;
    const errors = {};

    if (!email) {
      errors.email = 'Vui lòng nhập email';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email không hợp lệ';
    }

    this.setState({ errors });
    return Object.keys(errors).length === 0;
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!this.validateForm()) return;

    const { email } = this.state;
    await this.props.forgotPassword(email);
  };

  render() {
    const { isLoading, success, error } = this.props;
    const { isLoad, email, errors } = this.state;

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

                {/* Forgot Password Card */}
                <div className="card">
                  <div className="header">
                    <p className="lead">Quên mật khẩu</p>
                  </div>
                  <div className="body">
                    {/* Success Alert */}
                    {success && (
                      <div className="alert alert-success" role="alert">
                        <i className="fa fa-check-circle mr-2"></i>
                        Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.
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

                    {!success ? (
                      <>
                        <p className="text-muted">
                          Nhập địa chỉ email của bạn. Chúng tôi sẽ gửi link khôi phục mật khẩu.
                        </p>

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
                                placeholder="Nhập email đã đăng ký"
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

                          {/* Submit Button */}
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg btn-block"
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <i className="fa fa-spinner fa-spin mr-2"></i>
                                Đang gửi...
                              </>
                            ) : (
                              <>
                                <i className="fa fa-paper-plane mr-2"></i>
                                Gửi yêu cầu
                              </>
                            )}
                          </button>
                        </form>
                      </>
                    ) : (
                      <div className="text-center">
                        <i className="fa fa-envelope-open fa-3x text-success mb-3"></i>
                        <p>Vui lòng kiểm tra email và làm theo hướng dẫn để đặt lại mật khẩu.</p>
                      </div>
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
  isLoading: auth?.forgotPasswordLoading || false,
  success: auth?.forgotPasswordSuccess || false,
  error: auth?.forgotPasswordError || null,
});

const mapDispatchToProps = {
  forgotPassword,
  clearError,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword);
