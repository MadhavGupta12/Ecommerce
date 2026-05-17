import asyncHandler from 'express-async-handler';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

export const getDashboardStats = asyncHandler(async (_req, res) => {
  const [orders, products, users, paidOrders, monthlySales] = await Promise.all([
    Order.countDocuments(),
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({ isPaid: true }),
    Order.aggregate([
      { $match: { isPaid: true } },
      {
        $group: {
          _id: { month: { $month: '$paidAt' }, year: { $year: '$paidAt' } },
          sales: { $sum: '$totalPrice' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ])
  ]);

  const revenue = paidOrders.reduce((sum, order) => sum + order.totalPrice, 0);

  res.json({ orders, products, users, revenue, monthlySales });
});
