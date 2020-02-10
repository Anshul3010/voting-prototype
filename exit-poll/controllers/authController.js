
const citizen = require('./../models/citizenModel');
const catchAsync = require('./../utils/catchAsync');
const Voter = require('./../models/voteModel');
const jwt = require('jsonwebtoken');
const AppError = require('./../utils/AppError');
const { promisify } = require('util');

const generateToken = userID => {
    return jwt.sign({ id: userID }, process.env.JWT_SECERET, {
      expiresIn: process.env.JWT_EXPIRY
    });
  };


exports.signUp = catchAsync(async (req,res,next)=>{
    
   const newCitizen = await citizen.create({
       name:req.body.name,
       age:req.body.age,
       Aadhar:req.body.Aadhar,
       password:req.body.password,
       passwordConfirm:req.body.passwordConfirm
   });

   res.status(200).json({
       status:'created',
       message:'the citizen has been registered'
   });
});

exports.checkVoted = catchAsync( async (req,res,next)=>{
    const checkCitizen = await citizen.findOne({_id:req.Citizen.id});
    if(!checkCitizen){
        return next(new AppError('you are not registered',401));
    }
    const citi = await citizen.findOne({_id:req.Citizen.id,voted:"voted"});
    if(citi){
        return next(new AppError('you have already submitted your response',400));
    }
    next();
        
    
});

exports.checkAdmin = catchAsync( async (req,res,next)=>{
    const isAdmin = await citizen.findOne({Aadhar:req.body.Aadhar}).select('+role');
    if(!(isAdmin.role === 'admin')){
        
        return next(new AppError('you are not authorised to acccess this route',401));
    }
    
    next();
});

exports.checkRegistered = catchAsync( async (req,res,next)=>{
    
    const isRegistered = await citizen.findOne({Aadhar:req.body.Aadhar});
    
    if(!isRegistered){ return next();} 
    res.status(400).json({
        status:'error',
        message:'you are already registered'
    });
});



  exports.protect = catchAsync(async (req, res, next) => {
    let token;
    //check weather there is a token in the request header or not
    if (!req.headers.authorization) {
      return next(new AppError('you are not loged in', 401));
    }
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    //check weathetr the token is valid or not
  
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECERET);
    
  
    // check weather the uswr is deleted or not
    const currentCitizen = await citizen.findById(decoded.id);
    if (!currentCitizen) {
      return next(new AppError('sir, you do not exist', 401));
    }
  
  
    //grant  Access
    req.Citizen = currentCitizen;
    next();
  });

  
  exports.login = catchAsync(async (req, res, next) => {
    const { Aadhar } = req.body;
    const { password } = req.body;
  
    // checking weather the user has entered an Aadhar and the password
    if (!Aadhar || !password) {
      return next(new AppError('please enter an Aadhar and a password', 400));
    }
    // matching the entered Aadhar and password from the database
    const logCitizen = await citizen.findOne({ Aadhar: Aadhar }).select('+password');
  
    if (!logCitizen || (await logCitizen.comparePassword(password, logCitizen.password))) {
      return next(
        new AppError(
          'Entered password and Aadhar does not match with an existing user',
          401
        )
      );
    }
  
    const token = generateToken(logCitizen._id);
    res.status(200).json({
      status: 'success',
      token
    });
  });




  exports.updatePassword = catchAsync(async (req, res, next) => {
    //get current user from the collection
    const updateCitizen = await citizen.findById(req.Citizen.id).select('+password');
  console.log(updateCitizen);
    //check weather the posted current password is correct or not
    if (await updateCitizen.comparePassword(req.body.currentPassword, updateCitizen.password)) {
      return next(new AppError('invalid password entered', 401));
    }
    //update the password
    updateCitizen.password = req.body.password;
    updateCitizen.passwordConfirm = req.body.passwordConfirm;
    await updateCitizen.save();
    //log in the user , send new token
    const token = generateToken(updateCitizen._id);
    res.status(200).json({
      status: 'success',
      token
    });
  });
  
  