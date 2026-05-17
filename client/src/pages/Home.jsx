import { ArrowRight, BadgeCheck, CreditCard, PlayCircle, Search, ShieldCheck, SlidersHorizontal, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { demoCategories, demoProducts } from '../data/demoProducts';
import { useGetCategoriesQuery, useGetProductsQuery } from '../services/apiSlice';

export default function Home() {
  const [filters, setFilters] = useState({ keyword: '', category: '', sort: 'newest', rating: '', minPrice: '', maxPrice: '' });
  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')), [filters]);
  const { data, isLoading, isError } = useGetProductsQuery(params);
  const { data: apiCategories = [] } = useGetCategoriesQuery();
  const categories = apiCategories.length ? apiCategories : demoCategories;
  const products = data?.products?.length ? data.products : filterDemoProducts(filters);
  const featured = products.filter((product) => product.featured).slice(0, 3);

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

      <section className="grid gap-4 md:grid-cols-4">
        {categories.map((category, index) => (
          <button
            className="rounded-lg border border-stone-200 bg-white p-5 text-left shadow-soft transition hover:border-brass"
            key={category._id}
            onClick={() => setFilters((current) => ({ ...current, category: category._id }))}
            type="button"
          >
            <p className="text-sm font-semibold text-brass">0{index + 1}</p>
            <h2 className="mt-2 text-xl font-bold">{category.name}</h2>
            <p className="mt-1 text-sm text-stone-600">{category.description}</p>
          </button>
        ))}
      </section>

      <section className="space-y-4" id="featured">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-moss">Editor picks</p>
            <h2 className="text-3xl font-bold">Featured pieces</h2>
          </div>
          <BadgeCheck className="text-brass" size={28} />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {featured.map((product) => <ProductCard key={product._id} product={product} />)}
        </div>
      </section>

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

      <section className="space-y-5" id="catalogue">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-moss">Catalogue</p>
            <h2 className="text-3xl font-bold">Shop the collection</h2>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-600">
            <SlidersHorizontal size={18} /> {products.length} products
          </span>
        </div>

        <section className="panel grid gap-3 md:grid-cols-[1.2fr_0.9fr_0.8fr_0.7fr_0.7fr]">
          <label className="relative">
            <Search className="absolute left-3 top-2.5 text-stone-400" size={18} />
            <input className="input pl-10" name="keyword" onChange={update} placeholder="Search products" value={filters.keyword} />
          </label>
          <select className="input" name="category" onChange={update} value={filters.category}>
            <option value="">All categories</option>
            {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
          </select>
          <select className="input" name="sort" onChange={update} value={filters.sort}>
            <option value="newest">Newest</option>
            <option value="priceAsc">Price low to high</option>
            <option value="priceDesc">Price high to low</option>
            <option value="rating">Top rated</option>
          </select>
          <input className="input" min="0" name="minPrice" onChange={update} placeholder="Min $" type="number" value={filters.minPrice} />
          <input className="input" min="0" name="maxPrice" onChange={update} placeholder="Max $" type="number" value={filters.maxPrice} />
        </section>

        {isLoading && <p>Loading catalogue...</p>}
        {isError && <p className="rounded-md border border-brass/30 bg-white px-4 py-3 text-sm text-stone-700">Showing demo catalogue until MongoDB is connected and seeded.</p>}
        <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => <ProductCard key={product._id} product={product} />)}
        </section>
      </section>
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
