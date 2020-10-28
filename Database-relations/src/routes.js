
const express = require('express');


const CustomerController = require('./controllers/CustomerController');
const ProductController = require('./controllers/ProductController');
const OrderController = require('./controllers/OrderControllers');

const routes = new express.Router();



routes.post('/customers',CustomerController.create);
routes.get('/customers',CustomerController.index);


routes.post('/products',ProductController.create);
routes.get('/products',ProductController.index);


routes.post('/orders',OrderController.create);
routes.get('/orders/:id',OrderController.index);



module.exports = routes;





