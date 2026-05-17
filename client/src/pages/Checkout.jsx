import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, selectCartTotals } from '../features/cartSlice';
import { useCreateOrderMutation, useGetPaypalConfigQuery, usePayOrderMutation } from '../services/apiSlice';

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotals);
  const { data: paypal } = useGetPaypalConfigQuery();
  const [createOrder] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();
  const [orderId, setOrderId] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paypalOptions = useMemo(() => ({ clientId: paypal?.clientId || 'sb', currency: 'USD' }), [paypal]);

  const placeOrder = async () => {
    const order = await createOrder({
      orderItems: items,
      shippingAddress,
      paymentMethod: 'PayPal',
      ...totals
    }).unwrap();
    setOrderId(order._id);
    return order._id;
  };

  const handleApprove = async (_data, actions) => {
    const details = await actions.order.capture();
    await payOrder({ id: orderId || await placeOrder(), details }).unwrap();
    dispatch(clearCart());
    navigate('/');
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="panel space-y-4">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {Object.keys(shippingAddress).map((field) => (
          <input
            className="input"
            key={field}
            onChange={(e) => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={shippingAddress[field]}
          />
        ))}
        <button className="btn" disabled={!items.length} onClick={placeOrder} type="button">Create order</button>
      </section>
      <aside className="panel h-fit space-y-4">
        <h2 className="text-xl font-bold">Pay with PayPal</h2>
        <p className="flex justify-between font-semibold"><span>Total</span><span>${totals.totalPrice.toFixed(2)}</span></p>
        <PayPalScriptProvider options={paypalOptions}>
          <PayPalButtons
            createOrder={async (_data, actions) => {
              if (!orderId) await placeOrder();
              return actions.order.create({ purchase_units: [{ amount: { value: totals.totalPrice.toFixed(2) } }] });
            }}
            onApprove={handleApprove}
          />
        </PayPalScriptProvider>
      </aside>
    </div>
  );
}
