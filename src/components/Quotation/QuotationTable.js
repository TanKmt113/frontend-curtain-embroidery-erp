/**
 * Quotation Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const QuotationTable = ({
  quotations,
  loading,
  pagination,
  onPageChange,
  onDelete,
  onConvertToOrder,
}) => {
  const getStatusBadge = (status) => {
    const statuses = {
      DRAFT: { label: "Nháp", class: "badge-secondary" },
      SENT: { label: "Đã gửi", class: "badge-info" },
      ACCEPTED: { label: "Chấp nhận", class: "badge-success" },
      REJECTED: { label: "Từ chối", class: "badge-danger" },
      EXPIRED: { label: "Hết hạn", class: "badge-warning" },
      CONVERTED: { label: "Đã tạo đơn", class: "badge-primary" },
    };
    const statusInfo = statuses[status] || { label: status, class: "badge-secondary" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const isExpired = (validUntil) => {
    if (!validUntil) return false;
    return new Date(validUntil) < new Date();
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

  if (quotations.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-file-text-o fa-3x mb-3"></i>
        <p>Không có báo giá nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã báo giá</th>
              <th>Khách hàng</th>
              <th>Ngày tạo</th>
              <th>Hiệu lực</th>
              <th className="text-right">Tổng tiền</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {quotations.map((quotation) => (
              <tr key={quotation.id}>
                <td>
                  <Link
                    to={`/quotation-edit/${quotation.id}`}
                    className="text-primary font-weight-bold"
                  >
                    {quotation.code}
                  </Link>
                </td>
                <td>
                  <Link to={`/customer-detail/${quotation.customer?.id}`}>
                    {quotation.customer?.name}
                  </Link>
                  <small className="d-block text-muted">
                    {quotation.customer?.phone}
                  </small>
                </td>
                <td>{formatDate(quotation.createdAt)}</td>
                <td>
                  <span
                    className={
                      isExpired(quotation.validUntil) ? "text-danger" : ""
                    }
                  >
                    {formatDate(quotation.validUntil)}
                  </span>
                  {isExpired(quotation.validUntil) && (
                    <small className="d-block text-danger">Hết hạn</small>
                  )}
                </td>
                <td className="text-right font-weight-bold">
                  {formatCurrency(quotation.totalAmount)}
                </td>
                <td>{getStatusBadge(quotation.status)}</td>
                <td className="text-center">
                  <Link
                    to={`/quotation-edit/${quotation.id}`}
                    className="btn btn-sm btn-outline-primary mr-1"
                    title="Sửa"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                  {quotation.status !== "CONVERTED" && (
                    <button
                      className="btn btn-sm btn-outline-success mr-1"
                      title="Chuyển thành đơn hàng"
                      onClick={() => onConvertToOrder(quotation.id)}
                    >
                      <i className="fa fa-shopping-cart"></i>
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-outline-info mr-1"
                    title="In báo giá"
                    onClick={() => window.print()}
                  >
                    <i className="fa fa-print"></i>
                  </button>
                  {quotation.status === "DRAFT" && (
                    <button
                      className="btn btn-sm btn-outline-danger"
                      title="Xóa"
                      onClick={() => onDelete(quotation.id)}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
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
                className={`page-item ${
                  pagination.page === index + 1 ? "active" : ""
                }`}
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

export default QuotationTable;
