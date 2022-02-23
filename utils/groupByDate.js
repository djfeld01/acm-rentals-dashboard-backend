const groupByDate = (date, desc) => {
  const response = [
    {
      $match: {
        $and: [{ moveDate: { $gte: date } }],
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
          date: desc,
        },
        units: {
          $push: {
            unitType: '$_id.unitType',
            unitSize: '$_id.unitSize',
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
  ];

  return response;
};

module.exports = groupByDate;
