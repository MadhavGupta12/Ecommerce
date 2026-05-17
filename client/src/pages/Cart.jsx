import { Trash2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { addToCart, removeFromCart, selectCartTotals } from '../features/cartSlice';

export default function Cart() {
  const items = useSelector((state) => state.cart.items);
  const totals = useSelector(selectCartTotals);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold">Shopping cart</h1>
        {items.length === 0 && <p>Your cart is empty. <Link className="font-semibold text-brass" to="/">Browse products</Link></p>}
        {items.map((item) => (
          <article className="panel grid gap-4 sm:grid-cols-[96px_1fr_140px_44px] sm:items-center" key={item.product}>
            <img className="h-24 w-24 rounded-md object-cover" src={item.image} alt={item.name} />
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p className="text-sm text-stone-600">${item.price}</p>
            </div>
            <select
              className="input"
              value={item.quantity}
              onChange={(event) => dispatch(addToCart({ ...item, quantity: Number(event.target.value) }))}
            >
              {[...Array(item.countInStock).keys()].map((value) => <option key={value + 1} value={value + 1}>{value + 1}</option>)}
            </select>
            <button className="btn-secondary" onClick={() => dispatch(removeFromCart(item.product))} type="button"><Trash2 size={18} /></button>
          </article>
        ))}
      </section>
      <aside className="panel h-fit space-y-4">
        <h2 className="text-xl font-bold">Order summary</h2>
        <p className="flex justify-between"><span>Items</span><span>${totals.itemsPrice.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Shipping</span><span>${totals.shippingPrice.toFixed(2)}</span></p>
        <p className="flex justify-between"><span>Tax</span><span>${totals.taxPrice.toFixed(2)}</span></p>
        <p className="flex justify-between text-lg font-bold"><span>Total</span><span>${totals.totalPrice.toFixed(2)}</span></p>
        <button className="btn w-full" disabled={!items.length} onClick={() => navigate('/checkout')} type="button">Checkout</button>
      </aside>
    </div>
  );
}
