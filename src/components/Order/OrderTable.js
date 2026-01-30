/**
 * Order Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const OrderTable = ({ orders, loading, pagination, onPageChange, onStatusChange }) => {
  const getStatusBadge = (status) => {
    const statuses = {
      PENDING: { label: "Chờ xác nhận", class: "badge-warning" },
      CONFIRMED: { label: "Đã xác nhận", class: "badge-info" },
      IN_PRODUCTION: { label: "Đang sản xuất", class: "badge-primary" },
      READY_FOR_DELIVERY: { label: "Sẵn sàng giao", class: "badge-success" },
      PARTIALLY_DELIVERED: { label: "Giao một phần", class: "badge-info" },
      DELIVERED: { label: "Đã giao", class: "badge-success" },
      COMPLETED: { label: "Hoàn thành", class: "badge-success" },
      CANCELLED: { label: "Đã hủy", class: "badge-danger" },
    };
    const statusInfo = statuses[status] || { label: status, class: "badge-secondary" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
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

  if (orders.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-shopping-cart fa-3x mb-3"></i>
        <p>Không có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Ngày tạo</th>
              <th className="text-right">Tổng tiền</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/order-detail/${order.id}`} className="text-primary font-weight-bold">
                    {order.code}
                  </Link>
                </td>
                <td>
                  <Link to={`/customer-detail/${order.customer?.id}`}>
                    {order.customer?.name}
                  </Link>
                  <small className="d-block text-muted">{order.customer?.phone}</small>
                </td>
                <td>{formatDate(order.createdAt)}</td>
                <td className="text-right font-weight-bold">
                  {formatCurrency(order.totalAmount)}
                </td>
                <td>{getStatusBadge(order.status)}</td>
                <td className="text-center">
                  <Link
                    to={`/order-detail/${order.id}`}
                    className="btn btn-sm btn-outline-info mr-1"
                    title="Xem chi tiết"
                  >
                    <i className="fa fa-eye"></i>
                  </Link>
                  {order.status === "PENDING" && (
                    <>
                      <Link
                        to={`/order-edit/${order.id}`}
                        className="btn btn-sm btn-outline-primary mr-1"
                        title="Sửa"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-success mr-1"
                        title="Xác nhận"
                        onClick={() => onStatusChange(order.id, "CONFIRMED")}
                      >
                        <i className="fa fa-check"></i>
                      </button>
                    </>
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
        </nav>
      )}
    </>
  );
};

export default OrderTable;
