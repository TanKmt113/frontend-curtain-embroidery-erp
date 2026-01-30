/**
 * Order Item Form Component
 * Form nhập thông tin sản phẩm trong đơn hàng
 */

import React from "react";

const OrderItemForm = ({ index, item, products, onChange, onRemove }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount);
  };

  const calculateSubtotal = () => {
    return (item.quantity || 0) * (item.unitPrice || 0);
  };

  return (
    <div className="card mb-3 border">
      <div className="card-body">
        <div className="row">
          <div className="col-md-11">
            <div className="row">
              <div className="col-md-4">
                <div className="form-group">
                  <label>Sản phẩm</label>
                  <select
                    className="form-control"
                    value={item.productId}
                    onChange={(e) => onChange(index, "productId", e.target.value)}
                  >
                    <option value="">-- Chọn sản phẩm --</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.code} - {product.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Mô tả / Vị trí</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.location || ""}
                    onChange={(e) => onChange(index, "location", e.target.value)}
                    placeholder="VD: Phòng khách, Cửa chính..."
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label>Rộng (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.width || ""}
                    onChange={(e) => onChange(index, "width", e.target.value)}
                    placeholder="Rộng"
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label>Cao (cm)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.height || ""}
                    onChange={(e) => onChange(index, "height", e.target.value)}
                    placeholder="Cao"
                    min="0"
                  />
                </div>
              </div>

              <div className="col-md-2">
                <div className="form-group">
                  <label>Số lượng</label>
                  <input
                    type="number"
                    className="form-control"
                    value={item.quantity}
                    onChange={(e) => onChange(index, "quantity", parseInt(e.target.value) || 1)}
                    min="1"
                  />
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <label>Đơn giá</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={item.unitPrice}
                      onChange={(e) => onChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      min="0"
                    />
                    <div className="input-group-append">
                      <span className="input-group-text">đ</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="form-group">
                  <label>Thành tiền</label>
                  <input
                    type="text"
                    className="form-control font-weight-bold text-primary"
                    value={formatCurrency(calculateSubtotal()) + " đ"}
                    readOnly
                  />
                </div>
              </div>

              <div className="col-md-4">
                <div className="form-group">
                  <label>Ghi chú</label>
                  <input
                    type="text"
                    className="form-control"
                    value={item.description || ""}
                    onChange={(e) => onChange(index, "description", e.target.value)}
                    placeholder="Ghi chú thêm..."
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-1 d-flex align-items-center justify-content-center">
            <button
              type="button"
              className="btn btn-outline-danger"
              onClick={() => onRemove(index)}
              title="Xóa sản phẩm"
            >
              <i className="fa fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItemForm;
