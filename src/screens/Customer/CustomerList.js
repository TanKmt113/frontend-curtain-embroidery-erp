/**
 * Customer List Screen
 * Danh sách khách hàng
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import CustomerTable from "../../components/Customer/CustomerTable";
import CustomerFilter from "../../components/Customer/CustomerFilter";
import { customerService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class CustomerList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
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
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadCustomers();
  }

  loadCustomers = async () => {
    const { pagination, filters } = this.state;
    this.setState({ loading: true });

    try {
      const response = await customerService.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: filters.search,
        type: filters.type,
      });

      this.setState({
        customers: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách khách hàng");
      this.setState({ loading: false });
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadCustomers()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadCustomers()
    );
  };

  handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa khách hàng này?")) {
      return;
    }

    try {
      await customerService.delete(id);
      toastSuccess("Xóa khách hàng thành công");
      this.loadCustomers();
    } catch (error) {
      toastError(error.message || "Không thể xóa khách hàng");
    }
  };

  render() {
    const { customers, loading, pagination, filters } = this.state;

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
              HeaderText="Danh sách khách hàng"
              Breadcrumb={[
                { name: "Khách hàng", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Khách hàng</h2>
                    <Link
                      to="/customer-create"
                      className="btn btn-primary btn-sm float-right"
                    >
                      <i className="fa fa-plus"></i> Thêm khách hàng
                    </Link>
                  </div>
                  <div className="body">
                    <CustomerFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <CustomerTable
                      customers={customers}
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

export default connect(mapStateToProps, {})(CustomerList);
