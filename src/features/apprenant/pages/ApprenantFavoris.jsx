import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ApprenantLayout from '../components/ApprenantLayout';
import { favoriService } from '../../../services/api';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';

export default function ApprenantFavoris() {
  const [favoris, setFavoris] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await favoriService.getMyFavoris();
      setFavoris(res.data.data || []);
    } catch (e) {
      console.error('Failed to fetch favorites', e);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, favoriId) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await favoriService.remove(favoriId);
      setFavoris(prev => prev.filter(f => f._id !== favoriId));
    } catch (e) {
      console.error('Failed to remove favorite', e);
    }
  };

  return (
    <ApprenantLayout title="My <em>Favorites</em>" subtitle="Courses you've saved for later">
      {loading ? (
        <LoadingSpinner />
      ) : favoris.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>💙</div>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>No favorites yet</div>
          <div style={{ fontSize: 14, color: '#555', marginBottom: 16 }}>
            Save courses you like to view them later
          </div>
          <Link to="/formations" style={{ color: '#7ca8d4', textDecoration: 'none', fontSize: 14 }}>
            Explore Courses →
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {favoris.map(fav => (
            <div key={fav._id} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(224,112,112,0.3)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}
            >
              <Link to={`/formations/${fav.formation?._id}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ height: 160, position: 'relative', background: 'linear-gradient(135deg, rgba(224,112,112,0.1), rgba(180,90,90,0.05))' }}>
                  {fav.formation?.image ? (
                    <img src={fav.formation.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e07070" strokeWidth="1.5" style={{ opacity: 0.3 }}>
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                      </svg>
                    </div>
                  )}
                  <button
                    onClick={(e) => handleRemove(e, fav._id)}
                    style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      width: 36,
                      height: 36,
                      borderRadius: '50%',
                      background: 'rgba(0,0,0,0.5)',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(224,112,112,0.8)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#e07070" stroke="none">
                      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                    </svg>
                  </button>
                </div>
              </Link>
              <div style={{ padding: 20 }}>
                <Link to={`/formations/${fav.formation?._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: '#f0ebe0', margin: '0 0 8px', fontWeight: 400 }}>
                    {fav.formation?.titre || 'Course'}
                  </h3>
                </Link>
                <div style={{ fontSize: 13, color: '#555', marginBottom: 12 }}>
                  {fav.formation?.centreId?.nom || 'No centre'}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 18, fontFamily: "'Cormorant Garamond', serif", color: '#7ca8d4' }}>
                    {fav.formation?.prix || 0} DT
                  </span>
                  <Link 
                    to={`/formations/${fav.formation?._id}`}
                    style={{
                      fontSize: 12,
                      color: '#e07070',
                      textDecoration: 'none',
                      padding: '6px 14px',
                      border: '1px solid rgba(224,112,112,0.3)',
                      borderRadius: 8,
                      transition: 'all 0.2s',
                    }}
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </ApprenantLayout>
  );
}
