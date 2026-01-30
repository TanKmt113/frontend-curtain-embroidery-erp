/**
 * Product Detail Screen
 * Chi tiết sản phẩm
 */

import React from "react";
import { connect } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { productService } from "../../api";

// Product types
const PRODUCT_TYPES = {
  CURTAIN_FABRIC: { label: "Vải rèm", color: "badge-primary" },
  CURTAIN_ACCESSORY: { label: "Phụ kiện rèm", color: "badge-info" },
  EMBROIDERY_SERVICE: { label: "Dịch vụ thêu", color: "badge-warning" },
  CUSHION: { label: "Đệm/Gối", color: "badge-success" },
  OTHER: { label: "Khác", color: "badge-secondary" },
};

// Product status
const PRODUCT_STATUS = {
  ACTIVE: { label: "Đang kinh doanh", color: "badge-success" },
  INACTIVE: { label: "Ngừng kinh doanh", color: "badge-danger" },
  OUT_OF_STOCK: { label: "Hết hàng", color: "badge-warning" },
};

class ProductDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const { id } = this.props.match.params;
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct = async (id) => {
    this.setState({ loading: true, error: null });
    try {
      const response = await productService.getById(id);
      this.setState({
        product: response.data || response,
        loading: false,
      });
    } catch (error) {
      this.setState({
        error: error.message || "Không thể tải thông tin sản phẩm",
        loading: false,
      });
    }
  };

  formatCurrency = (value) => {
    if (!value) return "0₫";
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  getTypeBadge = (type) => {
    const config = PRODUCT_TYPES[type] || { label: type, color: "badge-secondary" };
    return <span className={`badge ${config.color}`}>{config.label}</span>;
  };

  getStatusBadge = (status) => {
    const config = PRODUCT_STATUS[status] || { label: status, color: "badge-secondary" };
    return <span className={`badge ${config.color}`}>{config.label}</span>;
  };

  handleDelete = async () => {
    const { product } = this.state;
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${product.name}"?`)) {
      return;
    }

    try {
      await productService.delete(product.id);
      alert("Xóa sản phẩm thành công");
      this.props.history.push("/products");
    } catch (error) {
      alert(error.message || "Không thể xóa sản phẩm");
    }
  };

  render() {
    const { product, loading, error } = this.state;

    if (loading) {
      return (
        <div
          style={{ flex: 1 }}
          onClick={() => {
            document.body.classList.remove("offcanvas-active");
          }}
        >
          <div className="container-fluid">
            <PageHeader
              HeaderText="Chi tiết sản phẩm"
              Breadcrumb={[
                { name: "Sản phẩm", navigate: "/products" },
                { name: "Chi tiết", navigate: "" },
              ]}
            />
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="sr-only">Đang tải...</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div
          style={{ flex: 1 }}
          onClick={() => {
            document.body.classList.remove("offcanvas-active");
          }}
        >
          <div className="container-fluid">
            <PageHeader
              HeaderText="Chi tiết sản phẩm"
              Breadcrumb={[
                { name: "Sản phẩm", navigate: "/products" },
                { name: "Chi tiết", navigate: "" },
              ]}
            />
            <div className="alert alert-danger">
              <i className="fa fa-exclamation-triangle mr-2"></i>
              {error}
            </div>
            <Link to="/products" className="btn btn-secondary">
              <i className="fa fa-arrow-left mr-2"></i>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      );
    }

    if (!product) {
      return (
        <div
          style={{ flex: 1 }}
          onClick={() => {
            document.body.classList.remove("offcanvas-active");
          }}
        >
          <div className="container-fluid">
            <PageHeader
              HeaderText="Chi tiết sản phẩm"
              Breadcrumb={[
                { name: "Sản phẩm", navigate: "/products" },
                { name: "Chi tiết", navigate: "" },
              ]}
            />
            <div className="alert alert-warning">
              <i className="fa fa-warning mr-2"></i>
              Không tìm thấy sản phẩm
            </div>
            <Link to="/products" className="btn btn-secondary">
              <i className="fa fa-arrow-left mr-2"></i>
              Quay lại danh sách
            </Link>
          </div>
        </div>
      );
    }

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
              HeaderText="Chi tiết sản phẩm"
              Breadcrumb={[
                { name: "Sản phẩm", navigate: "/products" },
                { name: product.name, navigate: "" },
              ]}
            />

            <div className="row clearfix">
              {/* Product Info Card */}
              <div className="col-lg-8 col-md-12">
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-cube mr-2"></i>
                      Thông tin sản phẩm
                    </h2>
                    <div className="float-right">
                      <Link
                        to={`/product-edit/${product.id}`}
                        className="btn btn-primary btn-sm mr-2"
                      >
                        <i className="fa fa-pencil mr-1"></i>
                        Sửa
                      </Link>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={this.handleDelete}
                      >
                        <i className="fa fa-trash mr-1"></i>
                        Xóa
                      </button>
                    </div>
                  </div>
                  <div className="body">
                    <div className="row">
                      <div className="col-md-6">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td className="text-muted" style={{ width: 150 }}>
                                Mã sản phẩm:
                              </td>
                              <td>
                                <strong className="text-primary">
                                  {product.code || "-"}
                                </strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Tên sản phẩm:</td>
                              <td>
                                <strong>{product.name}</strong>
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Loại sản phẩm:</td>
                              <td>{this.getTypeBadge(product.type)}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Đơn vị tính:</td>
                              <td>{product.unit || "-"}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div className="col-md-6">
                        <table className="table table-borderless">
                          <tbody>
                            <tr>
                              <td className="text-muted" style={{ width: 150 }}>
                                Giá cơ bản:
                              </td>
                              <td>
                                <strong className="text-success">
                                  {this.formatCurrency(product.basePrice)}
                                </strong>
                                {product.unit && (
                                  <small className="text-muted">
                                    /{product.unit}
                                  </small>
                                )}
                              </td>
                            </tr>
                            <tr>
                              <td className="text-muted">Trạng thái:</td>
                              <td>{this.getStatusBadge(product.status)}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Ngày tạo:</td>
                              <td>{this.formatDate(product.createdAt)}</td>
                            </tr>
                            <tr>
                              <td className="text-muted">Cập nhật:</td>
                              <td>{this.formatDate(product.updatedAt)}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Description */}
                    {product.description && (
                      <div className="mt-4">
                        <h6 className="text-muted mb-2">
                          <i className="fa fa-file-text-o mr-2"></i>
                          Mô tả
                        </h6>
                        <div
                          className="p-3"
                          style={{ background: "#f8f9fa", borderRadius: 8 }}
                        >
                          {product.description}
                        </div>
                      </div>
                    )}

                    {/* Specifications */}
                    {product.specifications && (
                      <div className="mt-4">
                        <h6 className="text-muted mb-2">
                          <i className="fa fa-list-alt mr-2"></i>
                          Thông số kỹ thuật
                        </h6>
                        <div
                          className="p-3"
                          style={{ background: "#f8f9fa", borderRadius: 8 }}
                        >
                          <pre
                            style={{
                              margin: 0,
                              whiteSpace: "pre-wrap",
                              fontFamily: "inherit",
                            }}
                          >
                            {product.specifications}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="col-lg-4 col-md-12">
                {/* Quick Stats */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-bar-chart mr-2"></i>
                      Thống kê
                    </h2>
                  </div>
                  <div className="body">
                    <div className="row text-center">
                      <div className="col-6 mb-3">
                        <div
                          className="p-3"
                          style={{ background: "#e3f2fd", borderRadius: 8 }}
                        >
                          <h3 className="mb-0 text-primary">0</h3>
                          <small className="text-muted">Đơn hàng</small>
                        </div>
                      </div>
                      <div className="col-6 mb-3">
                        <div
                          className="p-3"
                          style={{ background: "#e8f5e9", borderRadius: 8 }}
                        >
                          <h3 className="mb-0 text-success">0</h3>
                          <small className="text-muted">Báo giá</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className="p-3"
                          style={{ background: "#fff3e0", borderRadius: 8 }}
                        >
                          <h3 className="mb-0 text-warning">0</h3>
                          <small className="text-muted">Tồn kho</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div
                          className="p-3"
                          style={{ background: "#fce4ec", borderRadius: 8 }}
                        >
                          <h3 className="mb-0 text-danger">0₫</h3>
                          <small className="text-muted">Doanh thu</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Image */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-image mr-2"></i>
                      Hình ảnh
                    </h2>
                  </div>
                  <div className="body text-center">
                    {product.image ? (
                      <img
                        src={`${imageBaseUrl}${product.image}`}
                        alt={product.name}
                        style={{
                          maxWidth: "100%",
                          maxHeight: 200,
                          objectFit: "contain",
                          borderRadius: 8,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: 150,
                          background: "#f5f5f5",
                          borderRadius: 8,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <div className="text-muted">
                          <i className="fa fa-image fa-3x mb-2"></i>
                          <br />
                          <small>Chưa có hình ảnh</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="card">
                  <div className="header">
                    <h2>
                      <i className="fa fa-bolt mr-2"></i>
                      Thao tác nhanh
                    </h2>
                  </div>
                  <div className="body">
                    <Link
                      to={`/quotation-create?productId=${product.id}`}
                      className="btn btn-outline-primary btn-block mb-2"
                    >
                      <i className="fa fa-calculator mr-2"></i>
                      Tạo báo giá
                    </Link>
                    <Link
                      to={`/order-create?productId=${product.id}`}
                      className="btn btn-outline-success btn-block mb-2"
                    >
                      <i className="fa fa-shopping-cart mr-2"></i>
                      Tạo đơn hàng
                    </Link>
                    <Link
                      to={`/inventory?productId=${product.id}`}
                      className="btn btn-outline-info btn-block"
                    >
                      <i className="fa fa-archive mr-2"></i>
                      Xem tồn kho
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Back Button */}
            <div className="row">
              <div className="col-12">
                <Link to="/products" className="btn btn-secondary">
                  <i className="fa fa-arrow-left mr-2"></i>
                  Quay lại danh sách
                </Link>
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

export default withRouter(connect(mapStateToProps)(ProductDetail));

// Update the image rendering logic to handle the image path returned by the API
const imageBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";
