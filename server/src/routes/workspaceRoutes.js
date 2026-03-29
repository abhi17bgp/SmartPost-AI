const express = require('express');
const workspaceController = require('../controllers/workspaceController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(authController.protect);

router.route('/')
  .get(workspaceController.getAllWorkspaces)
  .post(workspaceController.createWorkspace);

router.route('/:id')
  .get(workspaceController.getWorkspace)
  .patch(workspaceController.updateWorkspace)
  .delete(workspaceController.deleteWorkspace);

module.exports = router;
