/**
 * Inventory List Screen
 * Danh sách kho hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import InventoryTable from "../../components/Inventory/InventoryTable";
import InventoryFilter from "../../components/Inventory/InventoryFilter";
import { inventoryService } from "../../api";
import { toastError } from "../../utils/toast";

class InventoryList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: "",
        type: "",
        lowStock: false,
      },
      stats: {
        totalItems: 0,
        totalValue: 0,
        lowStockItems: 0,
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadInventory();
    this.loadStats();
  }

  loadInventory = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      // Build query params, only include non-empty values
      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      // Only add filter params if they have values
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.lowStock) params.lowStock = filters.lowStock;

      const response = await inventoryService.getAll(params);

      this.setState({
        items: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách kho");
      this.setState({ loading: false });
    }
  };

  loadStats = async () => {
    try {
      const response = await inventoryService.getStats();
      this.setState({ stats: response.data || this.state.stats });
    } catch (error) {
      console.error("Load inventory stats error:", error);
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadInventory()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadInventory()
    );
  };

  formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  render() {
    const { items, loading, pagination, filters, stats } = this.state;

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
              HeaderText="Quản lý kho"
              Breadcrumb={[
                { name: "Kho hàng", navigate: "" },
                { name: "Tồn kho", navigate: "" },
              ]}
            />

            {/* Stats Cards */}
            <div className="row clearfix">
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-primary text-white rounded-circle">
                        <i className="fa fa-cubes fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Tổng mặt hàng</span>
                        <h4 className="mb-0">{stats.totalItems}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-success text-white rounded-circle">
                        <i className="fa fa-money fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Giá trị tồn kho</span>
                        <h4 className="mb-0 text-success">
                          {this.formatCurrency(stats.totalValue)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-4 col-md-6">
                <div className="card">
                  <div className="body">
                    <div className="d-flex align-items-center">
                      <div className="icon-in-bg bg-danger text-white rounded-circle">
                        <i className="fa fa-exclamation-triangle fa-2x p-3"></i>
                      </div>
                      <div className="ml-4">
                        <span className="text-muted">Cần nhập thêm</span>
                        <h4 className="mb-0 text-danger">{stats.lowStockItems}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Table */}
            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Tồn kho</h2>
                    <div className="float-right">
                      <Link
                        to="/inventory-receive"
                        className="btn btn-success btn-sm mr-2"
                      >
                        <i className="fa fa-arrow-down"></i> Nhập kho
                      </Link>
                      <Link
                        to="/inventory-history"
                        className="btn btn-info btn-sm"
                      >
                        <i className="fa fa-history"></i> Lịch sử
                      </Link>
                    </div>
                  </div>
                  <div className="body">
                    <InventoryFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <InventoryTable
                      items={items}
                      loading={loading}
                      pagination={pagination}
                      onPageChange={this.handlePageChange}
                    />
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

export default connect(mapStateToProps, {})(InventoryList);
