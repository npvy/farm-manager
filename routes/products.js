const express = require('express');
const router = express.Router();
const pool = require('../Database/db');
const { body, validationResult } = require('express-validator');

// Thêm sản phẩm
router.post('/', [
    body('product_name').notEmpty().withMessage('Tên sản phẩm không được để trống'),
    body('product_type_id').notEmpty().withMessage('Loại sản phẩm không được để trống'),
    body('description').optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { product_name, product_type_id, description } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Products (product_name, product_type_id, description) VALUES (?, ?, ?)', [product_name, product_type_id, description]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách sản phẩm
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Products');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM Products WHERE product_id = ?', [productId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy sản phẩm' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lọc sản phẩm theo loại sản phẩm
router.get('/type/:productTypeId', async (req, res) => {
    const productTypeId = req.params.productTypeId;
    try {
        const [rows] = await pool.query('SELECT * FROM Products WHERE product_type_id = ?', [productTypeId]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Sửa sản phẩm
router.put('/:id', [
    body('product_name').notEmpty().withMessage('Tên sản phẩm không được để trống'),
    body('product_type_id').notEmpty().withMessage('Loại sản phẩm không được để trống'),
    body('description').optional(),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productId = req.params.id;
    const { product_name, product_type_id, description } = req.body;

    try {
        const [result] = await pool.query('UPDATE Products SET product_name = ?, product_type_id = ?, description = ? WHERE product_id = ?', [product_name, product_type_id, description, productId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa sản phẩm
router.delete('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM Products WHERE product_id = ?', [productId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách sản phẩm cùng với tên loại sản phẩm
router.get('/with-types', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, pt.product_type_name
            FROM Products p
            JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id
        `);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;