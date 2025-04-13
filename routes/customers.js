const express = require('express');
const router = express.Router();
const pool = require('../Database/db');
const { body, validationResult } = require('express-validator');

// Thêm khách hàng
router.post('/', [
    body('customer_name').notEmpty().withMessage('Tên khách hàng không được để trống'),
    body('customer_type_id').notEmpty().withMessage('Loại khách hàng không được để trống'),
    body('address').optional(),
    body('phone').optional(),
    body('email').optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { customer_name, customer_type_id, address, phone, email } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Customers (customer_name, customer_type_id, address, phone, email) VALUES (?, ?, ?, ?, ?)', [customer_name, customer_type_id, address, phone, email]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách khách hàng
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Customers');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết 1 khách hàng
router.get('/:id', async (req, res) => {
    const customerId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM Customers WHERE customer_id = ?', [customerId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy khách hàng' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Tìm kiếm khách hàng theo tên hoặc số điện thoại
router.get('/search', async (req, res) => {
    const customerInfo = req.query.name;
    if (!customerInfo) {
        return res.status(400).send({ message: 'Tên/SĐT khách hàng không được để trống' });
    }
    try {
        const [rows] = await pool.query('SELECT * FROM Customers WHERE customer_name LIKE ? OR phone LIKE ?', [`%${customerInfo}%`]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Sửa khách hàng
router.put('/:id', [
    body('customer_name').notEmpty().withMessage('Tên khách hàng không được để trống'),
    body('customer_type_id').notEmpty().withMessage('Loại khách hàng không được để trống'),
    body('address').optional(),
    body('phone').optional(),
    body('email').optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const customerId = req.params.id;
    const { customer_name, customer_type_id, address, phone, email } = req.body;

    try {
        const [result] = await pool.query('UPDATE Customers SET customer_name = ?, customer_type_id = ?, address = ?, phone = ?, email = ? WHERE customer_id = ?', [customer_name, customer_type_id, address, phone, email, customerId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa khách hàng
router.delete('/:id', async (req, res) => {
    const customerId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM Customers WHERE customer_id = ?', [customerId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách khách hàng cùng với tên loại khách hàng
router.get('/with-types', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT c.*, ct.customer_type_name
            FROM Customers c
            JOIN CustomerTypes ct ON c.customer_type_id = ct.customer_type_id
        `);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;