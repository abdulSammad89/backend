const { SendResponse } = require('../helpers/helpers');
const bcrypt = require('bcryptjs');
const userModel = require('../models/authModel');

const AuthController = {
  signUp: async (req, res) => {
    try {
      let {
        firstName,
        lastName,
        email,
        password,
        contact,
        dateOfBirth,
        gender,
        token,
      } = req.body;
      let obj = {
        firstName,
        lastName,
        email,
        password,
        contact,
        dateOfBirth,
        gender,
        token,
      };

      let errorArray = [];
      if (!obj.firstName) {
        errorArray.push('First name is required');
      }
      if (!obj.lastName) {
        errorArray.push('Last name is required');
      }
      if (!obj.email) {
        errorArray.push('Email address is required');
      }
      if (!obj.password) {
        errorArray.push('Password is required');
      }
      if (!obj.contact) {
        errorArray.push('Contact number is required');
      }
      if (!obj.dateOfBirth) {
        errorArray.push('Date of birth is required');
      }
      if (!obj.gender) {
        errorArray.push('gender is required');
      }
      if (errorArray.length > 0) {
        res
          .status(401)
          .send(SendResponse(false, 'Validation error found !', errorArray));
        return;
      }
      let userExist = await userModel.findOne({ email: obj.email });
      if (userExist) {
        res
          .status(403)
          .send(
            SendResponse(false, 'User is already exist with this email', null)
          );
        return;
      }
      obj.password = await bcrypt.hash(obj.password, 10);
      const user = new userModel(obj);
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
      const existingUser = await userModel.findOne({ email: obj.email });
      if (existingUser) {
        let passwordCorrect = await bcrypt.compare(
          obj.password,
          existingUser.password
        );
        if (passwordCorrect) {
          res.send(SendResponse(true, 'user loged in !', existingUser));
        } else {
          res.send(SendResponse(false, 'password incorrect', null));
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
  getUsers: async (req, res) => {
    try {
      const allUsers = await userModel.find();
      res.status(200).send(SendResponse(true, 'all Users', allUsers));
    } catch (error) {
      res
        .status(404)
        .send(SendResponse(true, 'You are No Rights for this Action', error));
    }
  },
  markAsTeamMember: async (req, res) => {
    try {
      let userId = req.params.id;
      const user = await userModel.findByIdAndUpdate(
        userId,
        { userStatus: 'TeamMember' },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: 'Project not found' });
      }
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

// all apis are created

module.exports = AuthController;
