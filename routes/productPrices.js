const express = require('express');
const router = express.Router();
const pool = require('../Database/db');
const { body, validationResult } = require('express-validator');

// Lấy danh sách giá sản phẩm
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM ProductPrices');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết giá sản phẩm
router.get('/:id', async (req, res) => {
    const productPriceId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM ProductPrices WHERE product_price_id = ?', [productPriceId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy giá sản phẩm' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Thêm giá sản phẩm
router.post('/', async (req, res) => {
    const { product_id, customer_type_id, unit_price } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO ProductPrices (product_id, customer_type_id, unit_price) VALUES (?, ?, ?)', [product_id, customer_type_id, unit_price]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Sửa giá sản phẩm
router.put('/:id', [
    body('product_id').notEmpty().withMessage('ID sản phẩm không được để trống'),
    body('customer_type_id').notEmpty().withMessage('ID loại khách hàng không được để trống'),
    body('unit_price').notEmpty().withMessage('Giá sản phẩm không được để trống'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const productPriceId = req.params.id;
    const { product_id, customer_type_id, unit_price } = req.body;

    try {
        const [result] = await pool.query('UPDATE ProductPrices SET product_id = ?, customer_type_id = ?, unit_price = ? WHERE product_price_id = ?', [product_id, customer_type_id, unit_price, productPriceId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa giá sản phẩm
router.delete('/:id', async (req, res) => {
    const productPriceId = req.params.id;
    try {
        const [result] = await pool.query('DELETE FROM ProductPrices WHERE product_price_id = ?', [productPriceId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy giá sản phẩm dựa trên customer_id và product_id
router.get('/price', async (req, res) => {
    const { customer_id, product_id } = req.query;

    if (!customer_id || !product_id) {
        return res.status(400).send({ message: 'customer_id và product_id là bắt buộc' });
    }

    try {
        const [customer] = await pool.query('SELECT customer_type_id FROM Customers WHERE customer_id = ?', [customer_id]);
        if (customer.length === 0) {
            return res.status(404).send({ message: 'Không tìm thấy khách hàng' });
        }
        const customerTypeId = customer[0].customer_type_id;

        const [rows] = await pool.query('SELECT unit_price FROM ProductPrices WHERE product_id = ? AND customer_type_id = ?', [product_id, customerTypeId]);

        if (rows.length === 0) {
            return res.status(404).send({ message: 'Không tìm thấy giá sản phẩm cho khách hàng này' });
        }

        res.send({ unit_price: rows[0].unit_price });
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;