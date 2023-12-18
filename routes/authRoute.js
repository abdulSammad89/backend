const express = require('express');
const AuthController = require("../controller/authController")
const route = express.Router();

route.post('/login', AuthController.login);
route.post('/signup', AuthController.signUp);

module.exports = route;
