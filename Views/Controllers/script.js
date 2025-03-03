document.addEventListener('DOMContentLoaded', function() {
    let productTypeMap;
    let customerTypeMap;
    let productTypeInfoMap;
    let customerTypeInfoMap;

    async function fetchData() {
        try {
            // Lấy dữ liệu tổng quan
            
            const totalProducts = await fetch('/api/products').then(res => res.json());
            const totalCustomers = await fetch('/api/customers').then(res => res.json());
            const totalProductTypes = await fetch('/api/product-types').then(res => res.json());
            const totalCustomerTypes = await fetch('/api/customer-types').then(res => res.json());
            const totalInventory = await fetch('/api/inventory').then(res => res.json());
            const totalExports = await fetch('/api/exports').then(res => res.json());

            // Cập nhật giao diện tổng quan
            document.getElementById('totalProducts').textContent = totalProducts.length;
            document.getElementById('totalCustomers').textContent = totalCustomers.length;
            document.getElementById('totalProductTypes').textContent = totalProductTypes.length;
            document.getElementById('totalCustomerTypes').textContent = totalCustomerTypes.length;
            document.getElementById('totalInventory').textContent = totalInventory.reduce((acc, item) => acc + item.quantity_in_stock, 0);
            document.getElementById('totalExports').textContent = totalExports.length;

            // Lấy dữ liệu loại sản phẩm và loại khách hàng
            const productTypes = await fetch('/api/product-types').then(res => res.json());
            const customerTypes = await fetch('/api/customer-types').then(res => res.json());

            // Tạo map để tra cứu tên loại sản phẩm và loại khách hàng
            productTypeMap = new Map(productTypes.map(pt => [pt.product_type_id, pt.product_type_name]));
            customerTypeMap = new Map(customerTypes.map(ct => [ct.customer_type_id, ct.customer_type_name]));

            // Tạo map chứa thông tin product type và customer type cho mỗi sản phẩm và khách hàng
            productTypeInfoMap = new Map(productTypes.map(pt => [pt.product_type_id, pt]));
            customerTypeInfoMap = new Map(customerTypes.map(ct => [ct.customer_type_id, ct]));

            // Lấy dữ liệu đơn hàng gần đây
            let exportsData = await fetch('/api/exports').then(res => res.json());

            // Cập nhật bảng đơn hàng gần đây
            updateExportsTable(exportsData, productTypeMap, customerTypeMap);

            // Lấy dữ liệu sản phẩm
            const productsData = await fetch('/api/products').then(res => res.json());

            // Cập nhật bảng sản phẩm
            updateProductsTable(productsData, productTypeInfoMap);

            // Lấy dữ liệu khách hàng
            const customersData = await fetch("/api/customers").then(res => res.json());

            // Cập nhật bảng khách hàng
            updateCustomersTable(customersData, customerTypeInfoMap);

        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu:', error);
        }
    }

    function updateExportsTable(data, productTypeMap, customerTypeMap) {
        const exportsTableBody = document.querySelector('#exportsTable tbody');
        exportsTableBody.innerHTML = '';

        data.forEach(async exportItem => {
            const product = await fetch(`/api/products/${exportItem.product_id}`).then(res => res.json());
            const customer = await fetch(`/api/customers/${exportItem.customer_id}`).then(res => res.json());
            const row = exportsTableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
            const cell5 = row.insertCell(4);
            const cell6 = row.insertCell(5);

            cell1.textContent = customer.customer_name; ;
            cell2.textContent = product.product_name;
            cell3.textContent = exportItem.quantity;
            cell4.textContent = exportItem.unit_price;
            cell5.textContent = exportItem.total_amount;
            cell6.textContent = formatDate(exportItem.export_date);
        });
    }

    function updateProductsTable(data, productTypeInfoMap) {
        const productsTableBody = document.querySelector('#productsTable tbody');
        productsTableBody.innerHTML = '';
    
        data.forEach(product => {
            const row = productsTableBody.insertRow();
            const cell1 = row.insertCell(0);
            const cell2 = row.insertCell(1);
            const cell3 = row.insertCell(2);
            const cell4 = row.insertCell(3);
    
            cell1.textContent = product.product_name;
            cell2.textContent = product.product_type_name;
            cell3.textContent = product.customer_type_name || 'Chưa xác định';
            cell4.textContent = product.unit_price || 'Chưa có giá';
        });
    }

    function updateCustomersTable(data, customerTypeInfoMap) {
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