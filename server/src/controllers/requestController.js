const Request = require('../models/requestModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.createRequest = catchAsync(async (req, res, next) => {
  const newRequest = await Request.create(req.body);
  res.status(201).json({ status: 'success', data: { request: newRequest } });
});

exports.getRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findById(req.params.id);
  if (!request) return next(new AppError('No request found with that ID', 404));
  res.status(200).json({ status: 'success', data: { request } });
});

exports.updateRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!request) return next(new AppError('No request found with that ID', 404));
  res.status(200).json({ status: 'success', data: { request } });
});

exports.deleteRequest = catchAsync(async (req, res, next) => {
  const request = await Request.findByIdAndDelete(req.params.id);
  if (!request) return next(new AppError('No request found with that ID', 404));
  res.status(200).json({ status: 'success', data: null });
});
