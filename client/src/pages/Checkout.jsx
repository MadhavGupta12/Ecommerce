import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, ShoppingCart, CreditCard, ChevronRight, Check } from 'lucide-react';
import { clearCart, selectCartTotals } from '../features/cartSlice';
import { useCreateOrderMutation, useGetPaypalConfigQuery, usePayOrderMutation } from '../services/apiSlice';

const steps = [
  { id: 1, name: 'Shipping', icon: MapPin },
  { id: 2, name: 'Review', icon: ShoppingCart },
  { id: 3, name: 'Payment', icon: CreditCard }
];

export default function Checkout() {
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState({ address: '', city: '', postalCode: '', country: '' });
  const [message, setMessage] = useState('');
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotals);
  const { data: paypal } = useGetPaypalConfigQuery();
  const [createOrder, { isLoading: isCreatingOrder }] = useCreateOrderMutation();
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
    setMessage(`Order ${order._id} created! Proceed to PayPal to complete your payment.`);
    setStep(3); // Auto-advance to payment step
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

  const handleNextStep = () => {
    if (step === 1 && !hasShippingAddress) {
      setMessage('Please fill out all shipping fields.');
      return;
    }
    setMessage('');
    setStep((s) => s + 1);
  };

  const handlePrevStep = () => {
    setMessage('');
    setStep((s) => s - 1);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Visual Stepper */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-5 dark:border-stone-800">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          const isCompleted = step > s.id;
          const isActive = step === s.id;
          
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-initial">
              <div className="flex items-center gap-3">
                <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                  isCompleted ? 'bg-moss text-white' : 
                  isActive ? 'bg-brass text-white' : 
                  'bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-600'
                }`}>
                  {isCompleted ? <Check size={18} /> : <Icon size={18} />}
                </span>
                <span className={`hidden sm:inline font-semibold ${isActive ? 'text-brass' : 'text-stone-500'}`}>
                  {s.name}
                </span>
              </div>
              {idx < steps.length - 1 && (
                <div className="flex-1 mx-4 h-[2px] bg-stone-200 dark:bg-stone-800">
                  <div className={`h-full bg-moss transition-all duration-300 ${isCompleted ? 'w-full' : 'w-0'}`} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {message && (
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg bg-stone-100 px-4 py-3 text-sm text-stone-700 dark:bg-stone-800 dark:text-stone-300"
        >
          {message}
        </motion.p>
      )}

      {/* Wizard Content */}
      <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.section 
                key="step-shipping"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="panel space-y-4 dark:bg-stone-900/50"
              >
                <h2 className="text-2xl font-bold flex items-center gap-2"><MapPin size={22} className="text-brass"/> Shipping Details</h2>
                <div className="space-y-4">
                  {Object.keys(shippingAddress).map((field) => (
                    <div key={field} className="space-y-1">
                      <label className="text-xs uppercase tracking-wide text-stone-500 font-bold block">{field.replace(/([A-Z])/g, ' $1')}</label>
                      <input
                        className="input"
                        onChange={(e) => setShippingAddress({ ...shippingAddress, [field]: e.target.value })}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1).replace(/([A-Z])/g, ' $1')}
                        value={shippingAddress[field]}
                      />
                    </div>
                  ))}
                </div>
                <div className="pt-4">
                  <button className="btn w-full flex items-center justify-center gap-2" onClick={handleNextStep} type="button">
                    Continue to Review <ChevronRight size={18} />
                  </button>
                </div>
              </motion.section>
            )}

            {step === 2 && (
              <motion.section 
                key="step-review"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="panel space-y-6 dark:bg-stone-900/50"
              >
                <h2 className="text-2xl font-bold flex items-center gap-2"><ShoppingCart size={22} className="text-brass"/> Review Order</h2>
                
                {/* Cart Summary */}
                <div className="divide-y divide-stone-100 dark:divide-stone-800">
                  {items.map((item) => (
                    <div key={item.product} className="flex gap-4 py-3 items-center">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                      <div className="flex-1">
                        <h4 className="font-bold text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-stone-500">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Delivery Address Snapshot */}
                <div className="p-4 rounded-lg bg-stone-50 dark:bg-stone-800/50 space-y-2">
                  <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">Shipping To</h4>
                  <p className="text-sm">
                    {shippingAddress.address}, {shippingAddress.city}, {shippingAddress.postalCode}, {shippingAddress.country}
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button className="btn-secondary flex-1" onClick={handlePrevStep} type="button">Back</button>
                  <button 
                    className="btn flex-1 flex items-center justify-center gap-2" 
                    disabled={!items.length || isCreatingOrder} 
                    onClick={handleCreateOrder} 
                    type="button"
                  >
                    {isCreatingOrder ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </motion.section>
            )}

            {step === 3 && (
              <motion.section 
                key="step-payment"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="panel space-y-6 dark:bg-stone-900/50"
              >
                <h2 className="text-2xl font-bold flex items-center gap-2"><CreditCard size={22} className="text-brass"/> Payment</h2>
                
                <div className="p-4 rounded-lg bg-moss/10 text-moss border border-moss/20">
                  <p className="text-sm font-semibold">✓ Order placed successfully!</p>
                  <p className="text-xs mt-1">Please complete the payment below to finalize your purchase.</p>
                </div>

                <div className="space-y-4">
                  <PayPalScriptProvider key={paypalClientId} options={paypalOptions}>
                    <PayPalButtons
                      createOrder={async (_data, actions) => {
                        if (!orderIdRef.current && !orderId) {
                          throw new Error('Create the order before paying.');
                        }
                        return actions.order.create({ purchase_units: [{ amount: { value: totals.totalPrice.toFixed(2) } }] });
                      }}
                      disabled={!items.length || !orderId}
                      onCancel={() => setMessage('Payment was cancelled. Your order is still created and can be paid again.')}
                      onError={(error) => setMessage(getErrorMessage(error))}
                      onApprove={handleApprove}
                    />
                  </PayPalScriptProvider>
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>

        {/* Order Totals Summary */}
        <aside className="panel h-fit space-y-4 dark:bg-stone-900/50 sticky top-24">
          <h3 className="text-lg font-bold">Order Summary</h3>
          <div className="space-y-2 text-sm border-b border-stone-100 pb-4 dark:border-stone-800">
            <p className="flex justify-between text-stone-600 dark:text-stone-400"><span>Subtotal</span><span>${totals.itemsPrice.toFixed(2)}</span></p>
            <p className="flex justify-between text-stone-600 dark:text-stone-400"><span>Shipping</span><span>${totals.shippingPrice.toFixed(2)}</span></p>
            <p className="flex justify-between text-stone-600 dark:text-stone-400"><span>Tax</span><span>${totals.taxPrice.toFixed(2)}</span></p>
          </div>
          <p className="flex justify-between font-bold text-lg"><span>Total</span><span>${totals.totalPrice.toFixed(2)}</span></p>
        </aside>
      </div>
    </div>
  );
}

function getErrorMessage(error) {
  return error?.data?.message || error?.error || error?.message || 'Something went wrong. Please try again.';
}
