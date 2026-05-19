import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';

export const addOrderItems = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body;

  if (!orderItems?.length) {
    res.status(400);
    throw new Error('No order items');
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice
  });

  res.status(201).json(order);
});

export const getMyOrders = asyncHandler(async (req, res) => {
  res.json(await Order.find({ user: req.user._id }).sort({ createdAt: -1 }));
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json(order);
});

export const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.id,
    status: req.body.status,
    updateTime: req.body.update_time,
    emailAddress: req.body.payer?.email_address
  };

  const updatedOrder = await order.save();
  
  // Emit real-time update
  const io = req.app.get('io');
  if (io) {
    io.to(`order_${updatedOrder._id}`).emit('order_paid', updatedOrder);
  }

  res.json(updatedOrder);
});

export const getOrders = asyncHandler(async (_req, res) => {
  res.json(await Order.find().populate('user', 'name email').sort({ createdAt: -1 }));
});

export const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();
  const updatedOrder = await order.save();

  // Emit real-time update
  const io = req.app.get('io');
  if (io) {
    io.to(`order_${updatedOrder._id}`).emit('order_delivered', updatedOrder);
  }

  res.json(updatedOrder);
});
