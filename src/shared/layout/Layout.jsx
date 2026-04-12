import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  
  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0e' }}>
      {!isAdminPage && <Header />}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: isAdminPage ? '0' : '0 32px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;