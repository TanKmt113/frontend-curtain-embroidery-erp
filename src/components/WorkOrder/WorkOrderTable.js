/**
 * WorkOrder Table Component
 */

import React from "react";
import { Link } from "react-router-dom";

const WorkOrderTable = ({ workOrders, loading, pagination, onPageChange, onStatusChange }) => {
  const getStatusBadge = (status) => {
    const statuses = {
      PENDING: { label: "Chờ SX", class: "badge-warning" },
      IN_PROGRESS: { label: "Đang SX", class: "badge-primary" },
      COMPLETED: { label: "Hoàn thành", class: "badge-success" },
      ON_HOLD: { label: "Tạm dừng", class: "badge-secondary" },
      CANCELLED: { label: "Đã hủy", class: "badge-danger" },
    };
    const statusInfo = statuses[status] || { label: status, class: "badge-secondary" };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

  const getStepBadge = (step) => {
    const steps = {
      CUTTING: { label: "Cắt", class: "bg-info" },
      SEWING: { label: "May", class: "bg-primary" },
      EMBROIDERY: { label: "Thêu", class: "bg-warning" },
      FINISHING: { label: "Hoàn thiện", class: "bg-success" },
      QC: { label: "KCS", class: "bg-danger" },
      PACKAGING: { label: "Đóng gói", class: "bg-secondary" },
    };
    const stepInfo = steps[step] || { label: step, class: "bg-secondary" };
    return (
      <span className={`badge ${stepInfo.class} text-white`}>{stepInfo.label}</span>
    );
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  const calculateProgress = (wo) => {
    if (!wo.steps?.length) return 0;
    const completedSteps = wo.steps.filter((s) => s.status === "COMPLETED").length;
    return Math.round((completedSteps / wo.steps.length) * 100);
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

  if (workOrders.length === 0) {
    return (
      <div className="text-center text-muted py-5">
        <i className="fa fa-industry fa-3x mb-3"></i>
        <p>Không có lệnh sản xuất nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="table-responsive">
        <table className="table table-hover table-custom">
          <thead>
            <tr>
              <th>Mã LSX</th>
              <th>Đơn hàng</th>
              <th>Sản phẩm</th>
              <th>Công đoạn</th>
              <th>Tiến độ</th>
              <th>Ngày HT dự kiến</th>
              <th>Trạng thái</th>
              <th className="text-center">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {workOrders.map((wo) => {
              const progress = calculateProgress(wo);
              const currentStep = wo.steps?.find((s) => s.status === "IN_PROGRESS");
              
              return (
                <tr key={wo.id}>
                  <td>
                    <Link
                      to={`/work-order-detail/${wo.id}`}
                      className="text-primary font-weight-bold"
                    >
                      {wo.code}
                    </Link>
                  </td>
                  <td>
                    <Link to={`/order-detail/${wo.orderItem?.order?.id}`}>
                      {wo.orderItem?.order?.code}
                    </Link>
                    <small className="d-block text-muted">
                      {wo.orderItem?.order?.customer?.name}
                    </small>
                  </td>
                  <td>
                    {wo.orderItem?.product?.name}
                    <small className="d-block text-muted">
                      SL: {wo.orderItem?.quantity}
                    </small>
                  </td>
                  <td>
                    {currentStep ? getStepBadge(currentStep.stepType) : "-"}
                  </td>
                  <td style={{ width: "120px" }}>
                    <div className="d-flex align-items-center">
                      <div className="progress flex-grow-1 mr-2" style={{ height: "8px" }}>
                        <div
                          className={`progress-bar ${
                            progress === 100 ? "bg-success" : "bg-primary"
                          }`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <small>{progress}%</small>
                    </div>
                  </td>
                  <td>{formatDate(wo.expectedEndDate)}</td>
                  <td>{getStatusBadge(wo.status)}</td>
                  <td className="text-center">
                    <Link
                      to={`/work-order-detail/${wo.id}`}
                      className="btn btn-sm btn-outline-primary mr-1"
                      title="Xem chi tiết"
                    >
                      <i className="fa fa-eye"></i>
                    </Link>
                    {wo.status === "PENDING" && (
                      <button
                        className="btn btn-sm btn-outline-success"
                        title="Bắt đầu sản xuất"
                        onClick={() => onStatusChange(wo.id, "IN_PROGRESS")}
                      >
                        <i className="fa fa-play"></i>
                      </button>
                    )}
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

export default WorkOrderTable;
