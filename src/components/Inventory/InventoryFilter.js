/**
 * Inventory Filter Component
 */

import React, { useState } from "react";

const InventoryFilter = ({ filters, onFilterChange }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const productTypes = [
    { value: "CURTAIN_FABRIC", label: "Vải rèm" },
    { value: "ROMAN", label: "Roman" },
    { value: "ROLLER", label: "Rèm cuốn" },
    { value: "VERTICAL", label: "Rèm lá dọc" },
    { value: "CUSHION", label: "Nệm/Gối" },
    { value: "EMBROIDERY", label: "Vải thêu" },
    { value: "ACCESSORY", label: "Phụ kiện" },
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setLocalFilters({ ...localFilters, [name]: newValue });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onFilterChange(localFilters);
  };

  const handleReset = () => {
    const resetFilters = { search: "", type: "", lowStock: false };
    setLocalFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <div className="row align-items-end">
        <div className="col-md-4">
          <div className="form-group mb-0">
            <label>Tìm kiếm</label>
            <input
              type="text"
              className="form-control"
              name="search"
              value={localFilters.search}
              onChange={handleChange}
              placeholder="Mã SP, tên sản phẩm..."
            />
          </div>
        </div>
        <div className="col-md-2">
          <div className="form-group mb-0">
            <label>Loại sản phẩm</label>
            <select
              className="form-control"
              name="type"
              value={localFilters.type}
              onChange={handleChange}
            >
              <option value="">-- Tất cả --</option>
              {productTypes.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-3">
          <div className="form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="lowStock"
              name="lowStock"
              checked={localFilters.lowStock}
              onChange={handleChange}
            />
            <label className="form-check-label" htmlFor="lowStock">
              <i className="fa fa-exclamation-triangle text-danger mr-1"></i>
              Chỉ hiện hàng sắp hết
            </label>
          </div>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-primary mr-2">
            <i className="fa fa-search mr-1"></i> Tìm
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleReset}>
            <i className="fa fa-refresh mr-1"></i> Đặt lại
          </button>
        </div>
      </div>
    </form>
  );
};

export default InventoryFilter;
