const Collection = require('../models/collectionModel');
const Request = require('../models/requestModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');

exports.getAllCollections = catchAsync(async (req, res, next) => {
  const { workspaceId } = req.query;
  if (!workspaceId) {
    return next(new AppError('Please provide a workspaceId', 400));
  }
  
  const collections = await Collection.find({ workspaceId });
  // Also fetch nested requests for these collections
  const requests = await Request.find({ collectionId: { $in: collections.map(c => c._id) } });

  res.status(200).json({ status: 'success', data: { collections, requests } });
});

exports.createCollection = catchAsync(async (req, res, next) => {
  const newCollection = await Collection.create(req.body);
  res.status(201).json({ status: 'success', data: { collection: newCollection } });
});

exports.updateCollection = catchAsync(async (req, res, next) => {
  const collection = await Collection.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!collection) return next(new AppError('No collection found with that ID', 404));
  res.status(200).json({ status: 'success', data: { collection } });
});

exports.deleteCollection = catchAsync(async (req, res, next) => {
  const collection = await Collection.findByIdAndDelete(req.params.id);
  if (!collection) return next(new AppError('No collection found with that ID', 404));
  res.status(200).json({ status: 'success', data: null });
});
