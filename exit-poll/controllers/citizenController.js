const Citizen = require('./../models/citizenModel');
const catchAsync = require('./../utils/catchAsync');

const filterObject = function(Obj, ...allowedFeilds) {
    const newObject = {};
    Object.keys(Obj).forEach(el => {
      if (allowedFeilds.includes(el)) {
        newObject[el] = Obj[el];
      }
    });
    return newObject;
  };




exports.getAll = catchAsync(async (req,res,next)=>{
    const citizens = await Citizen.find();
    if(!citizens){
        res.status(404).json({
            status:'error',
            message:'not citizens found'
        });
    }
    res.status(200).json({
        status:'ok',
        citizens
    });
})

exports.getbyid = catchAsync(async (req,res,next)=>{
    const citizen = await Citizen.findById(req.params.id);
    if(!citizen){
        res.status(404).json({
            status:'error',
            message:'not citizen found'
        });
    }
    res.status(200).json({
        status:'ok',
        data:{citizen}
    });
    
});

// exports.updateMe = catchAsync(async (req,res,next)=>{
//     const filter
//     const updateCitizen = await citizen.findByIdAndUpdate(req.body.Aadhar,filterObject,{
//         new:true,
//         runValidators:true
//     });
//     })



exports.updateMe = catchAsync(async (req, res, next) => {
    //if user changing password send error
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError('this page is not for password update. Please go to the password update pasge to update your password',400));
    }
    //filter the data we recive from the object body
    const filteredObject = filterObject(req.body, 'email', 'name');
    //update the information
    const updateCitizen = await Citizen.findByIdAndUpdate(
      req.Citizen.id,
      filteredObject,
      {
        new: true,
        runValidators: true
      }
    );
  
    //send response
    res.status(200).json({
      status: 'success',
      updateCitizen
    });
  });






