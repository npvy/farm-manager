document.addEventListener('DOMContentLoaded', () => {
    // Hàm lấy danh sách loại sản phẩm và đổ vào select
    async function fetchProductTypes() {
        try {
            const response = await fetch('/api/productTypes');
            const productTypes = await response.json();
            const modalProductTypeIdSelect = document.getElementById('modalProductTypeId');
            const modalEditProductTypeIdSelect = document.getElementById('modalEditProductTypeId');

            modalProductTypeIdSelect.innerHTML = ''; // Xóa các tùy chọn cũ
            modalEditProductTypeIdSelect.innerHTML = ''; // Xóa các tùy chọn cũ

            productTypes.forEach(type => {
                const option = document.createElement('option');
                option.value = type.product_type_id;
                option.textContent = type.product_type_name;
                modalProductTypeIdSelect.appendChild(option.cloneNode(true));
                modalEditProductTypeIdSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Lỗi khi tải loại sản phẩm:', error);
        }
    }

    // Hàm lấy danh sách sản phẩm và hiển thị
    async function fetchProducts() {
        try {
            const response = await fetch('/products/with-types');
            const products = await response.json();
            const tableBody = document.getElementById('productsTable').querySelector('tbody');
            tableBody.innerHTML = '';

            products.forEach(product => {
                const row = tableBody.insertRow();
                row.innerHTML = `
                    <td>${product.product_id}</td>
                    <td>${product.product_name}</td>
                    <td>${product.product_type_name}</td>
                    <td>${product.description || ''}</td>
                    <td>
                        <button class="editBtn" data-id="${product.product_id}"><i class="fas fa-edit"></i></button>
                        <button class="deleteBtn" data-id="${product.product_id}"><i class="fas fa-trash-alt"></i></button>
                    </td>
                `;
            });
        } catch (error) {
            console.error('Lỗi khi tải sản phẩm:', error);
        }
    }

    // Thêm sản phẩm (hiển thị modal)
    document.getElementById('addProductBtn').addEventListener('click', () => {
        document.getElementById('addProductModal').style.display = 'block';
    });

    // Thêm sản phẩm (trong modal)
    document.getElementById('modalAddProductBtn').addEventListener('click', async () => {
        const productName = document.getElementById('modalProductName').value;
        const productTypeId = document.getElementById('modalProductTypeId').value;
        const productDescription = document.getElementById('modalProductDescription').value;
        const productPrice = document.getElementById('modalProductPrice').value;

        try {
            await fetch('/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    description: productDescription,
                    price: productPrice
                }),
            });
            fetchProducts();
            // Reset form
            document.getElementById('modalProductName').value = '';
            document.getElementById('modalProductDescription').value = '';
            document.getElementById('modalProductPrice').value = '';
            document.getElementById('addProductModal').style.display = 'none';
        } catch (error) {
            console.error('Lỗi khi thêm sản phẩm:', error);
        }
    });

    // Sửa sản phẩm (hiển thị modal)
    document.getElementById('productsTable').addEventListener('click', async (event) => {
        if (event.target.classList.contains('editBtn')) {
            const productId = event.target.dataset.id;
            try {
                const response = await fetch(`/products/${productId}`);
                const product = await response.json();

                document.getElementById('modalEditProductId').value = product.product_id;
                document.getElementById('modalEditProductName').value = product.product_name;
                document.getElementById('modalEditProductTypeId').value = product.product_type_id;
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
        const productDescription = document.getElementById('modalEditProductDescription').value;
        const productPrice = document.getElementById('modalEditProductPrice').value;

        try {
            await fetch(`/products/${productId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    product_name: productName,
                    product_type_id: productTypeId,
                    description: productDescription,
                    price: productPrice
                }),
            });
            document.getElementById('editProductModal').style.display = 'none';
            fetchProducts();
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
            await fetch(`/products/${productId}`, { method: 'DELETE' });
            fetchProducts();
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
    fetchProducts();
});