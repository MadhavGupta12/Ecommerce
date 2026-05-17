import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { demoProducts } from '../data/demoProducts';
import { addToCart } from '../features/cartSlice';
import { useGetProductQuery } from '../services/apiSlice';

export default function ProductDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductQuery(id);
  const product = data || demoProducts.find((item) => item._id === id);
  const related = demoProducts.filter((item) => item.category?._id === product?.category?._id && item._id !== product?._id).slice(0, 4);
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (isLoading && !product) return <p>Loading product...</p>;
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
    <div className="space-y-10">
      {isError && <p className="rounded-md border border-brass/30 bg-white px-4 py-3 text-sm text-stone-700">Showing demo product details until MongoDB is connected and seeded.</p>}
      <section className="grid gap-8 lg:grid-cols-2">
        <div className="overflow-hidden rounded-lg bg-white shadow-soft">
          <img className="h-full max-h-[620px] w-full object-cover" src={product.image} alt={product.name} />
        </div>
        <div className="space-y-5">
          <p className="text-sm font-semibold uppercase tracking-wide text-moss">{product.brand}</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{product.name}</h1>
          <p className="text-lg text-stone-700">{product.description}</p>
          <div className="grid gap-3 border-y border-stone-200 py-5 sm:grid-cols-3">
            <div>
              <p className="text-sm text-stone-500">Price</p>
              <p className="text-2xl font-bold">${product.price}</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Rating</p>
              <p className="text-2xl font-bold">{product.rating}/5</p>
            </div>
            <div>
              <p className="text-sm text-stone-500">Stock</p>
              <p className="text-2xl font-bold">{product.countInStock}</p>
            </div>
          </div>
          <p className="text-sm text-stone-600">{product.numReviews} customer reviews</p>
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
      {related.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-3xl font-bold">Complete the room</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item._id} product={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
