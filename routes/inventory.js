const express = require('express');
const router = express.Router();
const pool = require('../Database/db');

// Lấy danh sách tồn kho
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM Inventory');
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Lấy thông tin tồn kho của một sản phẩm
router.get('/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const [rows] = await pool.query('SELECT * FROM Inventory WHERE product_id = ?', [productId]);
        res.send(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Cập nhật số lượng tồn kho
router.put('/:productId', async (req, res) => {
    const productId = req.params.productId;
    const { quantity_in_stock } = req.body;
    try {
        const [result] = await pool.query('UPDATE Inventory SET quantity_in_stock = ? WHERE product_id = ?', [quantity_in_stock, productId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


// Thêm sản phẩm vào kho
router.post('/', async (req, res) => {
    const { product_id, quantity_in_stock } = req.body;
    try {
        const [result] = await pool.query('INSERT INTO Inventory (product_id, quantity_in_stock) VALUES (?, ?)', [product_id, quantity_in_stock]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

// Xóa sản phẩm khỏi kho
router.delete('/:productId', async (req, res) => {
    const productId = req.params.productId;
    try {
        const [result] = await pool.query('DELETE FROM Inventory WHERE product_id = ?', [productId]);
        res.send(result);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});

module.exports = router;