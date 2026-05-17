import { LogOut, Package, ShoppingBag, ShieldCheck, User } from 'lucide-react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { clearCredentials } from '../features/authSlice';
import { useLogoutMutation } from '../services/apiSlice';

export default function Header() {
  const { userInfo } = useSelector((state) => state.auth);
  const cartCount = useSelector((state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    dispatch(clearCredentials());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-xl font-bold tracking-wide">
          <span className="grid h-9 w-9 place-items-center rounded-md bg-ink text-sm text-white">LH</span>
          LuxeHaven
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          {userInfo?.role === 'admin' && (
            <NavLink className="btn-secondary" to="/admin">
              <ShieldCheck size={18} />
              <span className="hidden sm:inline">Admin</span>
            </NavLink>
          )}
          <NavLink className="btn-secondary" to="/cart">
            <ShoppingBag size={18} />
            <span>{cartCount}</span>
          </NavLink>
          {userInfo ? (
            <>
              <span className="hidden text-sm font-medium sm:inline">{userInfo.name}</span>
              <button className="btn-secondary" onClick={handleLogout} type="button">
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <NavLink className="btn-secondary" to="/login">
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
