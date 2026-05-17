import { Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetCategoriesQuery,
  useGetProductsQuery
} from '../services/apiSlice';

export default function AdminProducts() {
  const { data } = useGetProductsQuery({ limit: 100 });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [form, setForm] = useState({
    name: '',
    brand: '',
    category: '',
    description: '',
    image: '/uploads/product.jpg',
    gallery: '',
    videoUrl: '',
    price: '',
    countInStock: ''
  });

  const submit = async (event) => {
    event.preventDefault();
    await createProduct({
      ...form,
      gallery: form.gallery.split(',').map((item) => item.trim()).filter(Boolean),
      price: Number(form.price),
      countInStock: Number(form.countInStock)
    }).unwrap();
    setForm({ name: '', brand: '', category: '', description: '', image: '/uploads/product.jpg', gallery: '', videoUrl: '', price: '', countInStock: '' });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Product management</h1>
      <form className="panel grid gap-3 md:grid-cols-3" onSubmit={submit}>
        <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Brand" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} />
        <select className="input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
          <option value="">Category</option>
          {categories.map((category) => <option key={category._id} value={category._id}>{category.name}</option>)}
        </select>
        <input className="input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        <input className="input" placeholder="Gallery URLs, comma separated" value={form.gallery} onChange={(e) => setForm({ ...form, gallery: e.target.value })} />
        <input className="input" placeholder="Video URL" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        <input className="input" placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
        <input className="input" placeholder="Stock" type="number" value={form.countInStock} onChange={(e) => setForm({ ...form, countInStock: e.target.value })} />
        <textarea className="input md:col-span-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        <button className="btn md:col-span-3" type="submit"><Save size={18} /> Add product</button>
      </form>
      <section className="panel overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead><tr className="border-b"><th className="py-3">Name</th><th>Brand</th><th>Price</th><th>Stock</th><th></th></tr></thead>
          <tbody>
            {data?.products?.map((product) => (
              <tr className="border-b last:border-0" key={product._id}>
                <td className="py-3 font-medium">{product.name}</td>
                <td>{product.brand}</td>
                <td>${product.price}</td>
                <td>{product.countInStock}</td>
                <td><button className="btn-secondary" onClick={() => deleteProduct(product._id)} type="button"><Trash2 size={18} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
