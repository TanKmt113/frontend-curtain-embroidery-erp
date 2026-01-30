/**
 * Product Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const ProductTable = ({ products, loading, pagination, onPageChange, onDelete }) => {
  const getTypeBadge = (type) => {
    const types = {
      CURTAIN_FABRIC: { label: "Rèm vải", class: "badge-primary" },
      CURTAIN_ROMAN: { label: "Rèm roman", class: "badge-info" },
      CURTAIN_ROLLER: { label: "Rèm cuốn", class: "badge-success" },
      CURTAIN_VERTICAL: { label: "Rèm lá dọc", class: "badge-warning" },
      CUSHION: { label: "Đệm/Gối", class: "badge-secondary" },
      EMBROIDERY: { label: "Dịch vụ thêu", class: "badge-danger" },
      ACCESSORY: { label: "Phụ kiện", class: "badge-dark" },
    };
    const typeInfo = types[type] || { label: type, class: "badge-secondary" };
    return <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>;
  };

  const getStatusBadge = (status) => {
    return status === "ACTIVE" ? (
      <span className="badge badge-success">Đang KD</span>
    ) : (
      <span className="badge badge-secondary">Ngừng KD</span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const imageBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:3000";

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-cube fa-3x mb-3"></i>
        <p>Không có sản phẩm nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã SP</th>
              <th>Tên sản phẩm</th>
              <th>Loại</th>
              <th>Đơn vị</th>
              <th className="text-right">Giá</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <Link to={`/product-detail/${product.id}`} className="text-primary">
                    {product.code}
                  </Link>
                </td>
                <td>
                  <strong>{product.name}</strong>
                </td>
                <td>{getTypeBadge(product.type)}</td>
                <td>{product.unit}</td>
                <td className="text-right">{formatCurrency(product.basePrice)}</td>
                <td>{getStatusBadge(product.status)}</td>
                <td className="text-center">
                  <Link
                    to={`/product-edit/${product.id}`}
                    className="btn btn-sm btn-outline-primary mr-1"
                    title="Sửa"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    title="Xóa"
                    onClick={() => onDelete(product.id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                </td>
                <td>
                  {product.image ? (
                    <img
                      src={`${imageBaseUrl}${product.image}`}
                      alt={product.name}
                      style={{ width: 50, height: 50, objectFit: "cover", borderRadius: 4 }}
                    />
                  ) : (
                    <i className="fa fa-image text-muted"></i>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <i className="fa fa-chevron-left"></i>
              </button>
            </li>
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li
                key={index + 1}
                className={`page-item ${pagination.page === index + 1 ? "active" : ""}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li
              className={`page-item ${
                pagination.page === pagination.totalPages ? "disabled" : ""
              }`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                <i className="fa fa-chevron-right"></i>
              </button>
            </li>
          </ul>
          <p className="text-center text-muted">
            Hiển thị {products.length} / {pagination.total} sản phẩm
          </p>
        </nav>
      )}
    </>
  );
};

export default ProductTable;
