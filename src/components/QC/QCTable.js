/**
 * QC Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const QCTable = ({ records, loading, pagination, onPageChange, onRefresh }) => {
  const getResultBadge = (result) => {
    const results = {
      PASSED: { label: "Đạt", class: "badge-success" },
      FAILED: { label: "Không đạt", class: "badge-danger" },
      REWORK: { label: "Làm lại", class: "badge-warning" },
      PENDING: { label: "Chờ kiểm tra", class: "badge-secondary" },
    };
    const resultInfo = results[result] || { label: result, class: "badge-secondary" };
    return <span className={`badge ${resultInfo.class}`}>{resultInfo.label}</span>;
  };

  const formatDate = (date) => {
    if (!date) return "-";
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

  if (records.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-check-circle fa-3x mb-3"></i>
        <p>Không có bản ghi kiểm tra nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã QC</th>
              <th>Lệnh SX</th>
              <th>Sản phẩm</th>
              <th>Ngày KT</th>
              <th>Kết quả</th>
              <th>Số lỗi</th>
              <th>Người KT</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>
                  <span className="font-weight-bold">{record.code}</span>
                </td>
                <td>
                  <Link to={`/work-order-detail/${record.workOrder?.id}`}>
                    {record.workOrder?.code}
                  </Link>
                </td>
                <td>
                  {record.workOrder?.orderItem?.product?.name}
                  <small className="d-block text-muted">
                    {record.workOrder?.orderItem?.order?.customer?.name}
                  </small>
                </td>
                <td>{formatDate(record.checkDate)}</td>
                <td>{getResultBadge(record.result)}</td>
                <td>
                  {record.defects?.length > 0 ? (
                    <span className="badge badge-danger">{record.defects.length}</span>
                  ) : (
                    <span className="text-muted">0</span>
                  )}
                </td>
                <td>{record.checker?.name || "-"}</td>
                <td className="text-center">
                  <Link
                    to={`/qc-edit/${record.id}`}
                    className="btn btn-sm btn-outline-primary mr-1"
                    title="Sửa"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
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

export default QCTable;
