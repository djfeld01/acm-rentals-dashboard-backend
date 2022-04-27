const express = require('express');

const router = express.Router();

const { createUnit } = require('../controllers/unitController');

router.route('/create').post(createUnit);

module.exports = router;
