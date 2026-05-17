import { Truck } from 'lucide-react';
import { useDeliverOrderMutation, useGetOrdersQuery } from '../services/apiSlice';

export default function AdminOrders() {
  const { data: orders = [] } = useGetOrdersQuery();
  const [deliverOrder] = useDeliverOrderMutation();

  return (
    <section className="panel overflow-x-auto">
      <h1 className="mb-4 text-3xl font-bold">Order management</h1>
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead><tr className="border-b"><th className="py-3">Customer</th><th>Total</th><th>Paid</th><th>Delivered</th><th></th></tr></thead>
        <tbody>
          {orders.map((order) => (
            <tr className="border-b last:border-0" key={order._id}>
              <td className="py-3 font-medium">{order.user?.name}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>{order.isPaid ? 'Yes' : 'No'}</td>
              <td>{order.isDelivered ? 'Yes' : 'No'}</td>
              <td><button className="btn-secondary" disabled={order.isDelivered} onClick={() => deliverOrder(order._id)} type="button"><Truck size={18} /></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
