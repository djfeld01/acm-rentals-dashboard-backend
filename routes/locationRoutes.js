const express = require('express');
const router = express.Router();
const {
  createLocation,
  getLocation,
  updateLocation,
  updateLocationBySlLocationId,
  getAllLocations,
  deleteLocation,
} = require('../controllers/locationController');

router.route('/').post(createLocation).get(getAllLocations);

router
  .route('/:id')
  .get(getLocation)
  .patch(updateLocation)
  .delete(deleteLocation);
router.route('/sl/:id').patch(updateLocationBySlLocationId);
module.exports = router;
