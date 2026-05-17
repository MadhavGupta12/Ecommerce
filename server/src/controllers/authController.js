import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const sendUser = (res, user, statusCode = 200) => {
  const token = generateToken(res, user._id);
  res.status(statusCode).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token
  });
};

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password });
  sendUser(res, user, 201);
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    sendUser(res, user);
    return;
  }

  res.status(401);
  throw new Error('Invalid email or password');
});

export const logoutUser = (_req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out successfully' });
};

export const getProfile = asyncHandler(async (req, res) => {
  res.json(req.user);
});
