const express = require('express');

const router = express.Router();

const {
  createUnit,
  getUnit,
  updateUnit,
  deleteUnit,
} = require('../controllers/unitController');

router.route('/').post(createUnit);
router.route('/:id').get(getUnit).patch(updateUnit).delete(deleteUnit);

module.exports = router;
