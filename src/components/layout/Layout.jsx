import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0c0c0e' }}>
      <Header />
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 32px 64px' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;