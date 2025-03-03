const express = require('express');
const app = express.Router();

const productPricesRouter = require('./productPrices'); // Đảm bảo đường dẫn chính xác
const customerTypesRouter = require('./customerTypes'); // Đảm bảo đường dẫn chính xác
const productTypesRouter = require('./productTypes'); // Đảm bảo đường dẫn chính xác
const productsRouter = require('./products'); // Đảm bảo đường dẫn chính xác
const customersRouter = require('./customers'); // Đảm bảo đường dẫn chính xác
const exportsRouter = require('./exports'); // Đảm bảo đường dẫn chính xác
const inventoryRouter = require('./inventory'); // Đảm bảo đường dẫn chính xác
const invoicesRouter = require('./invoices'); // Đảm bảo đường dẫn chính xác

app.use(express.json());
app.use('/product-prices', productPricesRouter);
app.use('/customer-types', customerTypesRouter);
app.use('/product-types', productTypesRouter);
app.use('/products', productsRouter);
app.use('/customers', customersRouter);
app.use('/exports', exportsRouter);
app.use('/inventory', inventoryRouter);
app.use('/invoices', invoicesRouter);

module.exports = app;