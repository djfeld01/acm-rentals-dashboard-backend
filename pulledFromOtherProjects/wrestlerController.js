const Wrestler = require("../models/wrestlerModel");
const getQueryFromParams= require ('../utils/getQueryFromParams')
const shuffleArray= require ('../utils/shuffleArray')
const { StatusCodes } = require("http-status-codes");
const {ObjectId} = require ('mongoose')

const createWrestler = async (req, res) => {
  const wrestler = await Wrestler.create(req.body);
  res.status(StatusCodes.CREATED).send({ wrestler });
};

const getAllWrestlers = async (req, res) => {  
  const wrestlers = await Wrestler.find({});
  res.status(StatusCodes.OK).send({ wrestlers, count: wrestlers.length });
};

const getWrestlersFiltered = async (req, res) => {
  console.log(req.query)
  const queryObject=getQueryFromParams(req);
  const wrestlers = await Wrestler.find(queryObject);
  
  const avgPoints=Math.round((wrestlers.reduce((total, next)=>total+next.points,0)/wrestlers.length) * 1000 + Number.EPSILON) / 1000
  
  res.status(StatusCodes.OK).send({ wrestlers , count: wrestlers.length, avgPoints });
}


const getListOfWrestlers = async (req,res)=>{
  const {wrestlerIdList} = req.body;
  //const wrestlerIdListObject= wrestlerIdList.map(function (item){ return ObjectId(item)})
  console.log(wrestlerIdList)
  const wrestlers=await Wrestler.find( {'_id': {$in: wrestlerIdList}}  )
  res.status(StatusCodes.OK).send({wrestlers, count: wrestlers.length})
}


const getShuffledWrestlerIds = async (req, res) => {
  console.log(req.query)
  const queryObject=getQueryFromParams(req);
  const wrestlers = await Wrestler.find(queryObject);
  const wrestlerIds=wrestlers.map(wrestler=>wrestler._id)
  const shuffledWrestlers=shuffleArray(wrestlerIds)

  res.status(StatusCodes.OK).send({ shuffledWrestlers , count: wrestlers.length});
}

const getWrestler= async (req, res)=>{
  const {id:wrestlerId} = req.params;

  const wrestler= await Wrestler.findOne({
        _id: wrestlerId
  })

  if(!wrestler) {
        throw new CustomError.NotFoundError(`No deck found with id : ${wrestlerId}`)
  }

  res.status(StatusCodes.OK).send(wrestler)
}

module.exports = {
  createWrestler,
  getAllWrestlers,
  getWrestlersFiltered,
  getShuffledWrestlerIds,
  getListOfWrestlers,getWrestler
};
