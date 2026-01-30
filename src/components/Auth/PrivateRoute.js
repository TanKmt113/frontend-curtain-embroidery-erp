import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";

/**
 * PrivateRoute - Component bảo vệ routes yêu cầu đăng nhập
 */
const PrivateRoute = ({ 
  component: Component, 
  isAuthenticated, 
  isCheckingAuth,
  requiredRoles,
  user,
  ...rest 
}) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        // Đang kiểm tra auth
        if (isCheckingAuth) {
          return (
            <div className="page-loader-wrapper" style={{ display: 'block' }}>
              <div className="loader">
                <div className="m-t-30">
                  <i className="fa fa-spinner fa-spin fa-3x"></i>
                </div>
                <p>Đang kiểm tra xác thực...</p>
              </div>
            </div>
          );
        }

        // Chưa đăng nhập
        if (!isAuthenticated) {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: props.location },
              }}
            />
          );
        }

        // Kiểm tra role nếu có yêu cầu
        if (requiredRoles && requiredRoles.length > 0) {
          const userRole = user?.role;
          if (!userRole || !requiredRoles.includes(userRole)) {
            return (
              <Redirect
                to={{
                  pathname: "/page403",
                  state: { from: props.location },
                }}
              />
            );
          }
        }

        // Render component
        return <Component {...props} />;
      }}
    />
  );
};

const mapStateToProps = ({ auth }) => ({
  isAuthenticated: auth.isAuthenticated,
  isCheckingAuth: auth.isCheckingAuth,
  user: auth.user,
});

export default connect(mapStateToProps)(PrivateRoute);
