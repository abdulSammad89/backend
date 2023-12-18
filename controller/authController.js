const { SendResponse } = require('../helpers/helpers');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const AuthModel = require('../models/authModel');

const AuthController = {
  signUp: async (req, res) => {
    try {
      const { email, password, firstName, lastName } = req.body;
      const obj = { email, password, firstName, lastName };
      const errArr = [];
      if (!obj.email) {
        errArr.push('Username is required');
      }
      if (!obj.password) {
        errArr.push('Password is required');
      }
      if (!obj.firstName) {
        errArr.push('firstName is required');
      }
      if (!obj.lastName) {
        errArr.push('lastName is required');
      }
      if (errArr.length > 0) {
        res.send(SendResponse(false, 'Crediantials Not Found', errArr));
      }

      const checkUser = await AuthModel.findOne({ email: obj.email });
      if (checkUser) {
        res.send(SendResponse(false, 'User Already Exist', null));
        return;
      }
      obj.password = await bcrypt.hash(obj.password, 10);
      const user = new AuthModel(obj);
      const result = await user.save();
      if (result) {
        res.send(SendResponse(true, 'User Created Successfully', result));
      }
    } catch (error) {
      res.status(404).send(SendResponse(false, error, null));
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const obj = { email, password };
      const existingUser = await AuthModel.findOne({ email: obj.email });
      if (existingUser) {
        let passwordCorrect = await bcrypt.compare(obj.password , existingUser.password)
        if (passwordCorrect) {
            res.send(SendResponse(true , "user loged in !" , existingUser))
        } else {
            res.send(SendResponse(false , "password incorrect" , null))
        }
      } else {
        res
          .status(404)
          .send(SendResponse(false, 'Your Email is invalid', null));
      }
    } catch (error) {
      res.status(500).send(SendResponse(false, 'Internal Server Error', error));
    }
  },
};

module.exports = AuthController;
