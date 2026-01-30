/**
 * General Settings Screen
 * Cài đặt chung của hệ thống
 */

import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";

class GeneralSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      settings: {
        // Cài đặt đơn vị tiền tệ
        currency: "VND",
        currencySymbol: "₫",
        currencyPosition: "after", // before | after
        
        // Cài đặt số
        decimalSeparator: ",",
        thousandSeparator: ".",
        decimalPlaces: 0,
        
        // Cài đặt ngày giờ
        dateFormat: "DD/MM/YYYY",
        timeFormat: "HH:mm",
        timezone: "Asia/Ho_Chi_Minh",
        
        // Cài đặt phân trang
        defaultPageSize: 20,
        
        // Cài đặt email
        emailNotification: true,
        
        // Cài đặt backup
        autoBackup: false,
        backupFrequency: "daily", // daily | weekly | monthly
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // TODO: Load settings from API
  }

  handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState({
      settings: {
        ...this.state.settings,
        [name]: type === "checkbox" ? checked : value,
      },
    });
  };

  handleSave = async () => {
    this.setState({ loading: true });
    try {
      // TODO: Save settings to API
      alert("Lưu cài đặt thành công!");
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, settings } = this.state;

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
              HeaderText="Cài đặt chung"
              Breadcrumb={[
                { name: "Cài đặt", navigate: "" },
                { name: "Cài đặt chung", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {/* Currency Settings */}
              <div className="col-lg-6 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-money mr-2"></i>
                      Cài đặt tiền tệ
                    </h2>
                  </div>
                  <div className="body">
                    <div className="form-group">
                      <label>Đơn vị tiền tệ</label>
                      <select
                        className="form-control"
                        name="currency"
                        value={settings.currency}
                        onChange={this.handleChange}
                      >
                        <option value="VND">VND - Việt Nam Đồng</option>
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Ký hiệu tiền tệ</label>
                      <input
                        type="text"
                        className="form-control"
                        name="currencySymbol"
                        value={settings.currencySymbol}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Vị trí ký hiệu</label>
                      <select
                        className="form-control"
                        name="currencyPosition"
                        value={settings.currencyPosition}
                        onChange={this.handleChange}
                      >
                        <option value="before">Trước số (₫100.000)</option>
                        <option value="after">Sau số (100.000₫)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Number Format Settings */}
              <div className="col-lg-6 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-sort-numeric-asc mr-2"></i>
                      Định dạng số
                    </h2>
                  </div>
                  <div className="body">
                    <div className="form-group">
                      <label>Dấu phân cách thập phân</label>
                      <select
                        className="form-control"
                        name="decimalSeparator"
                        value={settings.decimalSeparator}
                        onChange={this.handleChange}
                      >
                        <option value=",">Dấu phẩy (,)</option>
                        <option value=".">Dấu chấm (.)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Dấu phân cách hàng nghìn</label>
                      <select
                        className="form-control"
                        name="thousandSeparator"
                        value={settings.thousandSeparator}
                        onChange={this.handleChange}
                      >
                        <option value=".">Dấu chấm (.)</option>
                        <option value=",">Dấu phẩy (,)</option>
                        <option value=" ">Khoảng trắng</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Số chữ số thập phân</label>
                      <select
                        className="form-control"
                        name="decimalPlaces"
                        value={settings.decimalPlaces}
                        onChange={this.handleChange}
                      >
                        <option value="0">0</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Date Time Settings */}
              <div className="col-lg-6 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-calendar mr-2"></i>
                      Cài đặt ngày giờ
                    </h2>
                  </div>
                  <div className="body">
                    <div className="form-group">
                      <label>Định dạng ngày</label>
                      <select
                        className="form-control"
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={this.handleChange}
                      >
                        <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2026)</option>
                        <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2026)</option>
                        <option value="YYYY-MM-DD">YYYY-MM-DD (2026-12-31)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Định dạng giờ</label>
                      <select
                        className="form-control"
                        name="timeFormat"
                        value={settings.timeFormat}
                        onChange={this.handleChange}
                      >
                        <option value="HH:mm">24 giờ (14:30)</option>
                        <option value="hh:mm A">12 giờ (02:30 PM)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Múi giờ</label>
                      <select
                        className="form-control"
                        name="timezone"
                        value={settings.timezone}
                        onChange={this.handleChange}
                      >
                        <option value="Asia/Ho_Chi_Minh">
                          (GMT+7) Hồ Chí Minh
                        </option>
                        <option value="Asia/Bangkok">(GMT+7) Bangkok</option>
                        <option value="Asia/Singapore">(GMT+8) Singapore</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="col-lg-6 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-cogs mr-2"></i>
                      Cài đặt hệ thống
                    </h2>
                  </div>
                  <div className="body">
                    <div className="form-group">
                      <label>Số dòng mặc định mỗi trang</label>
                      <select
                        className="form-control"
                        name="defaultPageSize"
                        value={settings.defaultPageSize}
                        onChange={this.handleChange}
                      >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="fancy-checkbox">
                        <input
                          type="checkbox"
                          name="emailNotification"
                          checked={settings.emailNotification}
                          onChange={this.handleChange}
                        />
                        <span>Bật thông báo email</span>
                      </label>
                    </div>
                    <div className="form-group">
                      <label className="fancy-checkbox">
                        <input
                          type="checkbox"
                          name="autoBackup"
                          checked={settings.autoBackup}
                          onChange={this.handleChange}
                        />
                        <span>Tự động sao lưu dữ liệu</span>
                      </label>
                    </div>
                    {settings.autoBackup && (
                      <div className="form-group">
                        <label>Tần suất sao lưu</label>
                        <select
                          className="form-control"
                          name="backupFrequency"
                          value={settings.backupFrequency}
                          onChange={this.handleChange}
                        >
                          <option value="daily">Hàng ngày</option>
                          <option value="weekly">Hàng tuần</option>
                          <option value="monthly">Hàng tháng</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="row">
              <div className="col-12">
                <div className="card">
                  <div className="body text-right">
                    <button
                      className="btn btn-primary"
                      onClick={this.handleSave}
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm mr-2"></span>
                          Đang lưu...
                        </>
                      ) : (
                        <>
                          <i className="fa fa-save mr-2"></i>
                          Lưu cài đặt
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ navigationReducer }) => {
  return { navigationReducer };
};

export default connect(mapStateToProps)(GeneralSettings);
