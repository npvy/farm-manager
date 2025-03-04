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
        'SELECT p.product_id as product_id, p.product_name as product_name, pt.product_type_name as product_type_name, pp.unit_price as unit_price, ct.customer_type_name as customer_type_name, p.description as description FROM Products p JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id LEFT JOIN ProductPrices pp ON p.product_id = pp.product_id LEFT JOIN CustomerTypes ct ON pp.customer_type_id = ct.customer_type_id'
       );
        res.send(rows);
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        res.status(500).send(err);
    }
}); 

// Lấy danh sách sản phẩm đầy đủ thông yin
router.get('/details', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const productTypeId = req.query.productTypeId || '';
        const customerTypeId = req.query.customerTypeId || '';

        let query = `
            SELECT p.product_id as product_id, p.product_name as product_name, 
                   pt.product_type_name as product_type_name, pp.unit_price as unit_price, 
                   ct.customer_type_name as customer_type_name, p.description as description 
            FROM Products p 
            JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id 
            LEFT JOIN ProductPrices pp ON p.product_id = pp.product_id 
            LEFT JOIN CustomerTypes ct ON pp.customer_type_id = ct.customer_type_id
            WHERE 1=1
        `;

        let countQuery = `
            SELECT COUNT(*) as total
            FROM Products p 
            JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id 
            LEFT JOIN ProductPrices pp ON p.product_id = pp.product_id 
            LEFT JOIN CustomerTypes ct ON pp.customer_type_id = ct.customer_type_id
            WHERE 1=1
        `;

        const queryParams = [];

        if (productTypeId) {
            query += ' AND p.product_type_id = ?';
            countQuery += ' AND p.product_type_id = ?';
            queryParams.push(productTypeId);
        }

        if (customerTypeId) {
            query += ' AND pp.customer_type_id = ?';
            countQuery += ' AND pp.customer_type_id = ?';
            queryParams.push(customerTypeId);
        }

        query += ' LIMIT ?, ?';
        queryParams.push((page - 1) * limit, limit);

        const [rows] = await pool.query(query, queryParams);
        const [countResult] = await pool.query(countQuery, queryParams.slice(0, queryParams.length - 2)); // bỏ 2 giá trị limit

        const totalProducts = countResult[0].total;
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({ products: rows, totalPages: totalPages });
    } catch (err) {
        console.error('Lỗi khi lấy dữ liệu sản phẩm:', err);
        res.status(500).send(err);
    }
});

// Lấy thông tin chi tiết sản phẩm
router.get('/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query('SELECT * FROM Products WHERE product_id = ?', [productrId]);
        if (rows.length === 0) return res.status(404).send({ message: 'Không tìm thấy sản phẩm' });
        res.send(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send(err);
    }
});


// Lấy thông tin chi tiết sản phẩm đầy đủ thông tin
router.get('/details/:id', async (req, res) => {
    const productId = req.params.id;
    try {
        const [rows] = await pool.query(
            'SELECT p.product_id as product_id, p.product_name as product_name, pt.product_type_name as product_type_name, pp.unit_price as unit_price, ct.customer_type_name as customer_type_name, p.description as description FROM Products p JOIN ProductTypes pt ON p.product_type_id = pt.product_type_id LEFT JOIN ProductPrices pp ON p.product_id = pp.product_id LEFT JOIN CustomerTypes ct ON pp.customer_type_id = ct.customer_type_id WHERE p.product_id = ?'
            , [productId]);
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

module.exports = router;