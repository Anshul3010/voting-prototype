const express = require("express");
const app = express();
const citizenRouter = require('./routes/citizenRoute');
const voteRouter = require('./routes/voteRoute');
const globalErrorHandler = require('./utils/global-error-handler');

app.use(express.json());

app.use('/api/v1/citizen',citizenRouter);
app.use('/api/v1/vote',voteRouter);
// app.use('*',function(req,res){
// res.status(404).json({
//         message:'the route which you are currently trying to access does not exist. Please enter a valid route'
//     });
// });
app.use(globalErrorHandler);

module.exports = app;