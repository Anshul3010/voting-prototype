const Voter = require('../models/voteModel');
const catchAsync = require('./../utils/catchAsync');
const Citizen = require('./../models/citizenModel');


exports.vote = catchAsync (async (req,res,next)=>{
    
    // const voter = await Voter.create({Aadhar:req.body.Aadhar,
    //     votedParty:req.body.votedParty});
     const voter = await Voter.create({votedParty:req.body.votedParty});
    // const citizen = await Citizen.findOne({Aadhar:req.body.Aadhar});
    console.log("hoho");
    const citi = await Citizen.updateOne({_id:req.Citizen.id},{$set:{voted:"voted"}});
    console.log("haha");
    //await citi.save();
    console.log("hehe");
    

    res.status(200).json({
        status:'ok',
        message:'your response has been submitted'
    });
})

exports.voteResult = catchAsync(async (req,res)=>{
    const result = await Voter.aggregate([
        {
            $group:{
                _id:'$votedParty',
                count:{$sum: 1 }
            }
        }
    ]);
    res.status(200).json({
        status:'success',
        data: {result}
    });
});

