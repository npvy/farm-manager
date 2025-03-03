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
        const [rows] = await pool.query(
        'SELECT p.product_id as product_id, p.product_name as product_name, pt.product_type_name as product_type_name,pp.unit_price as unit_price, ct.customer_type_name as customer_type_name, p.description as description FROM Products p JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id LEFT JOIN ProductPrices pp ON p.product_id = pp.product_id LEFT JOIN CustomerTypes ct ON pp.customer_type_id = ct.customer_type_id'
       );
        res.send(rows);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const query = `
            SELECT 
                p.product_id, 
                p.product_name, 
                pt.product_type_name,
                pp.unit_price,
                ct.customer_type_name
            FROM Products p
            JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id
            LEFT JOIN ProductPrices pp ON p.product_id = pp.product_id
            LEFT JOIN CustomerTypes ct ON pp.customer_type_id = ct.customer_type_id
            WHERE p.product_id = ?;
        `;
        const results = await db.query(query, [productId]);
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
        }
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', error);
        res.status(500).json({ error: 'Lỗi server' });
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

module.exports = router;