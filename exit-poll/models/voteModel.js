const mongoose = require("mongoose");
const voteSchema = mongoose.Schema({
    // Aadhar:{
    //     type: String,
    //     required:[true,' please enter your unique identity number']
    // },
    votedParty:{
        type:String,
        enum:['BJP','congress','AAP','nota'],
        required: [true,'you must vote for something']
    },
    // voted:{
    //     type:String,
    //     default:"voted"
    // }
    
});
voteSchema.post('save',async function(req,res,next){
    this.voted = voted;
    next();
});

const voteModel = mongoose.model('vote',voteSchema);

module.exports = voteModel;