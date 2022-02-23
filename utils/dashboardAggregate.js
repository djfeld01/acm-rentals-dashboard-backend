const TenantActivity = require('../models/TenantActivityModel');
const getDates = require('./getDates');
const groupByDate = require('./groupByDate');

const dashboardAggregate = async (startDate, endDate) => {
  const startDateFormatted = new Date(startDate);
  let endDateFormatted = new Date(endDate);
  endDateFormatted.setDate(endDateFormatted.getDate() + 1);

  const response = await TenantActivity.aggregate([
    {
      $match: {
        $and: [
          { moveDate: { $gte: startDateFormatted, $lt: endDateFormatted } },
        ],
        //$or: [{ activityType: 'MoveIn' }, { activtyType: 'MoveOut' }],
      },
    },
    {
      $group: {
        _id: {
          location: '$location',
          unitType: '$unitType',
          unitSize: '$unitSize',
        },
        moveIns: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveIn'] },
              then: 1,
              else: 0,
            },
          },
        },
        moveOuts: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveOut'] },
              then: 1,
              else: 0,
            },
          },
        },
        net: {
          $sum: {
            $cond: {
              if: { $eq: ['$activityType', 'MoveIn'] },
              then: 1,
              else: {
                $cond: {
                  if: { $eq: ['$activityType', 'MoveOut'] },
                  then: -1,
                  else: 0,
                },
              },
            },
          },
        },
      },
    },
    {
      $group: {
        _id: {
          location: '$_id.location',
        },
        units: {
          $push: {
            unitSize: '$_id.unitSize',
            unitType: '$_id.unitType',
            unitMoveIns: '$moveIns',
            unitMoveOuts: '$moveOuts',
            unitNet: '$net',
          },
        },
        moveIns: {
          $sum: '$moveIns',
        },
        moveOuts: {
          $sum: '$moveOuts',
        },
        net: {
          $sum: '$net',
        },
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: '_id.location',
        foreignField: '_id',
        as: 'locationInfo',
      },
    },
    {
      $sort: {
        'locationInfo.slLocationLocal': 1,
      },
    },
  ]);

  return response;
};

const dashboardAggregate2 = async () => {
  const { today, monthStart, weekStart, yearStart } = getDates();
  const daily = groupByDate(today, 'today');
  const weekly = groupByDate(weekStart, 'week');
  const monthly = groupByDate(monthStart, 'month');
  const annually = groupByDate(yearStart, 'year');

  const response = await TenantActivity.aggregate([
    {
      $match: {
        $and: [{ moveDate: { $gte: yearStart } }],
        //$or: [{ activityType: 'MoveIn' }, { activtyType: 'MoveOut' }],
      },
    },
    {
      $facet: {
        annually,
        monthly,
        weekly,
        daily,
      },
    },
    {
      $project: {
        activityTotals: {
          $concatArrays: ['$annually', '$monthly', '$weekly', '$daily'],
        },
      },
    },
    {
      $unwind: '$activityTotals',
    },
    {
      $group: {
        _id: '$activityTotals._id.location',
        activities: {
          $push: {
            dateRange: '$activityTotals._id.date',
            units: '$activityTotals.units',
            moveIns: '$activityTotals.moveIns',
            moveOuts: '$activityTotals.moveOuts',
            net: '$activityTotals.net',
          },
        },
      },
    },
    {
      $lookup: {
        from: 'locations',
        localField: '_id',
        foreignField: '_id',
        as: 'locationInfo',
      },
    },
    // {
    //   $sort: {
    //     'locationInfo.slLocationLocal': 1,
    //   },
    // },
  ]);
  //console.log(response);
  return response;
};
module.exports = dashboardAggregate2;
