const projectController = require('../controller/projectController');
const express = require('express');
const route = express.Router();

route.post('/', projectController.add);
route.get('/', projectController.get),
  route.get('/:id', projectController.getbyid);
route.put('/:id', projectController.edit),
  route.put('/:id/markAsDone', projectController.markAsDone);
route.delete('/:id', projectController.del);
route.post('/assign', projectController.assignProject);

module.exports = route;
