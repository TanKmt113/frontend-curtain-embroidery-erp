/**
 * Customer Filter Component
 */

import React, { useState } from "react";

const CustomerFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { search: "", type: "" };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="row">
        <div className="col-md-4">
          <div className="form-group">
            <label>Tìm kiếm</label>
            <input
              type="text"
              className="form-control"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="Tên, mã KH, SĐT, email..."
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Loại khách hàng</label>
            <select
              className="form-control"
              name="type"
              value={localFilters.type}
              onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              <option value="INDIVIDUAL">Cá nhân</option>
              <option value="COMPANY">Công ty</option>
              <option value="CONSIGNMENT">Ký gửi</option>
            </select>
          </div>
        </div>
        <div className="col-md-5">
          <div className="form-group">
            <label>&nbsp;</label>
            <div>
              <button type="submit" className="btn btn-primary mr-2">
                <i className="fa fa-search mr-1"></i> Tìm kiếm
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

export default CustomerFilter;
