const express = require('express');
const AuthController = require("../controller/authController")
const route = express.Router();

route.post('/login', AuthController.login);
route.post('/signup', AuthController.signUp);
route.get('/',AuthController.getUsers);
route.put('/:id/markAsTeamMember' , AuthController.markAsTeamMember)

module.exports = route;
