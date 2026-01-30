/**
 * Production Steps Component
 * Hiển thị và cập nhật công đoạn sản xuất
 */

import React, { useState } from "react";

const ProductionSteps = ({ steps, onStepUpdate }) => {
  const [updatingStep, setUpdatingStep] = useState(null);
  const [notes, setNotes] = useState("");

  const stepTypes = {
    CUTTING: { label: "Cắt vải", icon: "fa-scissors", color: "info" },
    SEWING: { label: "May", icon: "fa-th-large", color: "primary" },
    EMBROIDERY: { label: "Thêu", icon: "fa-paint-brush", color: "warning" },
    FINISHING: { label: "Hoàn thiện", icon: "fa-check-circle", color: "success" },
    QC: { label: "Kiểm tra chất lượng", icon: "fa-search", color: "danger" },
    PACKAGING: { label: "Đóng gói", icon: "fa-cube", color: "secondary" },
  };

  const getStepInfo = (type) => {
    return stepTypes[type] || { label: type, icon: "fa-circle", color: "secondary" };
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "COMPLETED":
        return "step-completed";
      case "IN_PROGRESS":
        return "step-in-progress";
      case "PENDING":
      default:
        return "step-pending";
    }
  };

  const handleStartStep = (stepId) => {
    onStepUpdate(stepId, { status: "IN_PROGRESS" });
  };

  const handleCompleteStep = (stepId) => {
    setUpdatingStep(stepId);
  };

  const handleConfirmComplete = (stepId) => {
    onStepUpdate(stepId, { status: "COMPLETED", notes });
    setUpdatingStep(null);
    setNotes("");
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleString("vi-VN");
  };

  return (
    <div className="production-steps">
      <style>
        {`
          .production-steps .step-item {
            display: flex;
            align-items: flex-start;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 8px;
            background: #f8f9fa;
            border-left: 4px solid #dee2e6;
            transition: all 0.3s ease;
          }
          .production-steps .step-item.step-completed {
            background: #d4edda;
            border-left-color: #28a745;
          }
          .production-steps .step-item.step-in-progress {
            background: #cce5ff;
            border-left-color: #007bff;
            animation: pulse 2s infinite;
          }
          .production-steps .step-item.step-pending {
            opacity: 0.7;
          }
          .production-steps .step-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            font-size: 20px;
            color: #fff;
          }
          .production-steps .step-content {
            flex: 1;
          }
          .production-steps .step-title {
            font-weight: 600;
            margin-bottom: 5px;
          }
          .production-steps .step-meta {
            font-size: 12px;
            color: #6c757d;
          }
          .production-steps .step-actions {
            margin-left: auto;
          }
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(0,123,255,0.4); }
            70% { box-shadow: 0 0 0 10px rgba(0,123,255,0); }
            100% { box-shadow: 0 0 0 0 rgba(0,123,255,0); }
          }
        `}
      </style>

      {steps.map((step, index) => {
        const stepInfo = getStepInfo(step.stepType);
        const isUpdating = updatingStep === step.id;

        return (
          <div
            key={step.id || index}
            className={`step-item ${getStatusClass(step.status)}`}
          >
            <div className={`step-icon bg-${stepInfo.color}`}>
              <i className={`fa ${stepInfo.icon}`}></i>
            </div>

            <div className="step-content">
              <div className="step-title">
                {index + 1}. {stepInfo.label}
                {step.status === "COMPLETED" && (
                  <i className="fa fa-check-circle text-success ml-2"></i>
                )}
                {step.status === "IN_PROGRESS" && (
                  <span className="badge badge-primary ml-2">Đang thực hiện</span>
                )}
              </div>

              <div className="step-meta">
                {step.assignee && (
                  <span className="mr-3">
                    <i className="fa fa-user mr-1"></i>
                    {step.assignee.name}
                  </span>
                )}
                {step.startedAt && (
                  <span className="mr-3">
                    <i className="fa fa-clock-o mr-1"></i>
                    Bắt đầu: {formatDate(step.startedAt)}
                  </span>
                )}
                {step.completedAt && (
                  <span>
                    <i className="fa fa-check mr-1"></i>
                    Hoàn thành: {formatDate(step.completedAt)}
                  </span>
                )}
              </div>

              {step.notes && (
                <div className="mt-2">
                  <small className="text-muted">
                    <i className="fa fa-sticky-note-o mr-1"></i>
                    {step.notes}
                  </small>
                </div>
              )}

              {/* Form hoàn thành */}
              {isUpdating && (
                <div className="mt-3 p-3 bg-white rounded">
                  <div className="form-group mb-2">
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Ghi chú (không bắt buộc)"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                  <button
                    className="btn btn-sm btn-success mr-2"
                    onClick={() => handleConfirmComplete(step.id)}
                  >
                    <i className="fa fa-check mr-1"></i> Xác nhận
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() => {
                      setUpdatingStep(null);
                      setNotes("");
                    }}
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>

            <div className="step-actions">
              {step.status === "PENDING" && index === 0 && (
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => handleStartStep(step.id)}
                >
                  <i className="fa fa-play mr-1"></i> Bắt đầu
                </button>
              )}
              {step.status === "PENDING" &&
                index > 0 &&
                steps[index - 1]?.status === "COMPLETED" && (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleStartStep(step.id)}
                  >
                    <i className="fa fa-play mr-1"></i> Bắt đầu
                  </button>
                )}
              {step.status === "IN_PROGRESS" && !isUpdating && (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleCompleteStep(step.id)}
                >
                  <i className="fa fa-check mr-1"></i> Hoàn thành
                </button>
              )}
            </div>
          </div>
        );
      })}

      {steps.length === 0 && (
        <div className="text-center text-muted py-4">
          <i className="fa fa-info-circle fa-2x mb-2"></i>
          <p>Chưa có công đoạn nào</p>
        </div>
      )}
    </div>
  );
};

export default ProductionSteps;
