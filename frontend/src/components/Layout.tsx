import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Film, LogOut, LayoutDashboard, MonitorPlay, Ticket, Coffee, Search } from 'lucide-react';

const Layout = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const adminLinks = [
    { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { name: 'Gêneros', path: '/admin/generos', icon: <Search size={20} /> },
    { name: 'Filmes', path: '/admin/filmes', icon: <Film size={20} /> },
    { name: 'Salas', path: '/admin/salas', icon: <MonitorPlay size={20} /> },
    { name: 'Sessões', path: '/admin/sessoes', icon: <Ticket size={20} /> },
    { name: 'Lanches', path: '/admin/lanches', icon: <Coffee size={20} /> },
  ];

  const userLinks = [
    { name: 'Em Cartaz', path: '/app', icon: <Film size={20} /> },
    { name: 'Meus Pedidos', path: '/app/pedidos', icon: <Ticket size={20} /> },
  ];

  const links = isAdmin ? adminLinks : userLinks;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row font-sans text-zinc-200">
      {/* Sidebar/Navbar */}
      <aside className="w-full md:w-64 bg-zinc-900 border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col">
        <div className="p-6 flex items-center gap-3 text-indigo-400 font-bold text-2xl border-b border-zinc-800">
          <Film size={28} />
          <span>CineWeb</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {links.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/admin' && link.path !== '/app' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                    ? 'bg-indigo-600 text-white font-medium shadow-md shadow-indigo-900/20'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-800 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-10 h-10 rounded-full bg-indigo-900 flex items-center justify-center text-indigo-300 font-bold">
              {user?.nome.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-medium text-zinc-200 truncate">{user?.nome}</p>
              <p className="text-xs text-zinc-500 truncate">{isAdmin ? 'Administrador' : 'Usuário'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
