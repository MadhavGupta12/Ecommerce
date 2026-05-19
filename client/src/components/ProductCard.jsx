import { Images, PlayCircle, ShoppingBag, Star, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';
import QuickViewModal from './QuickViewModal';

export default function ProductCard({ product, index = 0 }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  return (
    <>
      <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        whileHover={{ y: -5 }}
        className="group overflow-hidden rounded-xl border border-stone-200 bg-white shadow-soft transition-all hover:shadow-2xl dark:bg-stone-900 dark:border-stone-800"
      >
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100 dark:bg-stone-800 cursor-pointer" onClick={() => setIsQuickViewOpen(true)}>
          <motion.img 
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6 }}
            className="h-full w-full object-cover" 
            src={product.image} 
            alt={product.name} 
          />
          
          {/* Quick View Overlay Button */}
          <div className="absolute inset-0 grid place-items-center bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="bg-white/90 backdrop-blur text-ink px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform">
              <Eye size={18} /> Quick View
            </button>
          </div>

          {product.featured && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm z-10">
              Featured
            </span>
          )}
          <div className="absolute bottom-3 right-3 flex gap-2 z-10">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-ink shadow-sm backdrop-blur-sm">
              <Images size={14} /> {(product.gallery?.length || 1)}
            </span>
            {product.videoUrl && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ink/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
                <PlayCircle size={14} /> Video
              </span>
            )}
          </div>
        </div>
        <div className="space-y-3 p-5">
          <div>
            <p className="text-xs uppercase tracking-wider text-moss font-bold dark:text-moss/80">{product.category?.name || 'Collection'}</p>
            <Link className="line-clamp-1 text-lg font-bold hover:text-brass transition-colors dark:text-stone-100 dark:hover:text-brass" to={`/products/${product._id}`}>{product.name}</Link>
          </div>
          <p className="line-clamp-2 min-h-10 text-sm text-stone-600 leading-relaxed dark:text-stone-400">{product.description}</p>
          <div className="flex items-center justify-between border-t border-stone-100 pt-4 dark:border-stone-800">
            <span className="text-xl font-bold dark:text-stone-100">${product.price}</span>
            <span className="inline-flex items-center gap-1 text-sm font-medium text-stone-600 dark:text-stone-400">
              <Star size={16} className="fill-brass text-brass" /> {product.rating}
            </span>
          </div>
          <Link className="btn-secondary w-full group/btn relative overflow-hidden dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-800" to={`/products/${product._id}`}>
            <span className="relative z-10 flex items-center justify-center gap-2">
              <ShoppingBag size={17} className="transition-transform group-hover/btn:-translate-y-1 group-hover/btn:scale-110" /> View item
            </span>
          </Link>
        </div>
      </motion.article>

      {isQuickViewOpen && (
        <QuickViewModal product={product} onClose={() => setIsQuickViewOpen(false)} />
      )}
    </>
  );
}
