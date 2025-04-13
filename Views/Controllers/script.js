document.addEventListener('DOMContentLoaded', function() {
    let productTypeMap;
    let customerTypeMap;
    let productTypeInfoMap;
    let customerTypeInfoMap;

    async function fetchData() {
        try {
            // Lấy dữ liệu tổng quan
            const Products = await fetch('/api/products').then(res => res.json());
            const Customers = await fetch('/api/customers').then(res => res.json());
            const ProductTypes = await fetch('/api/product-types').then(res => res.json());
            const CustomerTypes = await fetch('/api/customer-types').then(res => res.json());
            const Inventory = await fetch('/api/inventory').then(res => res.json());
            const Exports = await fetch('/api/exports').then(res => res.json());
            const Invoices = await fetch('/api/invoices').then(res => res.json());

            // Cập nhật giao diện tổng quan
            document.getElementById('totalProducts').textContent = Products.length;
            document.getElementById('totalCustomers').textContent = Customers.length;
            document.getElementById('totalProductTypes').textContent = ProductTypes.length;
            document.getElementById('totalCustomerTypes').textContent = CustomerTypes.length;
            document.getElementById('totalInventory').textContent = Inventory.reduce((acc, item) => acc + item.quantity_in_stock, 0);
            document.getElementById('totalExports').textContent = Exports.length;

            //Lấy dữ liệu 10 đơn hàng gần đây
            getInvoicesTable(Exports, Customers, Products, Invoices);

            // Tạo map để tra cứu
            productTypeMap = new Map(ProductTypes.map(pt => [pt.product_type_id, pt.product_type_name]));
            customerTypeMap = new Map(CustomerTypes.map(ct => [ct.customer_type_id, ct.customer_type_name]));

            // Tạo map chứa thông tin product type và customer type cho mỗi sản phẩm và khách hàng
            productTypeInfoMap = new Map(ProductTypes.map(pt => [pt.product_type_id, pt]));
            customerTypeInfoMap = new Map(CustomerTypes.map(ct => [ct.customer_type_id, ct]));

            //Lấy thông tin các khách hàng
            getCustomersTable(Customers, customerTypeInfoMap);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    }

    async function getInvoicesTable(Exports, Customers, Products, Invoices) {
        try {
            const customerMap = new Map(Customers.map(customer => [customer.customer_id, customer.customer_name]));
            const productMap = new Map(Products.map(product => [product.product_id, product.product_name]));
            const invoiceMap = new Map(Invoices.map(i => [i.invoice_id, formatDate(i.invoice_date)]));

            const invoicesDetailTable = document.querySelector('#invoicesDetailTable tbody');
            invoicesDetailTable.innerHTML = '';

            const rows = Exports.map(item => {
                const row = document.createElement('tr');
                const cells = [
                    customerMap.get(item.customer_id) || 'Không xác định',
                    productMap.get(item.product_id) || 'Không xác định',
                    item.quantity,
                    item.unit_price,
                    item.quantity * item.unit_price,
                    invoiceMap.get(item.invoice_id) || 'Không xác định',
                ].map(text => {
                    const cell = document.createElement('td');
                    cell.textContent = text;
                    return cell;
                });
                cells.forEach(cell => row.appendChild(cell));
                return row;
            });

            rows.forEach(row => invoicesDetailTable.appendChild(row));

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu invoices:', error);
        }
    }

    function getCustomersTable(data, customerTypeInfoMap) {
        const customersTableBody = document.querySelector('#customersTable tbody');
        customersTableBody.innerHTML = "";

        data.forEach(customer => {
            const row = customersTableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);

            cell1.textContent = customer.customer_name;
            const customerType = customerTypeInfoMap.get(customer.customer_type_id);
            cell2.textContent = customerType ? customerType.customer_type_name : 'Không xác định';
            cell3.textContent = customer.email;
            cell4.textContent = customer.phone;
            cell5.textContent = customer.address;
        });
    }

    // Hàm định dạng ngày tháng

    function formatDate(dateString) {

    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
        
    return `${day}-${month}-${year}`;
        
    }

    fetchData();
});