const Workspace = require('../models/workspaceModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllWorkspaces = catchAsync(async (req, res, next) => {
  const workspaces = await Workspace.find({ owner: req.user.id });
  res.status(200).json({ status: 'success', data: { workspaces } });
});

exports.createWorkspace = catchAsync(async (req, res, next) => {
  const newWorkspace = await Workspace.create({
    name: req.body.name,
    owner: req.user.id
  });
  res.status(201).json({ status: 'success', data: { workspace: newWorkspace } });
});

exports.getWorkspace = catchAsync(async (req, res, next) => {
  const workspace = await Workspace.findOne({ _id: req.params.id, owner: req.user.id });
  if (!workspace) return next(new AppError('No workspace found with that ID', 404));
  res.status(200).json({ status: 'success', data: { workspace } });
});

exports.updateWorkspace = catchAsync(async (req, res, next) => {
  const workspace = await Workspace.findOneAndUpdate(
    { _id: req.params.id, owner: req.user.id },
    req.body,
    { new: true, runValidators: true }
  );
  if (!workspace) return next(new AppError('No workspace found with that ID', 404));
  res.status(200).json({ status: 'success', data: { workspace } });
});

exports.deleteWorkspace = catchAsync(async (req, res, next) => {
  const workspace = await Workspace.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
  if (!workspace) return next(new AppError('No workspace found with that ID', 404));
  res.status(204).json({ status: 'success', data: null });
});
