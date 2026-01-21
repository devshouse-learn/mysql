import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>📦 Inventario</h2>
          <div className="user-info">
            <span className="user-name">{user?.fullName || user?.username}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/categories" className={({ isActive }) => isActive ? 'active' : ''}>
            📂 Categorías
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? 'active' : ''}>
            📦 Productos
          </NavLink>
          <NavLink to="/warehouses" className={({ isActive }) => isActive ? 'active' : ''}>
            🏪 Bodegas
          </NavLink>
          <NavLink to="/movements" className={({ isActive }) => isActive ? 'active' : ''}>
            � Movimientos
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? 'active' : ''}>
            📈 Reportes
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="btn btn-logout">
            🚪 Cerrar Sesión
          </button>
        </div>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
