const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({path:'./config.env'});
const db = process.env.DATABASE_LOCAL;

mongoose.connect(db,{
    useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
}).then(()=>{
    console.log("database connectionn successfull");
}).catch(()=>{
    console.log("Connection not established. An error Occured");
});

app.listen('4500',()=>{
    console.log("Server is running on port 4500");
})