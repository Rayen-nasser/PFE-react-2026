import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isActive = (path) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=DM+Sans:wght@300;400;500&display=swap');

        .hd-root {
          position: sticky; top: 0; z-index: 100;
          background: ${scrolled ? 'rgba(12,12,14,0.96)' : 'rgba(12,12,14,0.8)'};
          backdrop-filter: blur(20px);
          border-bottom: 1px solid ${scrolled ? 'rgba(255,255,255,0.07)' : 'transparent'};
          transition: background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
          box-shadow: ${scrolled ? '0 8px 32px rgba(0,0,0,0.4)' : 'none'};
          font-family: 'DM Sans', sans-serif;
        }
        .hd-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 32px;
          height: 64px;
          display: flex; align-items: center; justify-content: space-between;
        }

        /* Logo */
        .hd-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px; font-weight: 500; letter-spacing: 0.06em;
          color: #b4915a; text-decoration: none;
          display: flex; align-items: center; gap: 10px;
          transition: opacity 0.2s;
        }
        .hd-logo:hover { opacity: 0.85; }
        .hd-logo-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #b4915a;
          box-shadow: 0 0 8px rgba(180,145,90,0.6);
        }

        /* Nav */
        .hd-nav {
          display: flex; align-items: center; gap: 2px;
        }
        .hd-nav-link {
          padding: 6px 14px; border-radius: 7px;
          font-size: 13px; font-weight: 400; letter-spacing: 0.02em;
          color: #666; text-decoration: none;
          transition: color 0.2s, background 0.2s;
          position: relative;
        }
        .hd-nav-link:hover { color: #e8e4dc; background: rgba(255,255,255,0.04); }
        .hd-nav-link.active { color: #b4915a; }
        .hd-nav-link.active::after {
          content: '';
          position: absolute; bottom: -1px; left: 50%; transform: translateX(-50%);
          width: 16px; height: 1px; background: #b4915a;
          border-radius: 1px;
        }

        /* Right section */
        .hd-right { display: flex; align-items: center; gap: 12px; }

        /* User chip */
        .hd-user-chip {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none;
          padding: 5px 12px 5px 5px;
          border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.03);
          transition: border-color 0.2s, background 0.2s;
        }
        .hd-user-chip:hover { border-color: rgba(180,145,90,0.3); background: rgba(180,145,90,0.05); }
        .hd-avatar {
          width: 28px; height: 28px; border-radius: 50%;
          background: linear-gradient(135deg, #b4915a, #8a6e40);
          display: flex; align-items: center; justify-content: center;
          font-size: 12px; font-weight: 600; color: #0c0c0e;
          flex-shrink: 0;
        }
        .hd-user-name { font-size: 13px; color: #aaa; }

        /* Logout btn */
        .hd-logout {
          padding: 7px 14px; border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(255,255,255,0.08);
          color: #555; font-size: 12px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all 0.2s; letter-spacing: 0.03em;
        }
        .hd-logout:hover { border-color: rgba(220,110,110,0.4); color: #e07070; }

        /* CTA buttons */
        .hd-signin {
          padding: 7px 16px; border-radius: 8px;
          color: #888; font-size: 13px; text-decoration: none;
          transition: color 0.2s;
          font-weight: 400;
        }
        .hd-signin:hover { color: #e8e4dc; }
        .hd-register {
          padding: 8px 18px; border-radius: 8px;
          background: linear-gradient(135deg, #b4915a, #c8a86e);
          color: #0c0c0e; font-size: 13px; font-weight: 500;
          text-decoration: none; letter-spacing: 0.04em;
          transition: opacity 0.2s, transform 0.1s;
          display: inline-block;
        }
        .hd-register:hover { opacity: 0.9; transform: translateY(-1px); }

        /* Mobile hamburger */
        .hd-burger {
          display: none;
          background: none; border: none; cursor: pointer;
          padding: 6px; color: #666;
        }
        @media (max-width: 768px) {
          .hd-nav { display: none; }
          .hd-right .hd-signin, .hd-right .hd-register { display: none; }
          .hd-burger { display: flex; align-items: center; }
        }

        /* Mobile drawer */
        .hd-drawer {
          position: fixed; inset: 64px 0 0 0; z-index: 99;
          background: rgba(12,12,14,0.98);
          backdrop-filter: blur(20px);
          padding: 24px 24px;
          display: flex; flex-direction: column; gap: 6px;
          transform: translateY(${menuOpen ? '0' : '-20px'});
          opacity: ${menuOpen ? '1' : '0'};
          pointer-events: ${menuOpen ? 'all' : 'none'};
          transition: transform 0.25s ease, opacity 0.25s ease;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .hd-drawer-link {
          padding: 13px 16px; border-radius: 10px;
          font-size: 15px; color: #888; text-decoration: none;
          transition: color 0.2s, background 0.2s;
          display: flex; align-items: center; gap: 10px;
        }
        .hd-drawer-link:hover, .hd-drawer-link.active { color: #e8e4dc; background: rgba(255,255,255,0.04); }
        .hd-drawer-link.active { color: #b4915a; }
        .hd-drawer-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 8px 0; }
        .hd-drawer-cta {
          display: flex; gap: 10px; margin-top: 8px;
        }
        .hd-drawer-btn {
          flex: 1; padding: 12px; border-radius: 10px; text-align: center;
          font-size: 14px; font-weight: 500; text-decoration: none;
          transition: opacity 0.2s;
        }
        .hd-drawer-btn.outline {
          border: 1px solid rgba(255,255,255,0.1); color: #888;
        }
        .hd-drawer-btn.filled {
          background: linear-gradient(135deg, #b4915a, #c8a86e); color: #0c0c0e;
        }
      `}</style>

      <header className="hd-root">
        <div className="hd-inner">
          {/* Logo */}
          <Link to="/" className="hd-logo">
            <span className="hd-logo-dot" />
            Forma
          </Link>

          {/* Desktop nav */}
          <nav className="hd-nav">
            <Link to="/" className={`hd-nav-link${isActive('/') ? ' active' : ''}`}>Home</Link>
            <Link to="/formations" className={`hd-nav-link${isActive('/formations') ? ' active' : ''}`}>Courses</Link>
            <Link to="/centres" className={`hd-nav-link${isActive('/centres') ? ' active' : ''}`}>Centers</Link>
            {user && (
              <>
                <Link to="/my-inscriptions" className={`hd-nav-link${isActive('/my-inscriptions') ? ' active' : ''}`}>Enrollments</Link>
                <Link to="/my-favoris" className={`hd-nav-link${isActive('/my-favoris') ? ' active' : ''}`}>Favorites</Link>
              </>
            )}
          </nav>

          {/* Right */}
          <div className="hd-right">
            {user ? (
              <>
                <Link to="/profile" className="hd-user-chip">
                  <div className="hd-avatar">
                    {user.user_image ? (
                      <img 
                        src={`http://localhost:5000/${user.user_image}`} 
                        alt="" 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} 
                      />
                    ) : (
                      (user.nom?.[0] || user.prenom?.[0] || user.email?.[0] || 'U').toUpperCase()
                    )}
                  </div>
                  <span className="hd-user-name">
                    {user.nom && user.prenom 
                      ? `${user.prenom} ${user.nom}` 
                      : (user.prenom || user.nom || user.email?.split('@')[0])}
                  </span>
                </Link>
                <button className="hd-logout" onClick={logout}>Sign out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="hd-signin">Sign In</Link>
                <Link to="/register" className="hd-register">Get Started</Link>
              </>
            )}
            {/* Hamburger */}
            <button className="hd-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                {menuOpen ? (
                  <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                ) : (
                  <><line x1="3" y1="7" x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      <div className="hd-drawer">
        <Link to="/" className={`hd-drawer-link${isActive('/') ? ' active' : ''}`}>Home</Link>
        <Link to="/formations" className={`hd-drawer-link${isActive('/formations') ? ' active' : ''}`}>Courses</Link>
        <Link to="/centres" className={`hd-drawer-link${isActive('/centres') ? ' active' : ''}`}>Centers</Link>
        {user && (
          <>
            <Link to="/my-inscriptions" className={`hd-drawer-link${isActive('/my-inscriptions') ? ' active' : ''}`}>My Enrollments</Link>
            <Link to="/my-favoris" className={`hd-drawer-link${isActive('/my-favoris') ? ' active' : ''}`}>My Favorites</Link>
            <Link to="/profile" className={`hd-drawer-link${isActive('/profile') ? ' active' : ''}`}>Profile</Link>
          </>
        )}
        <div className="hd-drawer-divider" />
        {user ? (
          <button onClick={logout} className="hd-drawer-btn outline" style={{ background: 'none', cursor: 'pointer', fontFamily: 'DM Sans, sans-serif' }}>
            Sign out
          </button>
        ) : (
          <div className="hd-drawer-cta">
            <Link to="/login" className="hd-drawer-btn outline">Sign In</Link>
            <Link to="/register" className="hd-drawer-btn filled">Get Started</Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Header;