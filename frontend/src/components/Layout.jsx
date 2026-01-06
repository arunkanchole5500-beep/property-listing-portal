import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white shadow-soft">
              RP
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold tracking-tight">Realty Portal</span>
              <span className="text-[11px] font-medium text-slate-500">Properties & Construction</span>
            </div>
          </Link>
          <nav className="flex items-center gap-6 text-sm font-medium">
            <NavLink
              to="/properties"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-600 ${
                  isActive ? 'text-brand-600' : 'text-slate-600'
                }`
              }
            >
              Properties
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-600 ${
                  isActive ? 'text-brand-600' : 'text-slate-600'
                }`
              }
            >
              Services &amp; Portfolio
            </NavLink>
            <NavLink
              to="/inquiry"
              className={({ isActive }) =>
                `transition-colors hover:text-brand-600 ${
                  isActive ? 'text-brand-600' : 'text-slate-600'
                }`
              }
            >
              Inquiry
            </NavLink>
            {token ? (
              <>
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `rounded-full border px-3 py-1 text-xs transition ${
                      isActive
                        ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                        : 'border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600'
                    }`
                  }
                >
                  Admin
                </NavLink>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs font-medium text-slate-500 hover:text-slate-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `rounded-full border px-3 py-1 text-xs transition ${
                    isActive
                      ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                      : 'border-slate-200 text-slate-700 hover:border-brand-500 hover:text-brand-600'
                  }`
                }
              >
                Staff Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8">
          <div className="rounded-2xl bg-white/90 p-6 shadow-soft ring-1 ring-slate-100">
            <Outlet />
          </div>
        </div>
      </main>
      <footer className="mt-auto border-t border-slate-200 bg-white/70 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Realty Portal. All rights reserved.
      </footer>
    </div>
  );
}
