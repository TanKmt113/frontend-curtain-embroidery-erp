/**
 * Product List Screen
 * Danh sách sản phẩm
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import ProductTable from "../../components/Product/ProductTable";
import ProductFilter from "../../components/Product/ProductFilter";
import { productService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
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
        status: "",
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadProducts();
  }

  loadProducts = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      const response = await productService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        ...filters,
      });

      this.setState({
        products: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách sản phẩm");
      this.setState({ loading: false });
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadProducts()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadProducts()
    );
  };

  handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      return;
    }

    try {
      await productService.delete(id);
      toastSuccess("Xóa sản phẩm thành công");
      this.loadProducts();
    } catch (error) {
      toastError(error.message || "Không thể xóa sản phẩm");
    }
  };

  render() {
    const { products, loading, pagination, filters } = this.state;

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
              HeaderText="Danh sách sản phẩm"
              Breadcrumb={[
                { name: "Sản phẩm", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Sản phẩm</h2>
                    <Link
                      to="/product-create"
                      className="btn btn-primary btn-sm float-right"
                    >
                      <i className="fa fa-plus"></i> Thêm sản phẩm
                    </Link>
                  </div>
                  <div className="body">
                    <ProductFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <ProductTable
                      products={products}
                      loading={loading}
                      pagination={pagination}
                      onPageChange={this.handlePageChange}
                      onDelete={this.handleDelete}
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

export default connect(mapStateToProps, {})(ProductList);
