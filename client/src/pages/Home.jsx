import { ArrowRight, BadgeCheck, CreditCard, Images, PlayCircle, Search, ShieldCheck, SlidersHorizontal, Sparkles, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { demoCategories, demoProducts } from '../data/demoProducts';
import { useGetCategoriesQuery, useGetProductsQuery } from '../services/apiSlice';
import { motion } from 'framer-motion';
import ProductSkeleton from '../components/ProductSkeleton';

const fadeInUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};
export default function Home() {
  const [filters, setFilters] = useState({ keyword: '', category: '', sort: 'newest', rating: '', minPrice: '', maxPrice: '' });
  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')), [filters]);
  const { data, isLoading, isError } = useGetProductsQuery(params);
  const { data: apiCategories = [] } = useGetCategoriesQuery();
  const categories = apiCategories.length ? apiCategories : demoCategories;
  const products = data?.products?.length ? data.products : filterDemoProducts(filters);
  const featured = products.filter((product) => product.featured).slice(0, 3);
  const mediaProducts = products.filter((product) => product.videoUrl).slice(0, 4);

  const update = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-lg bg-white shadow-soft">
        <div className="grid min-h-[520px] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-12">
            <p className="text-sm font-semibold uppercase tracking-wide text-brass">Curated living, delivered</p>
            <h1 className="mt-3 max-w-2xl text-4xl font-bold leading-tight sm:text-6xl">LuxeHaven</h1>
            <p className="mt-4 max-w-xl text-lg text-stone-700">
              Shop refined furniture, lighting, and decor with a fast MERN storefront, secure checkout, and an admin-managed catalogue.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <a className="btn" href="#catalogue">Shop collection <ArrowRight size={18} /></a>
              <a className="btn-secondary" href="#featured">View featured</a>
            </div>
            <div className="mt-8 grid gap-3 text-sm sm:grid-cols-3">
              <span className="inline-flex items-center gap-2"><Truck size={18} className="text-moss" /> Free shipping over $100</span>
              <span className="inline-flex items-center gap-2"><ShieldCheck size={18} className="text-moss" /> JWT secured login</span>
              <span className="inline-flex items-center gap-2"><CreditCard size={18} className="text-moss" /> PayPal checkout</span>
            </div>
          </div>
          <div className="relative min-h-[360px]">
            <img
              className="absolute inset-0 h-full w-full object-cover"
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
              alt="Styled living room with contemporary furniture"
            />
            <div className="absolute bottom-5 left-5 max-w-xs rounded-lg bg-white/92 p-4 shadow-soft backdrop-blur">
              <p className="text-sm font-semibold">Spring edit</p>
              <p className="mt-1 text-sm text-stone-600">12 handpicked pieces across furniture, lighting, decor, and bedroom.</p>
            </div>
          </div>
        </div>
      </section>

      <motion.section 
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp}
        className="grid gap-4 md:grid-cols-4"
      >
        {categories.map((category, index) => (
          <motion.button
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className="rounded-xl border border-stone-200 bg-white p-5 text-left shadow-soft transition-colors hover:border-brass hover:shadow-lg"
            key={category._id}
            onClick={() => setFilters((current) => ({ ...current, category: category._id }))}
            type="button"
          >
            <p className="text-sm font-bold tracking-widest text-brass">0{index + 1}</p>
            <h2 className="mt-2 text-xl font-extrabold">{category.name}</h2>
            <p className="mt-1 text-sm text-stone-600 line-clamp-2">{category.description}</p>
          </motion.button>
        ))}
      </motion.section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="space-y-4" id="featured">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-moss">Editor picks</p>
            <h2 className="text-3xl font-bold">Featured pieces</h2>
          </div>
          <BadgeCheck className="text-brass" size={28} />
        </div>
        
        {/* Bento Grid layout for Featured Pieces */}
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((product, idx) => (
            <div key={product._id} className={idx === 0 ? "md:col-span-2 md:row-span-2" : ""}>
              <ProductCard product={product} index={idx} />
            </div>
          ))}
        </div>
      </motion.section>

      <section className="grid gap-5 rounded-lg bg-ink p-5 text-white md:grid-cols-[1.1fr_0.9fr] md:p-8">
        <div className="flex flex-col justify-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brass">Dynamic media</p>
          <h2 className="mt-2 text-3xl font-bold">Images, videos, and product stories</h2>
          <p className="mt-3 max-w-xl text-stone-200">
            Product pages now support multiple images and video previews, so each item can feel like a real catalogue listing instead of a single static card.
          </p>
          <div className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
            <span className="rounded-md bg-white/10 p-3">Gallery thumbnails</span>
            <span className="rounded-md bg-white/10 p-3">Video playback</span>
            <span className="rounded-md bg-white/10 p-3">Dynamic seed data</span>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg bg-black">
          <video
            autoPlay
            className="aspect-video h-full w-full object-cover"
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80"
            src="https://videos.pexels.com/video-files/7534244/7534244-hd_1920_1080_25fps.mp4"
          />
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-moss">Visual catalogue</p>
            <h2 className="text-3xl font-bold">Rooms in motion</h2>
          </div>
          <Sparkles className="text-brass" size={28} />
        </div>
        <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative min-h-[420px] overflow-hidden rounded-lg bg-black shadow-soft">
            <video
              autoPlay
              className="absolute inset-0 h-full w-full object-cover"
              loop
              muted
              playsInline
              poster={mediaProducts[0]?.image || featured[0]?.image}
              src={mediaProducts[0]?.videoUrl || 'https://videos.pexels.com/video-files/7534244/7534244-hd_1920_1080_25fps.mp4'}
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-6 text-white">
              <p className="inline-flex items-center gap-2 text-sm font-semibold"><PlayCircle size={18} /> Featured room video</p>
              <h3 className="mt-2 text-3xl font-bold">{mediaProducts[0]?.name || 'LuxeHaven collection'}</h3>
              <p className="mt-2 max-w-lg text-sm text-stone-200">A more premium catalogue experience with motion, galleries, and detail-page media switching.</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {mediaProducts.slice(1, 4).map((product) => (
              <a className="group grid grid-cols-[120px_1fr] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-soft transition hover:border-brass" href={`/products/${product._id}`} key={product._id}>
                <div className="relative h-full min-h-32 overflow-hidden">
                  <img className="h-full w-full object-cover transition group-hover:scale-105" src={product.image} alt={product.name} />
                  <span className="absolute inset-0 grid place-items-center bg-ink/20 text-white"><PlayCircle size={28} /></span>
                </div>
                <div className="flex flex-col justify-center p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-moss">{product.category?.name}</p>
                  <h3 className="font-bold">{product.name}</h3>
                  <p className="mt-2 inline-flex items-center gap-2 text-sm text-stone-600"><Images size={16} /> {product.gallery?.length || 1} images plus video</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <motion.section initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeInUp} className="space-y-5" id="catalogue">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-moss">Catalogue</p>
            <h2 className="text-3xl font-bold">Shop the collection</h2>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600">
            <SlidersHorizontal size={18} /> {products.length} products
          </span>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-8 items-start">
          {/* Dynamic Sidebar Filters */}
          <aside className="panel space-y-8 sticky top-24 dark:bg-stone-900/50">
            <div>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2"><Search size={18}/> Search</h3>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
                <input className="input pl-10" name="keyword" onChange={update} placeholder="Search products, brands..." value={filters.keyword} />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Categories</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="radio" name="category" value="" onChange={update} checked={filters.category === ''} className="w-4 h-4 text-brass focus:ring-brass bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700" />
                  <span className="text-stone-600 group-hover:text-brass dark:text-stone-400 font-medium">All categories</span>
                </label>
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center gap-3 cursor-pointer group">
                    <input type="radio" name="category" value={category._id} onChange={update} checked={filters.category === category._id} className="w-4 h-4 text-brass focus:ring-brass bg-stone-100 border-stone-300 dark:bg-stone-800 dark:border-stone-700" />
                    <span className="text-stone-600 group-hover:text-brass dark:text-stone-400 font-medium">{category.name}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Price Range</h3>
              <div className="grid grid-cols-2 gap-3">
                <input className="input" min="0" name="minPrice" onChange={update} placeholder="Min $" type="number" value={filters.minPrice} />
                <input className="input" min="0" name="maxPrice" onChange={update} placeholder="Max $" type="number" value={filters.maxPrice} />
              </div>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-3">Sort & Order</h3>
              <select className="input" name="sort" onChange={update} value={filters.sort}>
                <option value="newest">Newest Arrivals</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="space-y-6">
            {isLoading && (
              <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <ProductSkeleton count={6} />
              </section>
            )}
            {isError && <p className="rounded-md border border-brass/30 bg-white px-4 py-3 text-sm text-stone-700">Showing demo catalogue until MongoDB is connected and seeded.</p>}
            {!isLoading && (
              <>
                {products.length === 0 ? (
                  <div className="panel flex flex-col items-center justify-center py-20 text-center">
                    <Search className="text-stone-300 mb-4" size={48} />
                    <h3 className="text-xl font-bold">No products found</h3>
                    <p className="text-stone-500 mt-2">Try adjusting your filters or search query.</p>
                    <button 
                      className="btn-secondary mt-4" 
                      onClick={() => setFilters({ keyword: '', category: '', sort: 'newest', rating: '', minPrice: '', maxPrice: '' })}
                    >
                      Clear all filters
                    </button>
                  </div>
                ) : (
                  <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, idx) => <ProductCard key={product._id} product={product} index={idx} />)}
                  </section>
                )}
              </>
            )}
          </div>
        </div>
      </motion.section>
    </div>
  );
}

function filterDemoProducts(filters) {
  let products = [...demoProducts];

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase();
    products = products.filter((product) => [product.name, product.brand, product.description].some((value) => value.toLowerCase().includes(keyword)));
  }

  if (filters.category) {
    products = products.filter((product) => product.category._id === filters.category);
  }

  if (filters.minPrice) {
    products = products.filter((product) => product.price >= Number(filters.minPrice));
  }

  if (filters.maxPrice) {
    products = products.filter((product) => product.price <= Number(filters.maxPrice));
  }

  if (filters.rating) {
    products = products.filter((product) => product.rating >= Number(filters.rating));
  }

  const sorters = {
    priceAsc: (a, b) => a.price - b.price,
    priceDesc: (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
    newest: () => 0
  };

  return products.sort(sorters[filters.sort] || sorters.newest);
}
