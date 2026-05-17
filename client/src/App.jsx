import { Outlet } from 'react-router-dom';
import Header from './components/Header';

export default function App() {
  return (
    <div className="min-h-screen bg-linen text-ink">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
}
