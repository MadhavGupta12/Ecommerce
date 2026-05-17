import { Images, PlayCircle, ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product._id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          <img className="h-full w-full object-cover transition duration-500 group-hover:scale-105" src={product.image} alt={product.name} />
          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              Featured
            </span>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm">
              <Images size={14} /> {(product.gallery?.length || 1)}
            </span>
            {product.videoUrl && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white">
                <PlayCircle size={14} /> Video
              </span>
            )}
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-4">
        <div>
          <p className="text-xs uppercase tracking-wide text-moss">{product.category?.name || 'Collection'}</p>
          <Link className="line-clamp-1 font-semibold hover:text-brass" to={`/products/${product._id}`}>{product.name}</Link>
        </div>
        <p className="line-clamp-2 min-h-10 text-sm text-stone-600">{product.description}</p>
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-lg font-bold">${product.price}</span>
          <span className="inline-flex items-center gap-1 text-sm text-stone-600">
            <Star size={16} className="fill-brass text-brass" /> {product.rating}
          </span>
        </div>
        <Link className="btn-secondary w-full" to={`/products/${product._id}`}>
          <ShoppingBag size={17} /> View item
        </Link>
      </div>
    </article>
  );
}
