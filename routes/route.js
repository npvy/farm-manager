const express = require('express');
const app = express.Router();

const productPricesRouter = require('./productPrices'); 
const customerTypesRouter = require('./customerTypes'); 
const productTypesRouter = require('./productTypes'); 
const productsRouter = require('./products'); 
const customersRouter = require('./customers'); 
const exportsRouter = require('./exports'); 
const inventoryRouter = require('./inventory'); 
const invoicesRouter = require('./invoices'); 

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