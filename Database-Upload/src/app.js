const express = require('express');
const cors = require('cors');

const app = express();
const routes = require('../src/routes');


app.use('/archive',express.static('archive'))
app.use(cors());
app.use(express.json());
app.use(routes);


module.exports = app;