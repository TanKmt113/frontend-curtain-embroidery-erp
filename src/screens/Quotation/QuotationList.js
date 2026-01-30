/**
 * Quotation List Screen
 * Danh sách báo giá
 */

import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../../components/PageHeader";
import QuotationTable from "../../components/Quotation/QuotationTable";
import QuotationFilter from "../../components/Quotation/QuotationFilter";
import { quotationService } from "../../api";
import { toastError, toastSuccess } from "../../utils/toast";

class QuotationList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      quotations: [],
      loading: true,
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
      },
      filters: {
        search: "",
        status: "",
        dateFrom: "",
        dateTo: "",
      },
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.loadQuotations();
  }

  loadQuotations = async () => {
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
      if (filters.status) params.status = filters.status;
      if (filters.dateFrom) params.dateFrom = filters.dateFrom;
      if (filters.dateTo) params.dateTo = filters.dateTo;

      const response = await quotationService.getAll(params);

      this.setState({
        quotations: response.data || [],
        pagination: {
          ...pagination,
          total: response.meta?.total || 0,
          totalPages: response.meta?.totalPages || 0,
        },
        loading: false,
      });
    } catch (error) {
      toastError(error.message || "Không thể tải danh sách báo giá");
      this.setState({ loading: false });
    }
  };

  handleFilterChange = (filters) => {
    this.setState(
      {
        filters,
        pagination: { ...this.state.pagination, page: 1 },
      },
      () => this.loadQuotations()
    );
  };

  handlePageChange = (page) => {
    this.setState(
      {
        pagination: { ...this.state.pagination, page },
      },
      () => this.loadQuotations()
    );
  };

  handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa báo giá này?")) return;

    try {
      await quotationService.delete(id);
      toastSuccess("Xóa báo giá thành công");
      this.loadQuotations();
    } catch (error) {
      toastError(error.message || "Không thể xóa báo giá");
    }
  };

  handleConvertToOrder = async (id) => {
    if (!window.confirm("Chuyển báo giá này thành đơn hàng?")) return;

    try {
      await quotationService.convertToOrder(id);
      toastSuccess("Đã tạo đơn hàng từ báo giá");
      this.loadQuotations();
    } catch (error) {
      toastError(error.message || "Không thể chuyển thành đơn hàng");
    }
  };

  render() {
    const { quotations, loading, pagination, filters } = this.state;

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
              HeaderText="Báo giá"
              Breadcrumb={[
                { name: "Báo giá", navigate: "" },
                { name: "Danh sách", navigate: "" },
              ]}
            />

            <div className="row clearfix">
              <div className="col-lg-12">
                <div className="card">
                  <div className="header">
                    <h2>Danh sách báo giá</h2>
                    <Link
                      to="/quotation-create"
                      className="btn btn-primary btn-sm float-right"
                    >
                      <i className="fa fa-plus"></i> Tạo báo giá
                    </Link>
                  </div>
                  <div className="body">
                    <QuotationFilter
                      filters={filters}
                      onFilterChange={this.handleFilterChange}
                    />
                    <QuotationTable
                      quotations={quotations}
                      loading={loading}
                      pagination={pagination}
                      onPageChange={this.handlePageChange}
                      onDelete={this.handleDelete}
                      onConvertToOrder={this.handleConvertToOrder}
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

export default connect(mapStateToProps, {})(QuotationList);
