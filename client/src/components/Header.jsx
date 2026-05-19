import { LogOut, Package, ShoppingBag, ShieldCheck, User, Moon, Sun } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../features/authSlice';
import { useLogoutMutation } from '../services/apiSlice';
import { useEffect, useState } from 'react';

export default function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur dark:bg-stone-900/95 dark:border-stone-800 transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-wide dark:text-stone-100">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm text-white dark:bg-white dark:text-ink">LH</span>
          LuxeHaven
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsDark(!isDark)} 
            className="btn-secondary dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-800"
            title="Toggle Dark Mode"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {userInfo?.role === 'admin' && (
            <NavLink className="btn-secondary dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-800" to="/admin">
              <ShieldCheck size={18} />
              <span className="hidden sm:inline">Admin</span>
            </NavLink>
          )}
          <NavLink className="btn-secondary dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-800" to="/cart">
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </NavLink>
          {userInfo ? (
            <>
              <span className="hidden text-sm font-medium sm:inline dark:text-stone-200">{userInfo.name}</span>
              <button className="btn-secondary dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-800" onClick={handleLogout} type="button">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <NavLink className="btn-secondary dark:text-stone-300 dark:border-stone-700 dark:hover:bg-stone-800" to="/login">
              <User size={18} />
              <span className="hidden sm:inline">Login</span>
            </NavLink>
          )}
          <Package className="hidden text-brass md:block" size={20} />
        </nav>
      </div>
    </header>
  );
}
