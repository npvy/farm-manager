const express = require('express');
const router = express.Router();
const pool = require('../Database/db');
const { body, validationResult } = require('express-validator');

// Thêm loại sản phẩm
router.post('/', [
    body('product_type_name').notEmpty().withMessage('Tên loại sản phẩm không được để trống'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { product_type_name } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO ProductTypes (product_type_name) VALUES (?)', [product_type_name]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy danh sách loại sản phẩm
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ProductTypes');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết loại sản phẩm
router.get('/:id', async (req, res) => {
    const productTypeId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM ProductTypes WHERE product_type_id = ?', [productTypeId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy loại sản phẩm' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Sửa loại sản phẩm
router.put('/:id', [
    body('product_type_name').notEmpty().withMessage('Tên loại sản phẩm không được để trống'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productTypeId = req.params.id;
    const { product_type_name } = req.body;

    try {
        const [result] = await pool.query('UPDATE ProductTypes SET product_type_name = ? WHERE product_type_id = ?', [product_type_name, productTypeId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa loại sản phẩm
router.delete('/:id', async (req, res) => {
    const productTypeId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM ProductTypes WHERE product_type_id = ?', [productTypeId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;