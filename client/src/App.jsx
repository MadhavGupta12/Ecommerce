import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useGetMyOrdersQuery } from './services/apiSlice';
import { Toaster, toast } from 'react-hot-toast';

export default function App() {
  const { userInfo } = useSelector((state) => state.auth);
  const { data: myOrders } = useGetMyOrdersQuery(undefined, { skip: !userInfo });

  useEffect(() => {
    if (userInfo && myOrders?.length > 0) {
      // Connect to Socket server
      const socketUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const socket = io(socketUrl);
      
      // Join a socket room for every order this user has made
      myOrders.forEach(order => {
        socket.emit('join_order', order._id);
      });

      socket.on('order_paid', (order) => {
        toast.success(`Live Update: Your order has been successfully PAID!`, { icon: '💵', duration: 5000 });
      });

      socket.on('order_delivered', (order) => {
        toast.success(`Live Update: Your order has just been DELIVERED!`, { icon: '🚚', duration: 6000 });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [userInfo, myOrders]);

  return (
    <div className="min-h-screen bg-linen text-ink dark:bg-stone-900 dark:text-stone-100 transition-colors duration-300">
      <Toaster position="bottom-right" />
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
