const express = require('express');
const voteRouter = express.Router();
const voteController = require('./../controllers/voteController');
const authController = require('./../controllers/authController');

voteRouter.route('/vote').post(authController.protect, authController.checkVoted, voteController.vote);
voteRouter.route('/vote-result').post(authController.protect,authController.checkAdmin, voteController.voteResult);

module.exports = voteRouter;