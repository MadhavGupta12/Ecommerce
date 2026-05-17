import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

export const getUsers = asyncHandler(async (_req, res) => {
  res.json(await User.find().select('-password').sort({ createdAt: -1 }));
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ message: 'User removed' });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name ?? user.name;
  user.email = req.body.email ?? user.email;
  user.role = req.body.role ?? user.role;

  res.json(await user.save());
});
