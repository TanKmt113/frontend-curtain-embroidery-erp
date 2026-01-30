/**
 * Inventory History Screen
 * Lịch sử xuất nhập kho
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import { inventoryService } from "../../api";
import { toastError } from "../../utils/toast";

class InventoryHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transactions: [],
      loading: true,
      pagination: {
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: "",
        type: "",
        dateFrom: "",
        dateTo: "",
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadHistory();
  }

  loadHistory = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      const response = await inventoryService.getHistory({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      this.setState({
        transactions: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải lịch sử kho");
      this.setState({ loading: false });
    }
  };

  handleFilterChange = (e) => {
    const { name, value } = e.target;
    this.setState(
      {
        filters: { ...this.state.filters, [name]: value },
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadHistory()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadHistory()
    );
  };

  getTypeBadge = (type) => {
    const types = {
      PURCHASE: { label: "Mua hàng", class: "badge-success", icon: "fa-arrow-down" },
      SALE: { label: "Bán hàng", class: "badge-primary", icon: "fa-arrow-up" },
      RETURN: { label: "Trả hàng", class: "badge-warning", icon: "fa-undo" },
      ADJUSTMENT: { label: "Điều chỉnh", class: "badge-info", icon: "fa-edit" },
      TRANSFER: { label: "Chuyển kho", class: "badge-secondary", icon: "fa-exchange" },
      PRODUCTION: { label: "Sản xuất", class: "badge-dark", icon: "fa-industry" },
    };
    const typeInfo = types[type] || { label: type, class: "badge-secondary", icon: "fa-circle" };
    return (
      <span className={`badge ${typeInfo.class}`}>
        <i className={`fa ${typeInfo.icon} mr-1`}></i>
        {typeInfo.label}
      </span>
    );
  };

  formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleString("vi-VN");
  };

  formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  transactionTypes = [
    { value: "PURCHASE", label: "Mua hàng" },
    { value: "SALE", label: "Bán hàng" },
    { value: "RETURN", label: "Trả hàng" },
    { value: "ADJUSTMENT", label: "Điều chỉnh" },
    { value: "TRANSFER", label: "Chuyển kho" },
    { value: "PRODUCTION", label: "Sản xuất" },
  ];

  render() {
    const { transactions, loading, pagination, filters } = this.state;

    return (
      <div
        style={{ flex: 1 }}
        onClick={() => {
          document.body.classList.remove("offcanvas-active");
        }}
      >
        <div>
          <div className="container-fluid">
            <PageHeader
              HeaderText="Lịch sử kho"
              Breadcrumb={[
                { name: "Kho hàng", navigate: "/inventory" },
                { name: "Lịch sử", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Lịch sử xuất nhập kho</h2>
                    <Link
                      to="/inventory"
                      className="btn btn-outline-primary btn-sm float-right"
                    >
                      <i className="fa fa-arrow-left mr-1"></i> Quay lại
                    </Link>
                  </div>
                  <div className="body">
                    {/* Filters */}
                    <div className="row mb-4">
                      <div className="col-md-3">
                        <input
                          type="text"
                          className="form-control"
                          name="search"
                          value={filters.search}
                          onChange={this.handleFilterChange}
                          placeholder="Tìm kiếm..."
                        />
                      </div>
                      <div className="col-md-2">
                        <select
                          className="form-control"
                          name="type"
                          value={filters.type}
                          onChange={this.handleFilterChange}
                        >
                          <option value="">-- Loại giao dịch --</option>
                          {this.transactionTypes.map((t) => (
                            <option key={t.value} value={t.value}>
                              {t.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-2">
                        <input
                          type="date"
                          className="form-control"
                          name="dateFrom"
                          value={filters.dateFrom}
                          onChange={this.handleFilterChange}
                        />
                      </div>
                      <div className="col-md-2">
                        <input
                          type="date"
                          className="form-control"
                          name="dateTo"
                          value={filters.dateTo}
                          onChange={this.handleFilterChange}
                        />
                      </div>
                      <div className="col-md-3">
                        <button
                          className="btn btn-primary mr-2"
                          onClick={() => this.loadHistory()}
                        >
                          <i className="fa fa-search"></i>
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() =>
                            this.setState(
                              {
                                filters: {
                                  search: "",
                                  type: "",
                                  dateFrom: "",
                                  dateTo: "",
                                },
                              },
                              () => this.loadHistory()
                            )
                          }
                        >
                          <i className="fa fa-refresh"></i>
                        </button>
                      </div>
                    </div>

                    {/* Table */}
                    {loading ? (
                      <div className="text-center p-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="sr-only">Loading...</span>
                        </div>
                      </div>
                    ) : transactions.length === 0 ? (
                      <div className="text-center text-muted py-5">
                        <i className="fa fa-history fa-3x mb-3"></i>
                        <p>Không có lịch sử giao dịch</p>
                      </div>
                    ) : (
                      <>
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Thời gian</th>
                                <th>Mã GD</th>
                                <th>Loại</th>
                                <th>Sản phẩm</th>
                                <th className="text-right">Số lượng</th>
                                <th className="text-right">Giá trị</th>
                                <th>Người thực hiện</th>
                                <th>Ghi chú</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map((tx) => (
                                <tr key={tx.id}>
                                  <td>
                                    <small>{this.formatDate(tx.createdAt)}</small>
                                  </td>
                                  <td>
                                    <span className="font-weight-bold">{tx.code}</span>
                                  </td>
                                  <td>{this.getTypeBadge(tx.type)}</td>
                                  <td>
                                    {tx.product?.name}
                                    <small className="d-block text-muted">
                                      {tx.product?.code}
                                    </small>
                                  </td>
                                  <td
                                    className={`text-right font-weight-bold ${
                                      tx.quantity > 0 ? "text-success" : "text-danger"
                                    }`}
                                  >
                                    {tx.quantity > 0 ? "+" : ""}
                                    {tx.quantity}
                                  </td>
                                  <td className="text-right">
                                    {this.formatCurrency(tx.totalValue)}
                                  </td>
                                  <td>{tx.user?.name || "-"}</td>
                                  <td>
                                    <small className="text-muted">
                                      {tx.notes || "-"}
                                    </small>
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
                              <li
                                className={`page-item ${
                                  pagination.page === 1 ? "disabled" : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() =>
                                    this.handlePageChange(pagination.page - 1)
                                  }
                                  disabled={pagination.page === 1}
                                >
                                  <i className="fa fa-chevron-left"></i>
                                </button>
                              </li>
                              <li className="page-item disabled">
                                <span className="page-link">
                                  {pagination.page} / {pagination.totalPages}
                                </span>
                              </li>
                              <li
                                className={`page-item ${
                                  pagination.page === pagination.totalPages
                                    ? "disabled"
                                    : ""
                                }`}
                              >
                                <button
                                  className="page-link"
                                  onClick={() =>
                                    this.handlePageChange(pagination.page + 1)
                                  }
                                  disabled={pagination.page === pagination.totalPages}
                                >
                                  <i className="fa fa-chevron-right"></i>
                                </button>
                              </li>
                            </ul>
                          </nav>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ ioTReducer }) => ({});

export default connect(mapStateToProps, {})(InventoryHistory);
