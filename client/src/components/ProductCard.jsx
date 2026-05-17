import { Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft">
      <Link to={`/products/${product._id}`}>
        <div className="aspect-[4/3] bg-stone-100">
          <img className="h-full w-full object-cover" src={product.image} alt={product.name} />
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-moss">{product.category?.name || 'Collection'}</p>
          <Link className="font-semibold hover:text-brass" to={`/products/${product._id}`}>{product.name}</Link>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold">${product.price}</span>
          <span className="inline-flex items-center gap-1 text-sm text-stone-600">
            <Star size={16} className="fill-brass text-brass" /> {product.rating}
          </span>
        </div>
      </div>
    </article>
  );
}
