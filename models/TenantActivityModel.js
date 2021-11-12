const mongoose= require('mongoose');

const TenantActivitySchema= new mongoose.Schema({
    location:{
        type: mongoose.Types.ObjectId,
        ref: 'Location',
    },
    activityType:{
        type: String,
        required: [true, `Please provide the activity type`],
        enum:{
            values: ['MoveIn', 'MoveOut', 'Transfer'],
            message: '{VALUE} must be MoveIn, MoveOut or Transfer'
        },
        trim: true
    },
    moveDate:{
        type: Date,
        required: [true, `Please provide the move date`]
    },
    unitName: {
        type:String,
        required: [true, `Please provide the Unit Name`],
        trim: true
    },
    tenantName: {
        type: String,
        required: [true, `Please Provide the Tenant Name`],
        trim: true
    },
    unitArea: {
        type: Number,
        required: [true, `Please Provide the Unit Area`]
    },
    unitSize: {
        type: String,
        required: [true, `Please provide the unit size`],
        trim: true
    },
    unitType: {
        type: String,
        required: [true, `Please provide the unitType`],
        trim: true
    },
    moveInRate:{
        type: Number,
        required: [true, `Please Provide the moveInRate`]
    },
    insurance:{
        type: Boolean,
        default: false
    },
    employeeInitials: {
        type:String,
        //required: [true, `Please provide the employee initials`],
        trim: true
    },
    onlineSource: {
        type:String,
        trim: true
    }

})

module.exports = mongoose.model('TenantActivity', TenantActivitySchema);