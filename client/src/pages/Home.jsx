import { Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { useGetCategoriesQuery, useGetProductsQuery } from '../services/apiSlice';

export default function Home() {
  const [filters, setFilters] = useState({ keyword: '', category: '', sort: 'newest', rating: '', minPrice: '', maxPrice: '' });
  const params = useMemo(() => Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== '')), [filters]);
  const { data, isLoading, isError } = useGetProductsQuery(params);
  const { data: categories = [] } = useGetCategoriesQuery();

  const update = (event) => setFilters((current) => ({ ...current, [event.target.name]: event.target.value }));

  return (
    <div className="space-y-6">
      <section className="grid gap-6 rounded-lg bg-ink p-6 text-white md:grid-cols-[1.2fr_0.8fr] md:p-8">
        <div>
          <p className="text-sm uppercase tracking-wide text-brass">Curated living</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold sm:text-5xl">LuxeHaven</h1>
          <p className="mt-3 max-w-xl text-stone-200">Premium home pieces with fast filtering, secure checkout, and admin-managed collections.</p>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-md bg-white/10 p-4">JWT secured accounts</div>
          <div className="rounded-md bg-white/10 p-4">PayPal checkout</div>
          <div className="rounded-md bg-white/10 p-4">RTK Query data sync</div>
          <div className="rounded-md bg-white/10 p-4">Admin analytics</div>
        </div>
      </section>

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
      {isError && <p>Unable to load products.</p>}
      <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {data?.products?.map((product) => <ProductCard key={product._id} product={product} />)}
      </section>
    </div>
  );
}
