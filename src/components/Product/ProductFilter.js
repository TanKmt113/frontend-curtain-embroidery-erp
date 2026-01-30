/**
 * Product Filter Component
 */

import React, { useState } from "react";

const ProductFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const productTypes = [
    { value: "CURTAIN_FABRIC", label: "Rèm vải" },
    { value: "CURTAIN_ROMAN", label: "Rèm roman" },
    { value: "CURTAIN_ROLLER", label: "Rèm cuốn" },
    { value: "CURTAIN_VERTICAL", label: "Rèm lá dọc" },
    { value: "CUSHION", label: "Đệm/Gối" },
    { value: "EMBROIDERY", label: "Dịch vụ thêu" },
    { value: "ACCESSORY", label: "Phụ kiện" },
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
    const resetFilters = { search: "", type: "", status: "" };
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
              placeholder="Tên, mã sản phẩm..."
            />
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-group">
            <label>Loại sản phẩm</label>
            <select
              className="form-control"
              name="type"
              value={localFilters.type}
              onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              {productTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
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
              <option value="ACTIVE">Đang KD</option>
              <option value="INACTIVE">Ngừng KD</option>
            </select>
          </div>
        </div>
        <div className="col-md-4">
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

export default ProductFilter;
