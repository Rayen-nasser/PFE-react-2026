import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isResponsablePage = location.pathname.startsWith('/responsable');
  const isFormateurPage = location.pathname.startsWith('/formateur');
  
  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0e' }}>
      {!isAdminPage && !isResponsablePage && !isFormateurPage && <Header />}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: (isAdminPage || isResponsablePage || isFormateurPage) ? '0' : '0 32px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;