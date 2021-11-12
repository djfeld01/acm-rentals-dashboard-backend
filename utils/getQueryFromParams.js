const moment=require('moment')

const getQueryFromParams=(req)=>{
    const {
        location,
        activityType,
        startDate,
        endDate,
        employeeInitials,
        insurance,
        unitSize,
        unitType,
        unitArea,
        tenantName
    } = req.query;
    
    const queryObject={}

    if (tenantName){
        queryObject.tenantName=tenantName
    }
    if (location){
        queryObject.location=location
    }
    if(activityType){
        queryObject.activityType=activityType
    }
    if (employeeInitials){
        queryObject.employeeInitials=employeeInitials
    }
    if (insurance){
        queryObject.insurance=insurance
    }
    if (unitSize){
        queryObject.unitSize=unitSize
    }
    if (unitType){
        queryObject.unitType=unitType
    }
    if (unitArea){
        queryObject.unitArea=unitArea
    }

    if (startDate && endDate){
        queryObject.moveDate={
            $gte: moment(startDate).utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ"),
            $lt: moment(endDate).add(1,"days").utcOffset('+0000').format("YYYY-MM-DDTHH:mm:ss.SSSZ")
        }
    }
    
    // if (numericFilters) {
    //     const operatorMap = {
    //     '>': '$gt',
    //     '>=': '$gte',
    //     '=': '$eq',
    //     '<': '$lt',
    //     '<=': '$lte',
    //     }
    //     const regEx = /\b(<|>|>=|=|<|<=)\b/g
    //     let filters = numericFilters.replace(
    //     regEx,
    //     (match) => `-${operatorMap[match]}-`
    //     )
    //     console.log(filters)
    //     const options = ['weightClass', 'seed', 'year', 'points', 'wins', 'losses']
    //     filters = filters.split(',').forEach((item) => {
    //     console.log(item)
    //     const [field, operator, value] = item.split('-')
    //     if (options.includes(field)) {
    //         queryObject[field]= { ...queryObject[field], [operator]: Number(value) }
    //     }
    //     })
    // }
    console.log(queryObject)
    
    return queryObject
}

module.exports = getQueryFromParams