/**
 * Customer Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const CustomerTable = ({ customers, loading, pagination, onPageChange, onDelete }) => {
  const getTypeBadge = (type) => {
    const types = {
      INDIVIDUAL: { label: "Cá nhân", class: "badge-info" },
      COMPANY: { label: "Công ty", class: "badge-primary" },
      CONSIGNMENT: { label: "Ký gửi", class: "badge-warning" },
    };
    const typeInfo = types[type] || { label: type, class: "badge-secondary" };
    return <span className={`badge ${typeInfo.class}`}>{typeInfo.label}</span>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN");
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

  if (customers.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-users fa-3x mb-3"></i>
        <p>Không có khách hàng nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã KH</th>
              <th>Tên khách hàng</th>
              <th>Loại</th>
              <th>Điện thoại</th>
              <th>Email</th>
              <th>Ngày tạo</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id}>
                <td>
                  <Link to={`/customer-detail/${customer.id}`} className="text-primary">
                    {customer.code}
                  </Link>
                </td>
                <td>
                  <strong>{customer.name}</strong>
                </td>
                <td>{getTypeBadge(customer.type)}</td>
                <td>{customer.phone || "-"}</td>
                <td>{customer.email || "-"}</td>
                <td>{formatDate(customer.createdAt)}</td>
                <td className="text-center">
                  <Link
                    to={`/customer-detail/${customer.id}`}
                    className="btn btn-sm btn-outline-info mr-1"
                    title="Xem chi tiết"
                  >
                    <i className="fa fa-eye"></i>
                  </Link>
                  <Link
                    to={`/customer-edit/${customer.id}`}
                    className="btn btn-sm btn-outline-primary mr-1"
                    title="Sửa"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    title="Xóa"
                    onClick={() => onDelete(customer.id)}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
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
            Hiển thị {customers.length} / {pagination.total} khách hàng
          </p>
        </nav>
      )}
    </>
  );
};

export default CustomerTable;
