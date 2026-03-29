const History = require('../models/historyModel');
const catchAsync = require('../utils/catchAsync');

exports.getHistory = catchAsync(async (req, res, next) => {
  const history = await History.find({ userId: req.user.id }).sort('-createdAt').limit(100);
  res.status(200).json({ status: 'success', data: { history } });
});

exports.createHistory = catchAsync(async (req, res, next) => {
  const newHistory = await History.create({
    userId: req.user.id,
    method: req.body.method,
    url: req.body.url,
    status: req.body.status,
    timeTaken: req.body.timeTaken,
    headers: req.body.headers || [],
    queryParams: req.body.queryParams || [],
    bodyMode: req.body.bodyMode || 'json',
    bodyContent: req.body.bodyContent || '',
    responseData: req.body.responseData,
    responseHeaders: req.body.responseHeaders
  });
  res.status(201).json({ status: 'success', data: { history: newHistory } });
});

exports.clearHistory = catchAsync(async (req, res, next) => {
  await History.deleteMany({ userId: req.user.id });
  res.status(204).json({ status: 'success', data: null });
});

exports.deleteHistory = catchAsync(async (req, res, next) => {
  const historyItem = await History.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  if (!historyItem) {
    return next(new AppError('No history item found with that ID', 404));
  }
  res.status(204).json({ status: 'success', data: null });
});

exports.updateHistory = catchAsync(async (req, res, next) => {
  const historyItem = await History.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    req.body,
    { new: true }
  );
  if (!historyItem) {
    return next(new AppError('No history item found with that ID', 404));
  }
  res.status(200).json({ status: 'success', data: { history: historyItem } });
});
