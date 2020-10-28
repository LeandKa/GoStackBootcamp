const express = require('express');


const router = express.Router();
const upload = require('../src/util/multer');

const TransactionsControllers = require('./controllers/TransactionsController');


router.get('/transactions',TransactionsControllers.index);
router.post('/transactions',TransactionsControllers.create);
router.delete('/incidents/:id',TransactionsControllers.delete);
router.post('/transactions/import',upload.single("archive"),TransactionsControllers.import);


module.exports = router