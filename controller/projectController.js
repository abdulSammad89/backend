const { SendResponse } = require('../helpers/helpers');
const projectsModel = require('../models/projectModel');

const projectController = {
  get: async (req, res) => {
    try {
      let result = await projectsModel.find();
      res.status(200).send(SendResponse(true, 'Data found !', result));
    } catch (error) {
      res.send(SendResponse(false, 'Data not found !', error));
    }
  },
  getbyid: async (req, res) => {
    try {
      let id = req.params.id;
      let result = await projectsModel.findById(id);
      res
        .status(200)
        .send(SendResponse(true, 'project finded successfully !', result));
    } catch (e) {
      res.status(500).send(SendResponse(false, 'Internal Server Error', e));
    }
  },
  add: async (req, res) => {
    try {
      let { title, description, dueDate } = req.body;
      let obj = { dueDate, description, title };
      // errors should be in this array
      let errArr = [];
      //  error handling
      if (!obj.dueDate) {
        errArr.push('Required dueDate');
      }
      if (!obj.description) {
        errArr.push('Required description');
      }
      if (!obj.title) {
        errArr.push('Required title');
      }
      if (errArr.length > 0) {
        res.send({
          isSuccessfull: false,
          message: 'Validation Error! :(',
          data: errArr,
        });
      } else {
        const project = new projectsModel(obj);
        const result = await project.save();
        res.send({
          isSuccessfull: true,
          message: 'Data Added Scuccessfully',
          data: result,
        });
      }
    } catch (err) {
      res.send({
        isSuccessfull: false,
        message: 'Data not Added',
        data: err,
      });
    }
  },
  markAsDone: async (req, res) => {
    try {
      let projectId = req.params.id;
      const project = await projectsModel.findByIdAndUpdate(
        projectId,
        { status: 'completed' },
        { new: true }
      );
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      return res.json(project);
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  edit: async (req, res) => {
    try {
      const id = req.params.id;
      const { title, description, } = req.body;
      const obj = { title, description, };
      const errArr = [];
      if (!obj.title) {
        errArr.push('Required title');
      }
      if (!obj.description) {
        errArr.push('Required description');
      }
      // if (!obj.dueDate) {
      //   errArr.push('Required due date');
      // }
      if (errArr.length > 0) {
        res
          .status(401)
          .send(SendResponse(false, 'all Crediantials Not Found ', errArr));
      } else {
        const result = await projectsModel.findByIdAndUpdate(id, obj);
        res
          .status(200)
          .send(SendResponse(true, 'Updated Successfully', result));
      }
    } catch (error) {
      res.status(404).send(SendResponse(false, error, null));
    }
  },
  del: async (req, res) => {
    const id = req.params.id;
    try {
      const result = await projectsModel.findByIdAndDelete(id);
      res.status(200).send(SendResponse(true, 'Deleted Successfully', result));
    } catch (error) {
      res.status(404).send(SendResponse(false, error, null));
    }
  },
};

module.exports = projectController;
