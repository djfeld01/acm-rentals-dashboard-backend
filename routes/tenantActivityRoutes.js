const express = require('express');
const router = express.Router();
const {
  createTenantActivity,
  getFilteredTenantActivity,
  getSingleActivity,
  updateTenanatActivity,
  deleteTenantActivity,
  getFilteredTenantActivityTotals,
  getActivitiesByEmployee,
  getDashboardActivity,
  addManyTenantActivities,
  getFilteredTenantActivityTotaledByDay,
  getFilteredTenantActivityTotaledByMonth,
} = require('../controllers/tenantActivityController');

router.route('/').post(createTenantActivity).get(getFilteredTenantActivity);
router.route('/addMany').post(addManyTenantActivities);

router.route('/employee').get(getActivitiesByEmployee);
router.route('/dashboard').get(getDashboardActivity);
router.route('/totals').get(getFilteredTenantActivityTotals);
router.route('/dailyTotals').get(getFilteredTenantActivityTotaledByDay);
router.route('/monthlyTotals').get(getFilteredTenantActivityTotaledByMonth);
router
  .route('/:id')
  .get(getSingleActivity)
  .patch(updateTenanatActivity)
  .delete(deleteTenantActivity);

module.exports = router;
