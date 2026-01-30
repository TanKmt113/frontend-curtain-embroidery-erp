/**
 * Inventory Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const InventoryTable = ({ items, loading, pagination, onPageChange }) => {
  const getStockStatus = (item) => {
    const percentage = item.minStock
      ? (item.quantity / item.minStock) * 100
      : 100;

    if (percentage <= 25) {
      return { label: "Cần nhập gấp", class: "badge-danger" };
    } else if (percentage <= 50) {
      return { label: "Sắp hết", class: "badge-warning" };
    } else {
      return { label: "Đủ hàng", class: "badge-success" };
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border text-primary" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-cubes fa-3x mb-3"></i>
        <p>Không có sản phẩm trong kho</p>
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
              <th className="text-center">Tồn kho</th>
              <th className="text-center">Tối thiểu</th>
              <th>Vị trí</th>
              <th className="text-right">Giá trị</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const status = getStockStatus(item);
              return (
                <tr key={item.id}>
                  <td>
                    <span className="font-weight-bold">{item.product?.code}</span>
                  </td>
                  <td>
                    <Link to={`/product-edit/${item.product?.id}`}>
                      {item.product?.name}
                    </Link>
                  </td>
                  <td>
                    <small className="text-muted">{item.product?.type}</small>
                  </td>
                  <td className="text-center">
                    <span
                      className={`font-weight-bold ${
                        item.quantity <= item.minStock ? "text-danger" : ""
                      }`}
                    >
                      {item.quantity}
                    </span>
                    <small className="text-muted ml-1">{item.product?.unit}</small>
                  </td>
                  <td className="text-center text-muted">{item.minStock || "-"}</td>
                  <td>
                    <small>{item.location || "-"}</small>
                  </td>
                  <td className="text-right">
                    {formatCurrency(item.quantity * (item.avgCost || 0))}
                  </td>
                  <td>
                    <span className={`badge ${status.class}`}>{status.label}</span>
                  </td>
                </tr>
              );
            })}
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
        </nav>
      )}
    </>
  );
};

export default InventoryTable;
