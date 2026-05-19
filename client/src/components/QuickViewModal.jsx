import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingCart, Star } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../features/cartSlice';
import { useNavigate } from 'react-router-dom';

export default function QuickViewModal({ product, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!product) return null;

  const add = () => {
    dispatch(addToCart({
      product: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      countInStock: product.countInStock,
      quantity: 1
    }));
    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-4xl overflow-hidden bg-white rounded-2xl shadow-2xl dark:bg-stone-900"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute z-10 p-2 text-stone-500 bg-white rounded-full top-4 right-4 hover:bg-stone-100 hover:text-ink dark:bg-stone-800 dark:text-stone-300 dark:hover:bg-stone-700"
          >
            <X size={20} />
          </button>

          <div className="grid md:grid-cols-2 h-[600px] md:h-[500px]">
            <div className="relative h-64 bg-stone-100 md:h-full dark:bg-stone-800">
              <img
                src={product.image}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            
            <div className="flex flex-col p-6 overflow-y-auto sm:p-8">
              <p className="text-xs font-bold tracking-wider uppercase text-moss">{product.brand}</p>
              <h2 className="mt-2 text-3xl font-bold dark:text-stone-100">{product.name}</h2>
              
              <div className="flex items-center gap-4 mt-4">
                <span className="text-2xl font-bold dark:text-stone-100">${product.price}</span>
                <span className="inline-flex items-center gap-1 px-2 py-1 text-sm font-medium rounded-md bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300">
                  <Star size={16} className="fill-brass text-brass" /> {product.rating}
                </span>
              </div>

              <p className="mt-6 text-sm leading-relaxed text-stone-600 dark:text-stone-400">
                {product.description}
              </p>

              <div className="mt-auto pt-8 space-y-3">
                <p className="text-sm font-medium text-stone-500 dark:text-stone-400">
                  Availability: {product.countInStock > 0 ? <span className="text-moss font-bold">In Stock ({product.countInStock})</span> : <span className="text-red-500 font-bold">Out of Stock</span>}
                </p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={add} 
                    disabled={!product.countInStock}
                    className="flex-1 btn flex justify-center items-center gap-2"
                  >
                    <ShoppingCart size={18} /> Add to Cart
                  </button>
                  <button 
                    onClick={() => { onClose(); navigate(`/products/${product._id}`); }}
                    className="flex-1 btn-secondary flex justify-center items-center"
                  >
                    Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
