import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearCart, selectCartTotals } from '../features/cartSlice';
import { useCreateOrderMutation, useGetPaypalConfigQuery, usePayOrderMutation } from '../services/apiSlice';

export default function Checkout() {
  const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [message, setMessage] = useState('');
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotals);
  const { data: paypal } = useGetPaypalConfigQuery();
  const [createOrder] = useCreateOrderMutation();
  const [payOrder] = usePayOrderMutation();
  const [orderId, setOrderId] = useState('');
  const orderIdRef = useRef('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const paypalClientId = paypal?.clientId && paypal.clientId !== 'your_paypal_client_id' ? paypal.clientId : 'sb';
  const paypalOptions = useMemo(() => ({ clientId: paypalClientId, currency: 'USD' }), [paypalClientId]);
  const hasShippingAddress = Object.values(shippingAddress).every(Boolean);

  const placeOrder = async () => {
    if (!items.length) {
      throw new Error('Your cart is empty.');
    }

    if (!hasShippingAddress) {
      throw new Error('Complete the shipping address before payment.');
    }

    if (orderIdRef.current) {
      return orderIdRef.current;
    }

    const order = await createOrder({
      orderItems: items,
      shippingAddress,
      paymentMethod: 'PayPal',
      ...totals
    }).unwrap().catch((error) => {
      throw new Error(getErrorMessage(error));
    });

    orderIdRef.current = order._id;
    setOrderId(order._id);
    setMessage(`Order ${order._id} created. Complete PayPal payment to mark it paid.`);
    return order._id;
  };

  const handleApprove = async (_data, actions) => {
    try {
      const details = await actions.order.capture();
      const appOrderId = orderIdRef.current || orderId;

      if (!appOrderId) {
        throw new Error('Create the order before paying.');
      }

      await payOrder({ id: appOrderId, details }).unwrap();
      dispatch(clearCart());
      navigate('/');
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  const handleCreateOrder = async () => {
    try {
      await placeOrder();
    } catch (error) {
      setMessage(getErrorMessage(error));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
      <section className="panel space-y-4">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {message && <p className="rounded-md bg-stone-100 px-3 py-2 text-sm text-stone-700">{message}</p>}
        {Object.keys(shippingAddress).map((field) => (
          <input
            className="input"
            key={field}
            onChange={(e) => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
            placeholder={field.replace(/([A-Z])/g, ' $1')}
            value={shippingAddress[field]}
          />
        ))}
        <button className="btn" disabled={!items.length || !hasShippingAddress || Boolean(orderId)} onClick={handleCreateOrder} type="button">
          {orderId ? 'Order created' : 'Create order'}
        </button>
      </section>
      <aside className="panel h-fit space-y-4">
        <h2 className="text-xl font-bold">Pay with PayPal</h2>
        <p className="flex justify-between font-semibold"><span>Total</span><span>${totals.totalPrice.toFixed(2)}</span></p>
        {!hasShippingAddress && <p className="text-sm text-stone-600">Enter shipping details to create an order.</p>}
        {hasShippingAddress && !orderId && <p className="text-sm text-stone-600">Create the order first, then PayPal payment will unlock.</p>}
        <PayPalScriptProvider key={paypalClientId} options={paypalOptions}>
          <PayPalButtons
            createOrder={async (_data, actions) => {
              if (!orderIdRef.current && !orderId) {
                throw new Error('Create the order before paying.');
              }
              return actions.order.create({ purchase_units: [{ amount: { value: totals.totalPrice.toFixed(2) } }] });
            }}
            disabled={!items.length || !hasShippingAddress || !orderId}
            onCancel={() => setMessage('Payment was cancelled. Your order is still created and can be paid again.')}
            onError={(error) => setMessage(getErrorMessage(error))}
            onApprove={handleApprove}
          />
        </PayPalScriptProvider>
      </aside>
    </div>
  );
}

function getErrorMessage(error) {
  return error?.data?.message || error?.error || error?.message || 'Something went wrong. Please try again.';
}
