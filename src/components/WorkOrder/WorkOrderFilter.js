/**
 * WorkOrder Filter Component
 */

import React, { useState } from "react";

const WorkOrderFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const statuses = [
    { value: "PENDING", label: "Chờ sản xuất" },
    { value: "IN_PROGRESS", label: "Đang sản xuất" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "ON_HOLD", label: "Tạm dừng" },
    { value: "CANCELLED", label: "Đã hủy" },
  ];

  const steps = [
    { value: "CUTTING", label: "Cắt" },
    { value: "SEWING", label: "May" },
    { value: "EMBROIDERY", label: "Thêu" },
    { value: "FINISHING", label: "Hoàn thiện" },
    { value: "QC", label: "Kiểm tra chất lượng" },
    { value: "PACKAGING", label: "Đóng gói" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { search: "", status: "", step: "", dateFrom: "", dateTo: "" };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="row">
        <div className="col-md-2">
          <div className="form-group">
            <label>Tìm kiếm</label>
            <input
              type="text"
              className="form-control"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="Mã LSX, đơn hàng..."
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>Trạng thái</label>
            <select
              className="form-control"
              name="status"
              value={localFilters.status}
              onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              {statuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>Công đoạn</label>
            <select
              className="form-control"
              name="step"
              value={localFilters.step}
              onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              {steps.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>Từ ngày</label>
            <input
              type="date"
              className="form-control"
              name="dateFrom"
              value={localFilters.dateFrom}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>Đến ngày</label>
            <input
              type="date"
              className="form-control"
              name="dateTo"
              value={localFilters.dateTo}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>&nbsp;</label>
            <div>
              <button type="submit" className="btn btn-primary mr-2">
                <i className="fa fa-search"></i>
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
              >
                <i className="fa fa-refresh"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default WorkOrderFilter;
