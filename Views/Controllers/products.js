document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const itemsPerPage = 10;
    let totalPages = 1;
    let filterProductTypeId = '';
    let filterCustomerTypeId = '';

    // Hàm lấy danh sách loại sản phẩm và đổ vào FILTER
    async function fetchProductTypes() {
        try {
            const response = await fetch('/api/product-types');
            const productTypes = await response.json();
            const modalProductTypeIdSelect = document.getElementById('modalProductTypeId');
            const modalEditProductTypeIdSelect = document.getElementById('modalEditProductTypeId');
            const filterProductTypeSelect = document.getElementById('filterProductType');

            modalProductTypeIdSelect.innerHTML = '';
            modalEditProductTypeIdSelect.innerHTML = '';
            filterProductTypeSelect.innerHTML = '<option value="">Tất cả loại sản phẩm</option>';

            productTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.product_type_id;
                option.textContent = type.product_type_name;
                modalProductTypeIdSelect.appendChild(option.cloneNode(true));
                modalEditProductTypeIdSelect.appendChild(option.cloneNode(true));
                filterProductTypeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Lỗi khi tải loại sản phẩm:', error);
        }
    }

    // Hàm lấy danh sách loại khách hàng và đổ vào FILTER
    async function fetchCustomerTypes() {
        try {
            const response = await fetch('/api/customer-types');
            const customerTypes = await response.json();
            const modalCustomerTypeIdSelect = document.getElementById('modalCustomerTypeId');
            const modalEditCustomerTypeIdSelect = document.getElementById('modalEditCustomerTypeId');
            const filterCustomerTypeSelect = document.getElementById('filterCustomerType');

            modalCustomerTypeIdSelect.innerHTML = '';
            modalEditCustomerTypeIdSelect.innerHTML = '';
            filterCustomerTypeSelect.innerHTML = '<option value="">Tất cả loại khách hàng</option>';

            customerTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.customer_type_id;
                option.textContent = type.customer_type_name;
                modalCustomerTypeIdSelect.appendChild(option.cloneNode(true));
                modalEditCustomerTypeIdSelect.appendChild(option.cloneNode(true));
                filterCustomerTypeSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Lỗi khi tải loại khách hàng:', error);
        }
    }

    // Hàm lấy danh sách sản phẩm và hiển thị (có phân trang và lọc)
    async function fetchProducts(page = 1) {
        try {
            const url = `/api/products/details?page=${page}&limit=${itemsPerPage}&productTypeId=${filterProductTypeId}&customerTypeId=${filterCustomerTypeId}`;
            const response = await fetch(url);
            const data = await response.json();
    
            if (data && data.products) { // Kiểm tra data và data.products
                const products = data.products;
                totalPages = data.totalPages;
    
                const tableBody = document.getElementById('productsTable').querySelector('tbody');
                tableBody.innerHTML = '';
    
                products.forEach(product => {
                    const row = tableBody.insertRow();
                    row.innerHTML = `
                        <td>${product.product_name}</td>
                        <td>${product.product_type_name}</td>
                        <td>${product.customer_type_name}</td>
                        <td>${product.unit_price || ''}</td>
                        <td>${product.description || ''}</td>
                        <td>
                            <button class="editBtn" data-id="${product.product_id}"><i class="fas fa-edit"></i></button>
                            <button class="deleteBtn" data-id="${product.product_id}"><i class="fas fa-trash-alt"></i></button>
                            
                        </td>
                    `;
                });
                // Hiển thị thông tin phân trang
                 document.getElementById('currentPage').textContent = `${page} / ${totalPages}`;
            } else {
                console.error('Dữ liệu sản phẩm không hợp lệ:', data);
                // Xử lý trường hợp dữ liệu không hợp lệ (ví dụ: hiển thị thông báo lỗi)
            }
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    }

    // Xử lý sự kiện click nút phân trang
    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            fetchProducts(currentPage);
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            fetchProducts(currentPage);
        }
    });

    // Xử lý sự kiện thay đổi select lọc
    document.getElementById('filterProductType').addEventListener('change', (event) => {
        filterProductTypeId = event.target.value;
        currentPage = 1;
        fetchProducts(currentPage);
    });

    document.getElementById('filterCustomerType').addEventListener('change', (event) => {
        filterCustomerTypeId = event.target.value;
        currentPage = 1;
        fetchProducts(currentPage);
    });

    // Thêm sản phẩm (hiển thị modal)
    document.getElementById('addProductBtn').addEventListener('click', () => {
        document.getElementById('addProductModal').style.display = 'block';
    });

    // Thêm sản phẩm (trong modal)
    document.getElementById('modalAddProductBtn').addEventListener('click', async () => {
        const productName = document.getElementById('modalProductName').value;
        const productTypeId = document.getElementById('modalProductTypeId').value;
        const customerTypeId = document.getElementById('modalCustomerTypeId').value;
        const productPrice = document.getElementById('modalProductPrice').value;
        const productDescription = document.getElementById('modalProductDescription').value;

        try {
            await fetch('/api/products/details', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    customer_type_id: customerTypeId,
                    description: productDescription,
                    price: productPrice
                }),
            });
            fetchProducts(currentPage);
            document.getElementById('modalProductName').value = '';
            document.getElementById('modalProductDescription').value = '';
            document.getElementById('modalProductPrice').value = '';
            document.getElementById('addProductModal').style.display = 'none';
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    });

    // Cập nhật sản phẩm (hiển thị modal)
    document.getElementById('productsTable').addEventListener('click', async (event) => {
        if (event.target.classList.contains('editBtn')) {
            const productId = event.target.dataset.id;
            try {
                const response = await fetch(`/api/details/products/${productId}`);
                const product = await response.json();

                document.getElementById('modalEditProductId').value = product.product_id;
                document.getElementById('modalEditProductName').value = product.product_name;
                document.getElementById('modalEditProductTypeId').value = product.product_type_id;
                document.getElementById('modalEditCustomerTypeId').value = product.customer_type_id;
                document.getElementById('modalEditProductDescription').value = product.description;
                document.getElementById('modalEditProductPrice').value = product.price;
                document.getElementById('editProductModal').style.display = 'block';
            } catch (error) {
                console.error('Lỗi khi tải thông tin sản phẩm:', error);
            }
        }
    });

    // Cập nhật sản phẩm (trong modal)
    document.getElementById('modalUpdateProductBtn').addEventListener('click', async () => {
        const productId = document.getElementById('modalEditProductId').value;
        const productName = document.getElementById('modalEditProductName').value;
        const productTypeId = document.getElementById('modalEditProductTypeId').value;
        const customerTypeId = document.getElementById('modalEditCustomerTypeId').value;
        const productDescription = document.getElementById('modalEditProductDescription').value;
        const productPrice = document.getElementById('modalEditProductPrice').value;

        try {
            await fetch(`/api/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    customer_type_id: customerTypeId,
                    description: productDescription,
                    price: productPrice
                }),
            });
            document.getElementById('editProductModal').style.display = 'none';
            fetchProducts(currentPage);
        } catch (error) {
            console.error('Lỗi khi cập nhật sản phẩm:', error);
        }
    });

    // Xóa sản phẩm (hiển thị modal)
    document.getElementById('productsTable').addEventListener('click', async (event) => {
        if (event.target.classList.contains('deleteBtn')) {
            const productId = event.target.dataset.id;
            document.getElementById('modalDeleteProductBtn').dataset.id = productId;
            document.getElementById('deleteProductModal').style.display = 'block';
        }
    });

    // Xóa sản phẩm (trong modal)
    document.getElementById('modalDeleteProductBtn').addEventListener('click', async () => {
        const productId = document.getElementById('modalDeleteProductBtn').dataset.id;
        try {
            await fetch(`/api/products/${productId}`, { method: 'DELETE' });
            fetchProducts(currentPage);
            document.getElementById('deleteProductModal').style.display = 'none';
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    });

    // Hủy xóa
    document.getElementById('modalCancelDeleteBtn').addEventListener('click', () => {
        document.getElementById('deleteProductModal').style.display = 'none';
    });

    // Đóng modal
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    fetchProductTypes();
    fetchCustomerTypes();
    fetchProducts(currentPage);
});