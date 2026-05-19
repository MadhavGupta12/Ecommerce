import { useGetWishlistQuery, useRemoveFromWishlistMutation } from '../services/apiSlice';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const { data: wishlist = [], isLoading, isError } = useGetWishlistQuery();
  const [removeFromWishlist] = useRemoveFromWishlistMutation();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Your Wishlist</h1>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <ProductSkeleton count={4} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="panel text-center py-20">
        <Heart className="text-stone-300 mx-auto mb-4" size={48} />
        <h3 className="text-xl font-bold">Please log in</h3>
        <p className="text-stone-500 mt-2">You need to be logged in to view your wishlist.</p>
        <Link to="/login" className="btn mt-4 inline-block">Log In</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="text-brass fill-brass" size={28} />
        <h1 className="text-3xl font-bold dark:text-stone-100">Your Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="panel flex flex-col items-center justify-center py-20 text-center dark:bg-stone-900/50">
          <Heart className="text-stone-300 dark:text-stone-700 mb-4" size={48} />
          <h3 className="text-xl font-bold">Your wishlist is empty</h3>
          <p className="text-stone-500 mt-2">Save items you love to find them easily later.</p>
          <Link to="/" className="btn mt-4 flex items-center gap-2">
            <ShoppingBag size={18} /> Discover products
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {wishlist.map((product) => (
            <div key={product._id} className="relative group">
              <ProductCard product={product} />
              <button
                onClick={() => removeFromWishlist(product._id)}
                className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-md hover:scale-105 hover:bg-white transition-all z-20"
                title="Remove from Wishlist"
              >
                <Heart className="fill-red-500 text-red-500" size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
