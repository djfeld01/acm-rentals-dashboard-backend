const express = require('express');
const router = express.Router();
const{
    createTenantActivity,
    getFilteredTenantActivity,
    getSingleActivity,
    updateTenanatActivity,
    deleteTenantActivity
} = require('../controllers/tenantActivityController');

router
    .route('/')
    .post(createTenantActivity)
    .get(getFilteredTenantActivity)

router
    .route('/:id')
    .get(getSingleActivity)
    .patch(updateTenanatActivity)
    .delete(deleteTenantActivity)
    
module.exports = router;