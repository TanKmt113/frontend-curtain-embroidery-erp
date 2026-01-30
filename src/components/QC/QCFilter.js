/**
 * QC Filter Component
 */

import React, { useState } from "react";

const QCFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const results = [
    { value: "PASSED", label: "Đạt" },
    { value: "FAILED", label: "Không đạt" },
    { value: "REWORK", label: "Làm lại" },
    { value: "PENDING", label: "Chờ kiểm tra" },
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
    const resetFilters = { search: "", result: "", dateFrom: "", dateTo: "" };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="row">
        <div className="col-md-3">
          <div className="form-group">
            <label>Tìm kiếm</label>
            <input
              type="text"
              className="form-control"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="Mã QC, mã LSX..."
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group">
            <label>Kết quả</label>
            <select
              className="form-control"
              name="result"
              value={localFilters.result}
              onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              {results.map((r) => (
                <option key={r.value} value={r.value}>
                  {r.label}
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
        <div className="col-md-3">
          <div className="form-group">
            <label>&nbsp;</label>
            <div>
              <button type="submit" className="btn btn-primary mr-2">
                <i className="fa fa-search mr-1"></i> Tìm
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleReset}
              >
                <i className="fa fa-refresh mr-1"></i> Đặt lại
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default QCFilter;
