import { Image as ImageIcon, Minus, PlayCircle, Plus, ShoppingCart, UserCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { demoProducts } from '../data/demoProducts';
import { addToCart } from '../features/cartSlice';
import { useGetProductQuery, useCreateProductReviewMutation } from '../services/apiSlice';

export default function ProductDetails() {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductQuery(id);
  const product = data || demoProducts.find((item) => item._id === id);
  const related = demoProducts.filter((item) => item.category?._id === product?.category?._id && item._id !== product?._id).slice(0, 4);
  const [quantity, setQuantity] = useState(1);
  const media = buildMedia(product);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const activeMedia = media[selectedMediaIndex] || media[0];
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { userInfo } = useSelector((state) => state.auth);
  const [createReview, { isLoading: isReviewLoading }] = useCreateProductReviewMutation();

  const submitReview = async (e) => {
    e.preventDefault();
    try {
      await createReview({ id, rating, comment }).unwrap();
      setRating(0);
      setComment('');
      alert('Review submitted successfully');
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  useEffect(() => {
    setSelectedMediaIndex(0);
  }, [id]);

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
        <div className="space-y-3">
          <div className="overflow-hidden rounded-lg bg-white shadow-soft">
            {activeMedia?.type === 'video' ? (
              <video
                className="h-full max-h-[620px] min-h-[360px] w-full object-cover"
                controls
                playsInline
                poster={product.image}
                src={activeMedia.src}
              />
            ) : (
              <img className="h-full max-h-[620px] min-h-[360px] w-full object-cover" src={activeMedia?.src || product.image} alt={product.name} />
            )}
          </div>
          <div className="grid grid-cols-5 gap-3">
            {media.map((item, index) => (
              <button
                className={`relative aspect-video overflow-hidden rounded-md border bg-white ${selectedMediaIndex === index ? 'border-brass ring-2 ring-brass/30' : 'border-stone-200'}`}
                key={`${item.type}-${item.src}`}
                onClick={() => setSelectedMediaIndex(index)}
                type="button"
              >
                {item.type === 'video' ? (
                  <>
                    <img className="h-full w-full object-cover opacity-70" src={product.image} alt="" />
                    <span className="absolute inset-0 grid place-items-center bg-ink/30 text-white"><PlayCircle size={24} /></span>
                  </>
                ) : (
                  <img className="h-full w-full object-cover" src={item.src} alt={`${product.name} view ${index + 1}`} />
                )}
                <span className="sr-only">{item.type === 'video' ? 'Product video' : 'Product image'}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-soft">
          <p className="text-sm font-semibold uppercase tracking-wide text-moss">{product.brand}</p>
          <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{product.name}</h1>
          <p className="text-lg text-stone-700">{product.description}</p>
          <div className="flex flex-wrap gap-2 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-linen px-3 py-1 font-semibold text-stone-700"><ImageIcon size={16} /> {media.filter((item) => item.type === 'image').length} images</span>
            {product.videoUrl && <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3 py-1 font-semibold text-white"><PlayCircle size={16} /> Product video</span>}
          </div>
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

      {/* REVIEWS SECTION */}
      <section className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Customer Reviews</h2>
          {product.reviews?.length === 0 && <p className="text-stone-600">No reviews yet. Be the first to review this product!</p>}
          <div className="space-y-4">
            {product.reviews?.map((review) => (
              <div key={review._id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-soft">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <UserCircle2 className="text-stone-400" />
                    <strong className="font-semibold">{review.name}</strong>
                  </div>
                  <span className="text-sm font-semibold text-brass">{review.rating}/5 Stars</span>
                </div>
                <p className="text-stone-700">{review.comment}</p>
                <p className="text-xs text-stone-400 mt-3">{new Date(review.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* WRITE A REVIEW FORM */}
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-soft h-fit">
          <h3 className="text-xl font-bold mb-4">Write a Customer Review</h3>
          {userInfo ? (
            <form onSubmit={submitReview} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-700">Rating</label>
                <select className="input" value={rating} onChange={(e) => setRating(Number(e.target.value))} required>
                  <option value="">Select...</option>
                  <option value="1">1 - Poor</option>
                  <option value="2">2 - Fair</option>
                  <option value="3">3 - Good</option>
                  <option value="4">4 - Very Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-semibold text-stone-700">Comment</label>
                <textarea 
                  className="input min-h-[100px]" 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  required 
                />
              </div>
              <button disabled={isReviewLoading} className="btn w-full" type="submit">
                {isReviewLoading ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          ) : (
            <div className="rounded-md bg-stone-100 p-4 text-center">
              <p className="text-stone-700">Please <Link to="/login" className="font-bold text-brass hover:underline">sign in</Link> to write a review.</p>
            </div>
          )}
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

function buildMedia(product) {
  if (!product) return [];

  const images = [...new Set([product.image, ...(product.gallery || [])].filter(Boolean))].map((src) => ({
    type: 'image',
    src
  }));

  const videos = product.videoUrl ? [{ type: 'video', src: product.videoUrl }] : [];
  return [...images, ...videos];
}
