import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { addToCart } from '../features/cartSlice';
import { useGetProductQuery } from '../services/apiSlice';

export default function ProductDetails() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductQuery(id);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading) return <p>Loading product...</p>;
  if (!product) return <p>Product not found.</p>;

  const add = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      quantity
    }));
    navigate('/cart');
  };

  return (
    <section className="grid gap-8 lg:grid-cols-2">
      <div className="overflow-hidden rounded-lg bg-white shadow-soft">
        <img className="h-full max-h-[560px] w-full object-cover" src={product.image} alt={product.name} />
      </div>
      <div className="space-y-5">
        <p className="text-sm uppercase tracking-wide text-moss">{product.brand}</p>
        <h1 className="text-4xl font-bold">{product.name}</h1>
        <p className="text-stone-700">{product.description}</p>
        <p className="text-3xl font-bold">${product.price}</p>
        <p className="text-sm text-stone-600">{product.rating} rating from {product.numReviews} reviews</p>
        <div className="flex items-center gap-3">
          <button className="btn-secondary" onClick={() => setQuantity(Math.max(1, quantity - 1))} type="button"><Minus size={18} /></button>
          <span className="w-10 text-center font-semibold">{quantity}</span>
          <button className="btn-secondary" onClick={() => setQuantity(Math.min(product.countInStock, quantity + 1))} type="button"><Plus size={18} /></button>
        </div>
        <button className="btn" disabled={!product.countInStock} onClick={add} type="button">
          <ShoppingCart size={18} /> Add to cart
        </button>
      </div>
    </section>
  );
}
