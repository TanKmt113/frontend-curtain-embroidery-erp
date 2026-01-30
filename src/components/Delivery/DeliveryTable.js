/**
 * Delivery Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const DeliveryTable = ({
  deliveries,
  loading,
  pagination,
  onPageChange,
  onStatusChange,
}) => {
  const getStatusBadge = (status) => {
    const statuses = {
      PENDING: { label: "Chờ giao", class: "badge-warning" },
      IN_PROGRESS: { label: "Đang giao", class: "badge-primary" },
      DELIVERED: { label: "Đã giao", class: "badge-success" },
      CANCELLED: { label: "Đã hủy", class: "badge-danger" },
    };
    const statusInfo = statuses[status] || { label: status, class: "badge-secondary" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const formatTime = (time) => {
    if (!time) return "";
    return time.substring(0, 5);
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

  if (deliveries.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-truck fa-3x mb-3"></i>
        <p>Không có phiếu giao hàng nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã phiếu</th>
              <th>Đơn hàng</th>
              <th>Khách hàng</th>
              <th>Ngày giao</th>
              <th>Địa chỉ</th>
              <th>Tài xế</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td>
                  <span className="font-weight-bold">{delivery.code}</span>
                </td>
                <td>
                  <Link to={`/order-detail/${delivery.order?.id}`}>
                    {delivery.order?.code}
                  </Link>
                </td>
                <td>
                  {delivery.order?.customer?.name}
                  <small className="d-block text-muted">
                    {delivery.order?.customer?.phone}
                  </small>
                </td>
                <td>
                  {formatDate(delivery.scheduledDate)}
                  {delivery.scheduledTime && (
                    <small className="d-block text-muted">
                      {formatTime(delivery.scheduledTime)}
                    </small>
                  )}
                </td>
                <td>
                  <small
                    style={{
                      maxWidth: "200px",
                      display: "block",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={delivery.deliveryAddress}
                  >
                    {delivery.deliveryAddress}
                  </small>
                </td>
                <td>
                  {delivery.driverName || "-"}
                  {delivery.driverPhone && (
                    <small className="d-block text-muted">{delivery.driverPhone}</small>
                  )}
                </td>
                <td>{getStatusBadge(delivery.status)}</td>
                <td className="text-center">
                  {delivery.status === "PENDING" && (
                    <>
                      <Link
                        to={`/delivery-edit/${delivery.id}`}
                        className="btn btn-sm btn-outline-primary mr-1"
                        title="Sửa"
                      >
                        <i className="fa fa-edit"></i>
                      </Link>
                      <button
                        className="btn btn-sm btn-outline-success mr-1"
                        title="Bắt đầu giao"
                        onClick={() => onStatusChange(delivery.id, "IN_PROGRESS")}
                      >
                        <i className="fa fa-truck"></i>
                      </button>
                    </>
                  )}
                  {delivery.status === "IN_PROGRESS" && (
                    <button
                      className="btn btn-sm btn-outline-success mr-1"
                      title="Xác nhận đã giao"
                      onClick={() => onStatusChange(delivery.id, "DELIVERED")}
                    >
                      <i className="fa fa-check"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-info"
                    title="In phiếu"
                    onClick={() => window.print()}
                  >
                    <i className="fa fa-print"></i>
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
                <button className="page-link" onClick={() => onPageChange(index + 1)}>
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

export default DeliveryTable;
