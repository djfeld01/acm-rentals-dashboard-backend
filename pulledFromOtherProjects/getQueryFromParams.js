    
const getQueryFromParams=(req)=>{
    const {
        lastName,
        firstName,
        school,
        league,
        numericFilters
    } = req.query;
    
    const queryObject={}

    if (lastName){
        queryObject.lastName=lastName
    }
    if (firstName){
        queryObject.firstName=firstName
    }
    if(school){
        queryObject.school=school
    }
    if (league){
        queryObject.league=league
    }
    
    if (numericFilters) {
        const operatorMap = {
        '>': '$gt',
        '>=': '$gte',
        '=': '$eq',
        '<': '$lt',
        '<=': '$lte',
        }
        const regEx = /\b(<|>|>=|=|<|<=)\b/g
        let filters = numericFilters.replace(
        regEx,
        (match) => `-${operatorMap[match]}-`
        )
        console.log(filters)
        const options = ['weightClass', 'seed', 'year', 'points', 'wins', 'losses']
        filters = filters.split(',').forEach((item) => {
        console.log(item)
        const [field, operator, value] = item.split('-')
        if (options.includes(field)) {
            queryObject[field]= { ...queryObject[field], [operator]: Number(value) }
        }
        })
    }
    console.log(queryObject)
    
    return queryObject
}

module.exports = getQueryFromParams