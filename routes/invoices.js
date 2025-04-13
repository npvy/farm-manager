const express = require('express');
const router = express.Router();
const pool = require('../Database/db');

// Thêm hóa đơn mới với nhiều dòng sản phẩm
router.post('/', async (req, res) => {
    const { customer_id, invoice_date, products, notes } = req.body;

    try {
        // Bắt đầu transaction
        await pool.query('START TRANSACTION');

        // Thêm hóa đơn
        const [invoiceResult] = await pool.query('INSERT INTO Invoices (customer_id, invoice_date, notes) VALUES (?, ?, ?)', [customer_id, invoice_date, notes]);
        const invoiceId = invoiceResult.insertId;

        let orderTotal = 0;

        // Thêm từng dòng sản phẩm
        for (const product of products) {
            const { product_id, quantity } = product;

            // Lấy giá sản phẩm
            const [customer] = await pool.query('SELECT customer_type_id FROM Customers WHERE customer_id = ?', [customer_id]);
            const customerTypeId = customer[0].customer_type_id;
            const [priceRows] = await pool.query('SELECT unit_price FROM ProductPrices WHERE product_id = ? AND customer_type_id = ?', [product_id, customerTypeId]);
            const unitPrice = priceRows[0].unit_price;

            const totalAmount = unitPrice * quantity;
            orderTotal += totalAmount;

            // Thêm dòng sản phẩm vào bảng Exports
            await pool.query('INSERT INTO Exports (export_date, product_id, customer_id, quantity, unit_price, total_amount, notes) VALUES (?, ?, ?, ?, ?, ?, ?)', [invoice_date, product_id, customer_id, quantity, unitPrice, totalAmount, notes]);
        }

        // Cập nhật order_total trong Invoices
        await pool.query('UPDATE Invoices SET order_total = ? WHERE invoice_id = ?', [orderTotal, invoiceId]);

        // Commit transaction
        await pool.query('COMMIT');

        res.send({ message: 'Thêm hóa đơn thành công', invoice_id: invoiceId });
    } catch (err) {
        // Rollback transaction nếu có lỗi
        await pool.query('ROLLBACK');
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách hóa đơn
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Invoices');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin 1 hóa đơn
router.get('/:id', async (req, res) => {
    const invoiceId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM Invoices WHERE invoice_id = ?', [invoiceId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy hóa đơn' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


// Sửa hóa đơn
router.put('/:id', async (req, res) => {
    const invoiceId = req.params.id;
    const { customer_id, invoice_date, order_total, notes } = req.body;

    try {
        const [result] = await pool.query('UPDATE Invoices SET customer_id = ?, invoice_date = ?, order_total = ?, notes = ? WHERE invoice_id = ?', [customer_id, invoice_date, order_total, notes, invoiceId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa hóa đơn
router.delete('/:id', async (req, res) => {
    const invoiceId = req.params.id;

    try {
        const [result] = await pool.query('DELETE FROM Invoices WHERE invoice_id = ?', [invoiceId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Cập nhật order_total trong Invoices
router.put('/update-order-total/:invoiceId', async (req, res) => {
    const invoiceId = req.params.invoiceId;

    try {
        // Lấy customer_id từ Invoices
        const [invoice] = await pool.query('SELECT customer_id FROM Invoices WHERE invoice_id = ?', [invoiceId]);
        if (invoice.length === 0) {
            return res.status(404).send({ message: 'Không tìm thấy hóa đơn' });
        }
        const customerId = invoice[0].customer_id;

        // Tính toán order_total từ Exports
        const [exports] = await pool.query('SELECT SUM(total_amount) AS order_total FROM Exports WHERE customer_id = ?', [customerId]);
        const orderTotal = exports[0].order_total || 0;

        // Cập nhật order_total trong Invoices
        await pool.query('UPDATE Invoices SET order_total = ? WHERE invoice_id = ?', [orderTotal, invoiceId]);

        res.send({ message: 'Cập nhật order_total thành công' });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;