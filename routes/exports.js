const express = require('express');
const router = express.Router();
const pool = require('../Database/db');

// Thêm xuất kho
router.post('/', async (req, res) => {
    const { export_date, product_id, customer_id, quantity, unit_price, total_amount, notes } = req.body;

    try {
        // Kiểm tra số lượng tồn kho trước khi thực hiện xuất kho
        const [inventory] = await pool.query('SELECT quantity_in_stock FROM Inventory WHERE product_id = ?', [product_id]);

        if (inventory.length === 0 || inventory[0].quantity_in_stock < quantity) {
            return res.status(400).send({ message: 'Số lượng tồn kho không đủ' });
        }

        // Nếu số lượng tồn kho đủ, thực hiện xuất kho
        const [result] = await pool.query('INSERT INTO Exports (export_date, product_id, customer_id, quantity, unit_price, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [export_date, product_id, customer_id, quantity, unit_price, total_amount, notes]);

        // Cập nhật tồn kho
        await pool.query('UPDATE Inventory SET quantity_in_stock = quantity_in_stock - ? WHERE product_id = ?', [quantity, product_id]);

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách xuất kho
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Exports');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết xuất kho
router.get('/:id', async (req, res) => {
    const exportId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM Exports WHERE export_id = ?', [exportId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy xuất kho' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Sửa xuất kho (cần xử lý cập nhật tồn kho)
router.put('/:id', async (req, res) => {
    const exportId = req.params.id;
    const { export_date, product_id, customer_id, quantity, unit_price, total_amount, notes } = req.body;

    try {
        // Lấy thông tin xuất kho cũ để so sánh số lượng
        const [oldExport] = await pool.query('SELECT quantity FROM Exports WHERE export_id = ?', [exportId]);
        if (oldExport.length === 0) return res.status(404).send({ message: 'Không tìm thấy xuất kho' });

        const oldQuantity = oldExport[0].quantity;
        const quantityDiff = quantity - oldQuantity;

        // Cập nhật xuất kho
        const [result] = await pool.query('UPDATE Exports SET export_date = ?, product_id = ?, customer_id = ?, quantity = ?, unit_price = ?, total_amount = ?, notes = ? WHERE export_id = ?', [export_date, product_id, customer_id, quantity, unit_price, total_amount, notes, exportId]);

        // Cập nhật tồn kho
        await pool.query('UPDATE Inventory SET quantity_in_stock = quantity_in_stock - ? WHERE product_id = ?', [quantityDiff, product_id]);

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa xuất kho (cần xử lý cập nhật tồn kho)
router.delete('/:id', async (req, res) => {
    const exportId = req.params.id;

    try {
        // Lấy thông tin xuất kho cũ để cập nhật tồn kho
        const [oldExport] = await pool.query('SELECT product_id, quantity FROM Exports WHERE export_id = ?', [exportId]);
        if (oldExport.length === 0) return res.status(404).send({ message: 'Không tìm thấy xuất kho' });

        const { product_id, quantity } = oldExport[0];

        // Xóa xuất kho
        const [result] = await pool.query('DELETE FROM Exports WHERE export_id = ?', [exportId]);

        // Cập nhật tồn kho
        await pool.query('UPDATE Inventory SET quantity_in_stock = quantity_in_stock + ? WHERE product_id = ?', [quantity, product_id]);

        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách xuất kho cùng với tên sản phẩm và tên khách hàng
router.get('/with-details', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT e.*, p.product_name, c.customer_name
            FROM Exports e
            JOIN Products p ON e.product_id = p.product_id
            JOIN Customers c ON e.customer_id = c.customer_id
        `);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Cập nhật unit_price và total_amount trong Exports dựa trên ProductPrices
router.put('/update-prices', async (req, res) => {
    try {
        await pool.query(`
            UPDATE Exports e
            JOIN ProductPrices pp ON e.product_id = pp.product_id
            JOIN Customers c ON e.customer_id = c.customer_id
            SET e.unit_price = pp.unit_price, e.total_amount = e.quantity * pp.unit_price
            WHERE pp.customer_type_id = c.customer_type_id;
        `);
        res.send({ message: 'Cập nhật giá thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;