/**
 * Order Filter Component
 */

import React, { useState } from "react";

const OrderFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const orderStatuses = [
    { value: "PENDING", label: "Chờ xác nhận" },
    { value: "CONFIRMED", label: "Đã xác nhận" },
    { value: "IN_PRODUCTION", label: "Đang sản xuất" },
    { value: "READY_FOR_DELIVERY", label: "Sẵn sàng giao" },
    { value: "DELIVERED", label: "Đã giao" },
    { value: "COMPLETED", label: "Hoàn thành" },
    { value: "CANCELLED", label: "Đã hủy" },
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
    const resetFilters = { search: "", status: "", dateFrom: "", dateTo: "" };
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
              placeholder="Mã đơn, tên KH..."
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
              {orderStatuses.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
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

export default OrderFilter;
