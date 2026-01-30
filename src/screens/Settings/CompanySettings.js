/**
 * Company Settings Screen
 * Thông tin công ty
 */

import React from "react";
import { connect } from "react-redux";
import PageHeader from "../../components/PageHeader";

class CompanySettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      company: {
        // Thông tin cơ bản
        name: "Công ty TNHH Rèm & Thêu ABC",
        shortName: "ABC",
        taxCode: "0123456789",
        businessType: "Sản xuất & Kinh doanh rèm cửa, dịch vụ thêu",
        
        // Thông tin liên hệ
        phone: "028 1234 5678",
        fax: "028 1234 5679",
        email: "info@abc-curtain.com",
        website: "www.abc-curtain.com",
        
        // Địa chỉ
        address: "123 Đường ABC, Phường XYZ",
        ward: "Phường XYZ",
        district: "Quận 1",
        city: "TP. Hồ Chí Minh",
        country: "Việt Nam",
        
        // Thông tin ngân hàng
        bankName: "Ngân hàng TMCP Ngoại Thương Việt Nam",
        bankBranch: "Chi nhánh TP.HCM",
        bankAccount: "0071001234567",
        bankAccountName: "CONG TY TNHH REM & THEU ABC",
        
        // Người đại diện
        representativeName: "Nguyễn Văn A",
        representativeTitle: "Giám đốc",
        representativePhone: "0901234567",
        representativeEmail: "director@abc-curtain.com",
        
        // Logo
        logo: null,
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    // TODO: Load company info from API
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      company: {
        ...this.state.company,
        [name]: value,
      },
    });
  };

  handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.setState({
          company: {
            ...this.state.company,
            logo: reader.result,
          },
        });
      };
      reader.readAsDataURL(file);
    }
  };

  handleSave = async () => {
    this.setState({ loading: true });
    try {
      // TODO: Save company info to API
      alert("Lưu thông tin công ty thành công!");
    } catch (error) {
      alert(error.message || "Có lỗi xảy ra");
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, company } = this.state;

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
              HeaderText="Thông tin công ty"
              Breadcrumb={[
                { name: "Cài đặt", navigate: "" },
                { name: "Thông tin công ty", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {/* Logo & Basic Info */}
              <div className="col-lg-4 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-image mr-2"></i>
                      Logo công ty
                    </h2>
                  </div>
                  <div className="body text-center">
                    <div
                      className="mb-3"
                      style={{
                        width: 150,
                        height: 150,
                        margin: "0 auto",
                        border: "2px dashed #ddd",
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        background: "#f9f9f9",
                      }}
                    >
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt="Logo"
                          style={{
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        <div className="text-muted">
                          <i className="fa fa-building fa-3x mb-2"></i>
                          <br />
                          <small>Chưa có logo</small>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      id="logo-input"
                      accept="image/*"
                      onChange={this.handleLogoChange}
                      style={{ display: "none" }}
                    />
                    <button
                      className="btn btn-outline-primary btn-sm"
                      onClick={() => document.getElementById("logo-input").click()}
                    >
                      <i className="fa fa-upload mr-1"></i>
                      Tải logo lên
                    </button>
                  </div>
                </div>

                {/* Bank Info */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-bank mr-2"></i>
                      Thông tin ngân hàng
                    </h2>
                  </div>
                  <div className="body">
                    <div className="form-group">
                      <label>Tên ngân hàng</label>
                      <input
                        type="text"
                        className="form-control"
                        name="bankName"
                        value={company.bankName}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Chi nhánh</label>
                      <input
                        type="text"
                        className="form-control"
                        name="bankBranch"
                        value={company.bankBranch}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Số tài khoản</label>
                      <input
                        type="text"
                        className="form-control"
                        name="bankAccount"
                        value={company.bankAccount}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tên chủ tài khoản</label>
                      <input
                        type="text"
                        className="form-control"
                        name="bankAccountName"
                        value={company.bankAccountName}
                        onChange={this.handleChange}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              <div className="col-lg-8 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-building mr-2"></i>
                      Thông tin doanh nghiệp
                    </h2>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-md-8">
                        <div className="form-group">
                          <label>
                            Tên công ty <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="name"
                            value={company.name}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Tên viết tắt</label>
                          <input
                            type="text"
                            className="form-control"
                            name="shortName"
                            value={company.shortName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>
                            Mã số thuế <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            name="taxCode"
                            value={company.taxCode}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Lĩnh vực kinh doanh</label>
                          <input
                            type="text"
                            className="form-control"
                            name="businessType"
                            value={company.businessType}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-phone mr-2"></i>
                      Thông tin liên hệ
                    </h2>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Điện thoại</label>
                          <input
                            type="text"
                            className="form-control"
                            name="phone"
                            value={company.phone}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Fax</label>
                          <input
                            type="text"
                            className="form-control"
                            name="fax"
                            value={company.fax}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="email"
                            value={company.email}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Website</label>
                          <input
                            type="text"
                            className="form-control"
                            name="website"
                            value={company.website}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-map-marker mr-2"></i>
                      Địa chỉ
                    </h2>
                  </div>
                  <div className="body">
                    <div className="form-group">
                      <label>Địa chỉ</label>
                      <input
                        type="text"
                        className="form-control"
                        name="address"
                        value={company.address}
                        onChange={this.handleChange}
                      />
                    </div>
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Phường/Xã</label>
                          <input
                            type="text"
                            className="form-control"
                            name="ward"
                            value={company.ward}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Quận/Huyện</label>
                          <input
                            type="text"
                            className="form-control"
                            name="district"
                            value={company.district}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="form-group">
                          <label>Tỉnh/Thành phố</label>
                          <input
                            type="text"
                            className="form-control"
                            name="city"
                            value={company.city}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Representative */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-user-circle mr-2"></i>
                      Người đại diện pháp luật
                    </h2>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Họ và tên</label>
                          <input
                            type="text"
                            className="form-control"
                            name="representativeName"
                            value={company.representativeName}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Chức vụ</label>
                          <input
                            type="text"
                            className="form-control"
                            name="representativeTitle"
                            value={company.representativeTitle}
                            onChange={this.handleChange}
                          />
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
                            name="representativePhone"
                            value={company.representativePhone}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            className="form-control"
                            name="representativeEmail"
                            value={company.representativeEmail}
                            onChange={this.handleChange}
                          />
                        </div>
                      </div>
                    </div>
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
                          Lưu thông tin
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

export default connect(mapStateToProps)(CompanySettings);
