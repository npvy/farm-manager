document.addEventListener('DOMContentLoaded', () => {
    // Hàm để lấy và hiển thị dữ liệu sản phẩm
    function fetchAndDisplayProducts() {
        fetch('/api/products/products/with-types')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(products => {
        Body = document.querySelector('#productsTable tbody');
                if (productsTableBody) {
                    productsTableBody.innerHTML = ''; // Xóa dữ liệu cũ
                    products.forEach(product => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${product.product_name}</td>
                            <td>${product.product_type_name}</td>
                        `;
                        productsTableBody.appendChild(row);
                    });
                    document.getElementById('totalProducts').textContent = products.length; // Cập nhật tổng số sản phẩm
                }
            });
    }

    // Hàm để lấy và hiển thị dữ liệu khách hàng
    function fetchAndDisplayCustomers() {
        fetch('/api/customers/with-types') // Thay đổi đường dẫn API nếu cần
            .then(response => response.json())
            .then(customers => {
                const customersTableBody = document.querySelector('#customersTable tbody');
                if (customersTableBody) {
                    customersTableBody.innerHTML = ''; // Xóa dữ liệu cũ
                    customers.forEach(customer => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${customer.customer_name}</td>
                            <td>${customer.customer_type_name}</td>
                            <td>${customer.email}</td>
                            <td>${customer.phone}</td>
                            <td>${customer.address}</td>
                        `;
                        customersTableBody.appendChild(row);
                    });
                    document.getElementById('totalCustomers').textContent = customers.length; // Cập nhật tổng số khách hàng
                }
            });
    }

    // Hàm để lấy và hiển thị dữ liệu xuất kho (đơn hàng)
    function fetchAndDisplayExports() {
        fetch('/api/exports/with-details') // Thay đổi đường dẫn API nếu cần
            .then(response => response.json())
            .then(exports => {
                const exportsTableBody = document.querySelector('#exportsTable tbody');
                if (exportsTableBody) {
                    exportsTableBody.innerHTML = ''; // Xóa dữ liệu cũ
                    exports.forEach(exportItem => {
                        const row = document.createElement('tr');
                        row.innerHTML = `
                            <td>${exportItem.export_id}</td>
                            <td>${exportItem.product_name}</td>
                            <td>${exportItem.customer_name}</td>
                            <td>${exportItem.export_date}</td>
                            <td>${exportItem.total_price}</td>
                        `;
                        exportsTableBody.appendChild(row);
                    });
                    document.getElementById('totalExports').textContent = exports.length; // Cập nhật tổng số đơn hàng
                }
            });
    }

    // Hàm để lấy và hiển thị số lượng loại sản phẩm
    function fetchAndDisplayProductTypes() {
        fetch('/api/product-types') // Thay đổi đường dẫn API nếu cần
            .then(response => response.json())
            .then(productTypes => {
                document.getElementById('totalProductTypes').textContent = productTypes.length; // Cập nhật tổng số loại sản phẩm
            });
    }

    // Hàm để lấy và hiển thị số lượng loại khách hàng
    function fetchAndDisplayCustomerTypes() {
        fetch('/api/customer-types') // Thay đổi đường dẫn API nếu cần
            .then(response => response.json())
            .then(customerTypes => {
                document.getElementById('totalCustomerTypes').textContent = customerTypes.length; // Cập nhật tổng số loại khách hàng
            });
    }
    // Hàm để lấy và hiển thị số lượng tồn kho
    function fetchAndDisplayInventory() {
      fetch('/api/inventory') // Thay đổi đường dẫn API nếu cần
          .then(response => response.json())
          .then(inventory => {
              document.getElementById('totalInventory').textContent = inventory.length; // Cập nhật tổng số tồn kho
          });
    }

    // Gọi các hàm để lấy và hiển thị dữ liệu
    fetchAndDisplayProducts();
    fetchAndDisplayCustomers();
    fetchAndDisplayExports();
    fetchAndDisplayProductTypes();
    fetchAndDisplayCustomerTypes();
    fetchAndDisplayInventory();
});