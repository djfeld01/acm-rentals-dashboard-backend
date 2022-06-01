const express = require('express');

const router = express.Router();

const {
  addUnitOccupancy,
  addManyUnitOccupancies,
  updateUnitOccupancy,
  getUnitOccupancy,
  deleteUnitOccupancy,
} = require('../controllers/unitOccupancyController');

router.route('/').post(addUnitOccupancy);
router.route('/addMany').post(addManyUnitOccupancies);
router
  .route('/:id')
  .get(getUnitOccupancy)
  .patch(updateUnitOccupancy)
  .delete(deleteUnitOccupancy);

module.exports = router;
