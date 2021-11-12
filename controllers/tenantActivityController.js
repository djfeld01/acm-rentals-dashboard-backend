const TenantActivity = require('../models/TenantActivityModel');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const getQueryFromParams =  require ('../utils/getQueryFromParams')

const createTenantActivity= async (req,res)=>{
    const {tenantName, moveDate}=req.body;
    const activityAlreadyExists= await TenantActivity.findOne({ tenantName, moveDate })
    if (activityAlreadyExists){
        throw new CustomError.BadRequestError('This Tenant Activity already exists'); 
    }
    const tenantActivity= await TenantActivity.create(req.body)
    res.status(StatusCodes.CREATED).json({tenantActivity})
}

const getFilteredTenantActivity= async (req,res)=>{

    const queryObject=getQueryFromParams(req);
    console.log(queryObject)
    const tenantActivities= await TenantActivity.find(queryObject).sort('moveDate')
    res.status(StatusCodes.OK).json ({tenantActivities, count: tenantActivities.length})
}

const getSingleActivity = async (req,res)=>{
    const {id:activityId}=req.params;

    const activity= await TenantActivity.findOne({
        _id: activityId
    })

    if (!activity){
        throw new CustomError.NotFoundError (`No Location found with id: ${activityId}`)
    }

    res.status(StatusCodes.OK).json({activity})
}

const updateTenanatActivity=async(req,res)=>{
    const {id: activityId} = req.params
    const activity= await TenantActivity.findOneAndUpdate({_id: activityId}, req.body, {
        new: true,
        runValidators: true
    })

    if (!activity){
        throw new CustomError.NotFoundError(`No Location found with id: ${activityId}`)
    }

    res.status(StatusCodes.OK).json({activity})
}

const deleteTenantActivity=async(req,res)=>{
    const {id: activityId} = req.params
    const activity= await TenantActivity.findOne({_id: activityId})

    if (!activity){
        throw new CustomError.NotFoundError(`No Location found with id: ${activityId}`)
    }
    activity.remove();
    res.status(StatusCodes.OK).json({msg: `Success! Tenant Activity Removed`})
}

module.exports={
    createTenantActivity,
    getFilteredTenantActivity,
    getSingleActivity,
    updateTenanatActivity,
    deleteTenantActivity,
}