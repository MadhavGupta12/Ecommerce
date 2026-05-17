import Chart from 'react-apexcharts';
import { Link } from 'react-router-dom';
import { useGetStatsQuery } from '../services/apiSlice';

export default function AdminDashboard() {
  const { data, isLoading } = useGetStatsQuery();
  const labels = data?.monthlySales?.map((item) => `${item._id.month}/${item._id.year}`) || [];
  const sales = data?.monthlySales?.map((item) => item.sales) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">Admin dashboard</h1>
        <div className="flex gap-2">
          <Link className="btn-secondary" to="/admin/products">Products</Link>
          <Link className="btn-secondary" to="/admin/orders">Orders</Link>
          <Link className="btn-secondary" to="/admin/users">Customers</Link>
        </div>
      </div>
      {isLoading ? <p>Loading analytics...</p> : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Revenue', `$${data.revenue.toFixed(2)}`],
              ['Orders', data.orders],
              ['Products', data.products],
              ['Customers', data.users]
            ].map(([label, value]) => (
              <div className="panel" key={label}>
                <p className="text-sm text-stone-600">{label}</p>
                <p className="mt-2 text-3xl font-bold">{value}</p>
              </div>
            ))}
          </section>
          <section className="panel">
            <Chart
              height={320}
              options={{ chart: { toolbar: { show: false } }, xaxis: { categories: labels }, colors: ['#b58b4c'] }}
              series={[{ name: 'Revenue', data: sales }]}
              type="area"
            />
          </section>
        </>
      )}
    </div>
  );
}
