const express = require('express');
const voteController = require('./../controllers/voteController');
const citizenController = require('./../controllers/citizenController');
const authController = require('./../controllers/authController');
const citizenRouter = express.Router();
citizenRouter.route('/login').post(authController.login);
citizenRouter.route('/signUp').post(authController.checkRegistered, authController.signUp);
citizenRouter.route('/getAll').get(authController.checkAdmin, citizenController.getAll);
citizenRouter.route('/getbyid/:id').get(authController.checkAdmin, citizenController.getbyid);
citizenRouter.route('/updatePassword').patch(authController.protect, authController.updatePassword);
citizenRouter.route('/updateMe').patch(authController.protect,citizenController.updateMe);



module.exports = citizenRouter;