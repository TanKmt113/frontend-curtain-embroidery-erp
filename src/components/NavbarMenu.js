import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Dropdown, Nav, Toast } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
} from "../actions";
import Logo from "../assets/images/logo.svg";
import LogoWhite from "../assets/images/logo-white.svg";
import UserImage from "../assets/images/user.png";
import Avatar4 from "../assets/images/xs/avatar4.jpg";
import Avatar5 from "../assets/images/xs/avatar5.jpg";
import Avatar2 from "../assets/images/xs/avatar2.jpg";
import Avatar1 from "../assets/images/xs/avatar1.jpg";
import Avatar3 from "../assets/images/xs/avatar3.jpg";

class NavbarMenu extends React.Component {
  state = {
    linkupdate: false,
  };
  componentDidMount() {
    this.props.tostMessageLoad(true);
    var res = window.location.pathname;
    res = res.split("/");
    res = res.length > 4 ? res[4] : "/";
    const { activeKey } = this.props;
    this.activeMenutabwhenNavigate("/" + activeKey);
  }

  activeMenutabwhenNavigate(activeKey) {
    // Dashboard
    if (
      activeKey === "/dashboard" ||
      activeKey === "/demographic" ||
      activeKey === "/ioT" ||
      activeKey === "/reports"
    ) {
      this.activeMenutabContainer("dashboradContainer");
    }
    // Khách hàng
    else if (activeKey && activeKey.includes("customer")) {
      this.activeMenutabContainer("CustomerContainer");
    }
    // Sản phẩm
    else if (activeKey && activeKey.includes("product")) {
      this.activeMenutabContainer("ProductContainer");
    }
    // Báo giá
    else if (activeKey && activeKey.includes("quotation")) {
      this.activeMenutabContainer("QuotationContainer");
    }
    // Đơn hàng
    else if (activeKey && activeKey.includes("order") && !activeKey.includes("work-order")) {
      this.activeMenutabContainer("OrderContainer");
    }
    // Sản xuất
    else if (activeKey && (activeKey.includes("work-order") || activeKey.includes("production"))) {
      this.activeMenutabContainer("WorkOrderContainer");
    }
    // QC
    else if (activeKey && activeKey.includes("qc")) {
      this.activeMenutabContainer("QCContainer");
    }
    // Kho
    else if (activeKey && activeKey.includes("inventory")) {
      this.activeMenutabContainer("InventoryContainer");
    }
    // Giao hàng
    else if (activeKey && (activeKey.includes("deliver") || activeKey.includes("installation"))) {
      this.activeMenutabContainer("DeliveryContainer");
    }
    // Cài đặt
    else if (activeKey && (activeKey.includes("user") || activeKey.includes("role") || activeKey.includes("setting"))) {
      this.activeMenutabContainer("SettingsContainer");
    }
  }

  // componentWillReceiveProps(){
  //   this.setState({
  //     linkupdate:!this.state.linkupdate
  //   })
  // }

  activeMenutabContainer(id) {
    var parents = document.getElementById("main-menu");
    var activeMenu = document.getElementById(id);

    if (!parents || !activeMenu) return;

    for (let index = 0; index < parents.children.length; index++) {
      if (parents.children[index].id !== id) {
        parents.children[index].classList.remove("active");
        if (parents.children[index].children[1]) {
          parents.children[index].children[1].classList.remove("in");
        }
      }
    }
    setTimeout(() => {
      if (activeMenu) {
        activeMenu.classList.toggle("active");
        if (activeMenu.children[1]) {
          activeMenu.children[1].classList.toggle("in");
        }
      }
    }, 10);
  }
  render() {
    const {
      addClassactive,
      addClassactiveChildAuth,
      addClassactiveChildMaps,
      themeColor,
      toggleNotification,
      toggleEqualizer,
      sideMenuTab,
      isToastMessage,
      activeKey,
    } = this.props;
    var path = window.location.pathname;
    document.body.classList.add(themeColor);

    return (
      <div>
        {isToastMessage ? (
          <Toast
            id="toast-container"
            show={isToastMessage}
            onClose={() => {
              this.props.tostMessageLoad(false);
            }}
            className="toast-info toast-top-right"
            autohide={true}
            delay={5000}
          >
            <Toast.Header className="toast-info mb-0">
              Hello, welcome to Lucid, a unique admin Template.
            </Toast.Header>
          </Toast>
        ) : null}
        <nav className="navbar navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-btn">
              <button
                className="btn-toggle-offcanvas"
                onClick={() => {
                  this.props.onPressSideMenuToggle();
                }}
              >
                <i className="lnr lnr-menu fa fa-bars"></i>
              </button>
            </div>

            <div className="navbar-brand">
              <Link to="/dashboard">
                <img
                  src={
                    document.body.classList.contains("full-dark")
                      ? LogoWhite
                      : Logo
                  }
                  alt="Lucid Logo"
                  className="img-responsive logo"
                />
              </Link>
            </div>

            <div className="navbar-right">
              <form id="navbar-search" className="navbar-form search-form">
                <input
                  className="form-control"
                  placeholder="Search here..."
                  type="text"
                />
                <button type="button" className="btn btn-default">
                  <i className="icon-magnifier"></i>
                </button>
              </form>

              <div id="navbar-menu">
                <ul className="nav navbar-nav">
                  <li>
                    <Link
                      to="/filedocuments"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                    >
                      <i className="fa fa-folder-open-o"></i>
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/appcalendar"
                      className="icon-menu d-none d-sm-block d-md-none d-lg-block"
                    >
                      <i className="icon-calendar"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="/appchat" className="icon-menu d-none d-sm-block">
                      <i className="icon-bubbles"></i>
                    </Link>
                  </li>
                  <li>
                    <Link to="/appinbox" className="icon-menu d-none d-sm-block">
                      <i className="icon-envelope"></i>
                      <span className="notification-dot"></span>
                    </Link>
                  </li>
                  <li
                    className={
                      toggleNotification ? "show dropdown" : "dropdown"
                    }
                  >
                    <a
                      href="#!"
                      className="dropdown-toggle icon-menu"
                      data-toggle="dropdown"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.onPressNotification();
                      }}
                    >
                      <i className="icon-bell"></i>
                      <span className="notification-dot"></span>
                    </a>
                    <ul
                      className={
                        toggleNotification
                          ? "dropdown-menu notifications show"
                          : "dropdown-menu notifications"
                      }
                    >
                      <li className="header">
                        <strong>You have 4 new Notifications</strong>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-info text-warning"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Campaign <strong>Holiday Sale</strong> is nearly
                                reach budget limit.
                              </p>
                              <span className="timestamp">10:00 AM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-like text-success"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Your New Campaign <strong>Holiday Sale</strong>{" "}
                                is approved.
                              </p>
                              <span className="timestamp">11:30 AM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-pie-chart text-info"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Website visits from Twitter is 27% higher than
                                last week.
                              </p>
                              <span className="timestamp">04:00 PM Today</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li>
                        <a>
                          <div className="media">
                            <div className="media-left">
                              <i className="icon-info text-danger"></i>
                            </div>
                            <div className="media-body">
                              <p className="text">
                                Error on website analytics configurations
                              </p>
                              <span className="timestamp">Yesterday</span>
                            </div>
                          </div>
                        </a>
                      </li>
                      <li className="footer">
                        <a className="more">See all notifications</a>
                      </li>
                    </ul>
                  </li>
                  <li
                    className={toggleEqualizer ? "show dropdown" : "dropdown"}
                  >
                    <a
                      href="#!"
                      className="dropdown-toggle icon-menu"
                      data-toggle="dropdown"
                      onClick={(e) => {
                        e.preventDefault();
                        this.props.onPressEqualizer();
                      }}
                    >
                      <i className="icon-equalizer"></i>
                    </a>
                    <ul
                      className={
                        toggleEqualizer
                          ? "dropdown-menu user-menu menu-icon show"
                          : "dropdown-menu user-menu menu-icon"
                      }
                    >
                      <li className="menu-heading">ACCOUNT SETTINGS</li>
                      <li>
                        <a>
                          <i className="icon-note"></i> <span>Basic</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-equalizer"></i>{" "}
                          <span>Preferences</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-lock"></i> <span>Privacy</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-bell"></i>{" "}
                          <span>Notifications</span>
                        </a>
                      </li>
                      <li className="menu-heading">BILLING</li>
                      <li>
                        <a>
                          <i className="icon-credit-card"></i>{" "}
                          <span>Payments</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-printer"></i> <span>Invoices</span>
                        </a>
                      </li>
                      <li>
                        <a>
                          <i className="icon-refresh"></i> <span>Renewals</span>
                        </a>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link to="/login" className="icon-menu">
                      <i className="icon-login"></i>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </nav>

        <div id="left-sidebar" className="sidebar" style={{ zIndex: 9 }}>
          <div className="sidebar-scroll">
            <div className="user-account">
              <img
                src={UserImage}
                className="rounded-circle user-photo"
                alt="User Profile Picture"
              />
              <Dropdown>
                <span>Welcome,</span>
                <Dropdown.Toggle
                  variant="none"
                  as="a"
                  id="dropdown-basic"
                  className="user-name"
                >
                  <strong>Alizee Thomas</strong>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu-right account">
                  <Dropdown.Item href="profilev2page">
                    <i className="icon-user"></i>My Profile
                  </Dropdown.Item>
                  <Dropdown.Item href="appinbox">
                    {" "}
                    <i className="icon-envelope-open"></i>Messages
                  </Dropdown.Item>
                  <Dropdown.Item>
                    {" "}
                    <i className="icon-settings"></i>Settings
                  </Dropdown.Item>
                  <li className="divider"></li>
                  <Dropdown.Item href="login">
                    {" "}
                    <i className="icon-power"></i>Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <hr />
              <ul className="row list-unstyled">
                <li className="col-4">
                  <small>Sales</small>
                  <h6>456</h6>
                </li>
                <li className="col-4">
                  <small>Order</small>
                  <h6>1350</h6>
                </li>
                <li className="col-4">
                  <small>Revenue</small>
                  <h6>$2.13B</h6>
                </li>
              </ul>
            </div>
            <ul className="nav nav-tabs">
              <li className="nav-item">
                <a
                  className={sideMenuTab[0] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(0);
                  }}
                >
                  Menu
                </a>
              </li>
              {/* <li className="nav-item">
                <a
                  className={sideMenuTab[1] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(1);
                  }}
                >
                  <i className="icon-book-open"></i>
                </a>
              </li> */}
              <li className="nav-item">
                <a
                  className={sideMenuTab[2] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(2);
                  }}
                >
                  <i className="icon-settings"></i>
                </a>
              </li>
              {/* <li className="nav-item">
                <a
                  className={sideMenuTab[3] ? "nav-link active" : "nav-link"}
                  data-toggle="tab"
                  onClick={() => {
                    this.props.onPressSideMenuTab(3);
                  }}
                >
                  <i className="icon-question"></i>
                </a>
              </li> */}
            </ul>
            <div className="tab-content p-l-0 p-r-0">
              <div
                className={sideMenuTab[0] ? "tab-pane active show" : "tab-pane"}
                id="menu"
              >
                <Nav id="left-sidebar-nav" className="sidebar-nav">
                  <ul id="main-menu" className="metismenu">
                    {/* Dashboard - Tổng quan */}
                    <li className="" id="dashboradContainer">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("dashboradContainer");
                        }}
                      >
                        <i className="icon-home"></i> <span>Tổng quan</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "dashboard" ? "active" : ""}
                        >
                          <Link to="dashboard">Dashboard</Link>
                        </li>
                        <li
                          className={activeKey === "reports" ? "active" : ""}
                        >
                          <Link to="reports">Báo cáo</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Khách hàng */}
                    <li id="CustomerContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("CustomerContainer");
                        }}
                      >
                        <i className="icon-users"></i> <span>Khách hàng</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "customers" ? "active" : ""}
                        >
                          <Link to="/customers">Danh sách khách hàng</Link>
                        </li>
                        <li
                          className={activeKey === "customer-create" ? "active" : ""}
                        >
                          <Link to="/customer-create">Thêm khách hàng</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Sản phẩm */}
                    <li id="ProductContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("ProductContainer");
                        }}
                      >
                        <i className="icon-layers"></i> <span>Sản phẩm</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "products" ? "active" : ""}
                        >
                          <Link to="/products">Danh sách sản phẩm</Link>
                        </li>
                        <li
                          className={activeKey === "product-create" ? "active" : ""}
                        >
                          <Link to="/product-create">Thêm sản phẩm</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Báo giá */}
                    <li id="QuotationContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("QuotationContainer");
                        }}
                      >
                        <i className="icon-calculator"></i> <span>Báo giá</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "quotations" ? "active" : ""}
                        >
                          <Link to="/quotations">Danh sách báo giá</Link>
                        </li>
                        <li
                          className={activeKey === "quotation-create" ? "active" : ""}
                        >
                          <Link to="/quotation-create">Tạo báo giá</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Đơn hàng */}
                    <li id="OrderContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("OrderContainer");
                        }}
                      >
                        <i className="icon-basket"></i> <span>Đơn hàng</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "orders" ? "active" : ""}
                        >
                          <Link to="/orders">Danh sách đơn hàng</Link>
                        </li>
                        <li
                          className={activeKey === "order-create" ? "active" : ""}
                        >
                          <Link to="/order-create">Tạo đơn hàng</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Sản xuất - Work Order */}
                    <li id="WorkOrderContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("WorkOrderContainer");
                        }}
                      >
                        <i className="icon-settings"></i> <span>Sản xuất</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "work-orders" ? "active" : ""}
                        >
                          <Link to="/work-orders">Lệnh sản xuất</Link>
                        </li>
                        <li
                          className={activeKey === "work-order-create" ? "active" : ""}
                        >
                          <Link to="/work-order-create">Tạo lệnh SX</Link>
                        </li>
                        <li
                          className={activeKey === "work-order-pending" ? "active" : ""}
                        >
                          <Link to="/work-order-pending">Chờ sản xuất</Link>
                        </li>
                        <li
                          className={activeKey === "work-order-inprogress" ? "active" : ""}
                        >
                          <Link to="/work-order-inprogress">Đang thực hiện</Link>
                        </li>
                        <li
                          className={activeKey === "work-order-completed" ? "active" : ""}
                        >
                          <Link to="/work-order-completed">Hoàn thành</Link>
                        </li>
                        <li
                          className={activeKey === "production-routing" ? "active" : ""}
                        >
                          <Link to="/production-routing">Quy trình SX</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Kiểm tra chất lượng - QC */}
                    <li id="QCContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("QCContainer");
                        }}
                      >
                        <i className="icon-check"></i> <span>Kiểm tra QC</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "qc-records" ? "active" : ""}
                        >
                          <Link to="/qc-records">Biên bản QC</Link>
                        </li>
                        <li
                          className={activeKey === "qc-create" ? "active" : ""}
                        >
                          <Link to="/qc-create">Tạo biên bản QC</Link>
                        </li>
                        <li
                          className={activeKey === "qc-pass" ? "active" : ""}
                        >
                          <Link to="/qc-pass">Đạt chất lượng</Link>
                        </li>
                        <li
                          className={activeKey === "qc-fail" ? "active" : ""}
                        >
                          <Link to="/qc-fail">Không đạt</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Kho hàng - Inventory */}
                    <li id="InventoryContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("InventoryContainer");
                        }}
                      >
                        <i className="icon-drawer"></i> <span>Kho hàng</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "inventory" ? "active" : ""}
                        >
                          <Link to="/inventory">Tồn kho</Link>
                        </li>
                        <li
                          className={activeKey === "inventory-receive" ? "active" : ""}
                        >
                          <Link to="/inventory-receive">Nhập kho</Link>
                        </li>
                        <li
                          className={activeKey === "inventory-issue" ? "active" : ""}
                        >
                          <Link to="/inventory-issue">Xuất kho</Link>
                        </li>
                        <li
                          className={activeKey === "inventory-company" ? "active" : ""}
                        >
                          <Link to="/inventory-company">Hàng công ty</Link>
                        </li>
                        <li
                          className={activeKey === "inventory-consignment" ? "active" : ""}
                        >
                          <Link to="/inventory-consignment">Hàng ký gửi</Link>
                        </li>
                        <li
                          className={activeKey === "inventory-history" ? "active" : ""}
                        >
                          <Link to="/inventory-history">Lịch sử giao dịch</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Giao hàng - Delivery */}
                    <li id="DeliveryContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("DeliveryContainer");
                        }}
                      >
                        <i className="icon-cursor"></i> <span>Giao hàng</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "deliveries" ? "active" : ""}
                        >
                          <Link to="/deliveries">Danh sách giao hàng</Link>
                        </li>
                        <li
                          className={activeKey === "delivery-create" ? "active" : ""}
                        >
                          <Link to="/delivery-create">Tạo lịch giao</Link>
                        </li>
                        <li
                          className={activeKey === "delivery-scheduled" ? "active" : ""}
                        >
                          <Link to="/delivery-scheduled">Đã lên lịch</Link>
                        </li>
                        <li
                          className={activeKey === "delivery-intransit" ? "active" : ""}
                        >
                          <Link to="/delivery-intransit">Đang vận chuyển</Link>
                        </li>
                        <li
                          className={activeKey === "delivery-completed" ? "active" : ""}
                        >
                          <Link to="/delivery-completed">Đã giao</Link>
                        </li>
                        <li
                          className={activeKey === "installations" ? "active" : ""}
                        >
                          <Link to="/installations">Lắp đặt</Link>
                        </li>
                      </ul>
                    </li>

                    {/* Cài đặt */}
                    <li id="SettingsContainer" className="">
                      <a
                        href="#!"
                        className="has-arrow"
                        onClick={(e) => {
                          e.preventDefault();
                          this.activeMenutabContainer("SettingsContainer");
                        }}
                      >
                        <i className="icon-wrench"></i> <span>Cài đặt</span>
                      </a>
                      <ul className="collapse">
                        <li
                          className={activeKey === "users" ? "active" : ""}
                        >
                          <Link to="/users">Người dùng</Link>
                        </li>
                        <li
                          className={activeKey === "roles" ? "active" : ""}
                        >
                          <Link to="/roles">Phân quyền</Link>
                        </li>
                        <li
                          className={activeKey === "settings-general" ? "active" : ""}
                        >
                          <Link to="/settings-general">Cài đặt chung</Link>
                        </li>
                        <li
                          className={activeKey === "settings-company" ? "active" : ""}
                        >
                          <Link to="/settings-company">Thông tin công ty</Link>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </Nav>
              </div>
              <div
                className={
                  sideMenuTab[1]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="Chat"
              >
                <form>
                  <div className="input-group m-b-20">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-magnifier"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                    />
                  </div>
                </form>
                <ul className="right_chat list-unstyled">
                  <li className="online">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar4} alt="" />
                        <div className="media-body">
                          <span className="name">Chris Fox</span>
                          <span className="message">Designer, Blogger</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="online">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar5} alt="" />
                        <div className="media-body">
                          <span className="name">Joge Lucky</span>
                          <span className="message">Java Developer</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="offline">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar2} alt="" />
                        <div className="media-body">
                          <span className="name">Isabella</span>
                          <span className="message">CEO, Thememakker</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="offline">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar1} alt="" />
                        <div className="media-body">
                          <span className="name">Folisise Chosielie</span>
                          <span className="message">
                            Art director, Movie Cut
                          </span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                  <li className="online">
                    <a>
                      <div className="media">
                        <img className="media-object " src={Avatar3} alt="" />
                        <div className="media-body">
                          <span className="name">Alexander</span>
                          <span className="message">Writter, Mag Editor</span>
                          <span className="badge badge-outline status"></span>
                        </div>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
              <div
                className={
                  sideMenuTab[2]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="setting"
              >
                <h6>Choose Mode</h6>
                <ul className="choose-skin list-unstyled">
                  <li
                    data-theme="white"
                    className={
                      document.body.classList.contains("full-dark")
                        ? ""
                        : "active"
                    }
                    onClick={() => {
                      this.setState({ somethi: false });
                      document.body.classList.remove("full-dark");
                    }}
                  >
                    <div className="white"></div>
                    <span>Light</span>
                  </li>
                  <li
                    data-theme="black"
                    className={
                      document.body.classList.contains("full-dark")
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      this.setState({ somethi: true });
                      document.body.classList.add("full-dark");
                    }}
                  >
                    <div className="black"></div>
                    <span>Dark</span>
                  </li>
                </ul>
                <hr />
                <h6>Choose Skin</h6>
                <ul className="choose-skin list-unstyled">
                  <li
                    data-theme="purple"
                    className={themeColor === "theme-purple" ? "active" : ""}
                  >
                    <div
                      className="purple"
                      onClick={() => {
                        if (themeColor !== "theme-purple") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("purple");
                      }}
                    ></div>
                    <span>Purple</span>
                  </li>
                  <li
                    data-theme="blue"
                    className={themeColor === "theme-blue" ? "active" : ""}
                  >
                    <div
                      className="blue"
                      onClick={() => {
                        if (themeColor !== "theme-blue") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("blue");
                      }}
                    ></div>
                    <span>Blue</span>
                  </li>
                  <li
                    data-theme="cyan"
                    className="active"
                    className={themeColor === "theme-cyan" ? "active" : ""}
                  >
                    <div
                      className="cyan"
                      onClick={() => {
                        if (themeColor !== "theme-cyan") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("cyan");
                      }}
                    ></div>
                    <span>Cyan</span>
                  </li>
                  <li
                    data-theme="green"
                    className={themeColor === "theme-green" ? "active" : ""}
                  >
                    <div
                      className="green"
                      onClick={() => {
                        if (themeColor !== "theme-green") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("green");
                      }}
                    ></div>
                    <span>Green</span>
                  </li>
                  <li
                    data-theme="orange"
                    className={themeColor === "theme-orange" ? "active" : ""}
                  >
                    <div
                      className="orange"
                      onClick={() => {
                        if (themeColor !== "theme-orange") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("orange");
                      }}
                    ></div>
                    <span>Orange</span>
                  </li>
                  <li
                    data-theme="blush"
                    className={themeColor === "theme-blush" ? "active" : ""}
                  >
                    <div
                      className="blush"
                      onClick={() => {
                        if (themeColor !== "theme-blush") {
                          document.body.classList.remove(themeColor);
                        }
                        this.props.onPressThemeColor("blush");
                      }}
                    ></div>
                    <span>Blush</span>
                  </li>
                </ul>
                <hr />
                <h6>General Settings</h6>
                <ul className="setting-list list-unstyled">
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Report Panel Usag</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Email Redirect</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Notifications</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Auto Updates</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Offline</span>
                    </label>
                  </li>
                  <li>
                    <label className="fancy-checkbox">
                      <input type="checkbox" name="checkbox" />
                      <span>Location Permission</span>
                    </label>
                  </li>
                </ul>
              </div>
              <div
                className={
                  sideMenuTab[3]
                    ? "tab-pane p-l-15 p-r-15 show active"
                    : "tab-pane p-l-15 p-r-15"
                }
                id="question"
              >
                <form>
                  <div className="input-group">
                    <div className="input-group-prepend">
                      <span className="input-group-text">
                        <i className="icon-magnifier"></i>
                      </span>
                    </div>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search..."
                    />
                  </div>
                </form>
                <ul className="list-unstyled question">
                  <li className="menu-heading">HOW-TO</li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      How to Create Campaign
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Boost Your Sales
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Website Analytics
                    </a>
                  </li>
                  <li className="menu-heading">ACCOUNT</li>
                  <li>
                    <a
                      href="registration"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Cearet New Account
                    </a>
                  </li>
                  <li>
                    <a
                      href="forgotpassword"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Change Password?
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Privacy &amp; Policy
                    </a>
                  </li>
                  <li className="menu-heading">BILLING</li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Payment info
                    </a>
                  </li>
                  <li>
                    <a
                      href="#!"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      Auto-Renewal
                    </a>
                  </li>
                  <li className="menu-button m-t-30">
                    <a
                      href="#!"
                      className="btn btn-primary"
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                    >
                      <i className="icon-question"></i> Need Help?
                    </a>
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

NavbarMenu.propTypes = {
  addClassactive: PropTypes.array.isRequired,
  addClassactiveChild: PropTypes.array.isRequired,
  addClassactiveChildApp: PropTypes.array.isRequired,
  addClassactiveChildFM: PropTypes.array.isRequired,
  addClassactiveChildBlog: PropTypes.array.isRequired,
  addClassactiveChildUI: PropTypes.array.isRequired,
  addClassactiveChildWidgets: PropTypes.array.isRequired,
  addClassactiveChildAuth: PropTypes.array.isRequired,
  addClassactiveChildPages: PropTypes.array.isRequired,
  addClassactiveChildForms: PropTypes.array.isRequired,
  addClassactiveChildTables: PropTypes.array.isRequired,
  addClassactiveChildChart: PropTypes.array.isRequired,
  addClassactiveChildMaps: PropTypes.array.isRequired,
  themeColor: PropTypes.string.isRequired,
  generalSetting: PropTypes.array.isRequired,
  toggleNotification: PropTypes.bool.isRequired,
  toggleEqualizer: PropTypes.bool.isRequired,
};

const mapStateToProps = ({ navigationReducer }) => {
  const {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
  } = navigationReducer;
  return {
    addClassactive,
    addClassactiveChild,
    addClassactiveChildApp,
    addClassactiveChildFM,
    addClassactiveChildBlog,
    addClassactiveChildUI,
    addClassactiveChildWidgets,
    addClassactiveChildAuth,
    addClassactiveChildPages,
    addClassactiveChildForms,
    addClassactiveChildTables,
    addClassactiveChildChart,
    addClassactiveChildMaps,
    themeColor,
    generalSetting,
    toggleNotification,
    toggleEqualizer,
    menuProfileDropdown,
    sideMenuTab,
    isToastMessage,
  };
};

export default connect(mapStateToProps, {
  onPressDashbord,
  onPressDashbordChild,
  onPressThemeColor,
  onPressGeneralSetting,
  onPressNotification,
  onPressEqualizer,
  onPressSideMenuToggle,
  onPressMenuProfileDropdown,
  onPressSideMenuTab,
  tostMessageLoad,
})(NavbarMenu);
