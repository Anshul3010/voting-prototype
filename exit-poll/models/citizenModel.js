const  mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const catchAsync = require('./../utils/catchAsync');
const validator = require('validator');

const citizenSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true,'A citizen must have a name']
    },
    // email:{
    //     type:String,
    //     required: [true, 'A user must have a name'],
    //     unique: [true, 'A email must be unique'],
    //     lowercase: true,
    //     validate: [validator.isEmail, 'please provide a valid email']
    // },
    role:{
        type:String,
        enum:['admin','voter'],
        default:'voter',
        select:false
    },
    
    Aadhar:{
        type: String,
        required: [true,'please enter a unique identity number'],
        unique:[true,'Aadhar number must be a unique number']
        // maxlength:[10,'this feild cannot hold than more the 10 characters'],
        // minlength:[10,'this feild cannot hold less than 10 characters']
    },
    age:{
        type: Number,
        default:18,
    },
    password:{
        type: String,
        required:[true,'please enter a password'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'please re-enter the above entered password'],
        validate:{
            validator: function(value){
                return this.password === value;
            },
            message:'the above entered password does not match with the the previously entered password'
        }
    },
    voted:{
            type:String,
            default:"not-voted"
        }
    
});

citizenSchema.pre('save',async function(req,res,next){
    if(!this.isModified('password')) {return next();}
    
    this.password = await bcrypt.hash(this.password,12);
    console.log(this.password);
    this.passwordConfirm = undefined;
    next();
});

citizenSchema.methods.comparePassword = (async function(enteredPasssword,realPassword) {
    try{
    const valu = await bcrypt.compare(enteredPasssword, realPassword);
    console.log("from camparePassword "+ !valu)
    return !valu;
    }catch(err){
        return next(err)
    }
  });


const citizenModel = mongoose.model('citizen',citizenSchema);

module.exports = citizenModel;
