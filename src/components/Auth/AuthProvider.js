import React from "react";
import { connect } from "react-redux";
import { logout } from "../../actions/AuthAction";

/**
 * AuthProvider - Component quản lý kiểm tra auth khi app load
 */
class AuthProvider extends React.Component {
  componentDidMount() {
    // Có thể thêm logic kiểm tra auth ở đây nếu cần
  }

  render() {
    return this.props.children;
  }
}

const mapDispatchToProps = {
  logout,
};

export default connect(null, mapDispatchToProps)(AuthProvider);
