const express = require('express');
const router = express.Router();
const pool = require('../Database/db');
const { body, validationResult } = require('express-validator');

// Thêm loại khách hàng
router.post('/', [
    body('customer_type_name').notEmpty().withMessage('Tên loại khách hàng không được để trống'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { customer_type_name } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO CustomerTypes (customer_type_name) VALUES (?)', [customer_type_name]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách loại khách hàng
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM CustomerTypes');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết loại khách hàng
router.get('/:id', async (req, res) => {
    const customerTypeId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM CustomerTypes WHERE customer_type_id = ?', [customerTypeId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy loại khách hàng' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Sửa loại khách hàng
router.put('/:id', [
    body('customer_type_name').notEmpty().withMessage('Tên loại khách hàng không được để trống'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const customerTypeId = req.params.id;
    const { customer_type_name } = req.body;

    try {
        const [result] = await pool.query('UPDATE CustomerTypes SET customer_type_name = ? WHERE customer_type_id = ?', [customer_type_name, customerTypeId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa loại khách hàng
router.delete('/:id', async (req, res) => {
    const customerTypeId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM CustomerTypes WHERE customer_type_id = ?', [customerTypeId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;