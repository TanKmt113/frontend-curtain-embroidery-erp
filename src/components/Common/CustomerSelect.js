import React from "react";

class CustomerSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      customers: [],
      loading: false,
      searchTerm: "",
      showDropdown: false,
    };
  }

  componentDidMount() {
    this.loadCustomers();
  }

  loadCustomers = async () => {
    this.setState({ loading: true });
    try {
      // Mock data - replace with actual API call
      const mockCustomers = [
        { id: "1", name: "Nguyễn Văn A", phone: "0901234567", email: "nguyenvana@email.com" },
        { id: "2", name: "Trần Thị B", phone: "0912345678", email: "tranthib@email.com" },
        { id: "3", name: "Lê Văn C", phone: "0923456789", email: "levanc@email.com" },
        { id: "4", name: "Phạm Thị D", phone: "0934567890", email: "phamthid@email.com" },
        { id: "5", name: "Hoàng Văn E", phone: "0945678901", email: "hoangvane@email.com" },
      ];
      this.setState({ customers: mockCustomers, loading: false });
    } catch (error) {
      console.error("Error loading customers:", error);
      this.setState({ loading: false });
    }
  };

  handleSearch = (e) => {
    this.setState({ searchTerm: e.target.value, showDropdown: true });
  };

  handleSelect = (customer) => {
    this.setState({ showDropdown: false, searchTerm: "" });
    if (this.props.onSelect) {
      this.props.onSelect(customer);
    }
  };

  handleFocus = () => {
    this.setState({ showDropdown: true });
  };

  handleBlur = () => {
    // Delay to allow click on dropdown item
    setTimeout(() => {
      this.setState({ showDropdown: false });
    }, 200);
  };

  getFilteredCustomers = () => {
    const { customers, searchTerm } = this.state;
    if (!searchTerm) return customers;
    
    const term = searchTerm.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(term) ||
        c.phone.includes(term) ||
        c.email.toLowerCase().includes(term)
    );
  };

  render() {
    const { value, placeholder, disabled } = this.props;
    const { loading, searchTerm, showDropdown } = this.state;
    const filteredCustomers = this.getFilteredCustomers();

    return (
      <div className="customer-select position-relative">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder={placeholder || "Tìm khách hàng..."}
            value={value ? value.name : searchTerm}
            onChange={this.handleSearch}
            onFocus={this.handleFocus}
            onBlur={this.handleBlur}
            disabled={disabled}
          />
          <div className="input-group-append">
            <span className="input-group-text">
              {loading ? (
                <i className="fa fa-spinner fa-spin"></i>
              ) : (
                <i className="fa fa-search"></i>
              )}
            </span>
          </div>
        </div>

        {showDropdown && filteredCustomers.length > 0 && (
          <div
            className="dropdown-menu show w-100"
            style={{
              maxHeight: "250px",
              overflowY: "auto",
              position: "absolute",
              zIndex: 1000,
            }}
          >
            {filteredCustomers.map((customer) => (
              <button
                key={customer.id}
                type="button"
                className="dropdown-item"
                onClick={() => this.handleSelect(customer)}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{customer.name}</strong>
                    <br />
                    <small className="text-muted">
                      {customer.phone} - {customer.email}
                    </small>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {showDropdown && filteredCustomers.length === 0 && searchTerm && (
          <div
            className="dropdown-menu show w-100"
            style={{ position: "absolute", zIndex: 1000 }}
          >
            <div className="dropdown-item text-muted">
              Không tìm thấy khách hàng
            </div>
          </div>
        )}

        {value && (
          <div className="mt-2 p-2 bg-light rounded">
            <small className="text-muted">Đã chọn:</small>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>{value.name}</strong>
                <span className="ml-2 text-muted">{value.phone}</span>
              </div>
              {!disabled && (
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => this.handleSelect(null)}
                >
                  <i className="fa fa-times"></i>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default CustomerSelect;
