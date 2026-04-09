import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inscriptionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_META = {
  pending:   { label: 'Pending',   color: '#c8a86e', bg: 'rgba(200,168,110,0.1)' },
  confirmed: { label: 'Confirmed', color: '#4aa87d', bg: 'rgba(74,168,125,0.1)' },
  cancelled: { label: 'Cancelled', color: '#e07070', bg: 'rgba(220,110,110,0.1)' },
  completed: { label: 'Completed', color: '#6a9fd8', bg: 'rgba(106,159,216,0.1)' },
};

const MyInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      inscriptionService.getMyInscriptions()
        .then((res) => setInscriptions(res.data.data || res.data))
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [user]);

  if (!user) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', fontFamily: 'DM Sans, sans-serif', color: '#555' }}>
      <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.4 }}>🎓</div>
      <p style={{ marginBottom: 16, color: '#666' }}>Please sign in to view your enrollments.</p>
      <Link to="/login" style={{ color: '#b4915a', fontWeight: 500 }}>Sign In</Link>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .mi-root { font-family: 'DM Sans', sans-serif; color: #e8e4dc; padding-top: 48px; }
        .mi-header { margin-bottom: 40px; }
        .mi-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 48px); font-weight: 300; color: #f0ebe0; margin: 0 0 8px; }
        .mi-title em { font-style: italic; color: #b4915a; }
        .mi-subtitle { font-size: 14px; color: #555; }

        .mi-list { display: flex; flex-direction: column; gap: 12px; }
        .mi-card {
          display: flex; align-items: center; gap: 20px;
          padding: 20px 24px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.07);
          background: rgba(255,255,255,0.02);
          transition: border-color 0.2s;
        }
        .mi-card:hover { border-color: rgba(255,255,255,0.12); }
        .mi-card-icon {
          width: 44px; height: 44px; border-radius: 10px; flex-shrink: 0;
          background: linear-gradient(135deg, #111114, #1a1a22);
          border: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif; font-size: 20px; color: rgba(180,145,90,0.5);
        }
        .mi-card-info { flex: 1; min-width: 0; }
        .mi-card-name { font-size: 15px; font-weight: 500; color: #e8e4dc; margin-bottom: 4px;
          white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .mi-card-date { font-size: 12px; color: #444; }
        .mi-status {
          padding: 4px 12px; border-radius: 20px; font-size: 11px;
          letter-spacing: 0.08em; text-transform: uppercase; font-weight: 500;
          flex-shrink: 0;
        }
        .mi-view-link {
          font-size: 12px; color: #b4915a; text-decoration: none;
          padding: 6px 14px; border: 1px solid rgba(180,145,90,0.2); border-radius: 7px;
          transition: background 0.2s; flex-shrink: 0;
        }
        .mi-view-link:hover { background: rgba(180,145,90,0.08); }

        .mi-empty { text-align: center; padding: 80px 24px; color: #444; }
        .mi-empty-icon { font-size: 44px; margin-bottom: 16px; opacity: 0.3; }
        .mi-empty-title { font-size: 16px; color: #666; margin-bottom: 8px; }
        .mi-empty-desc { font-size: 13px; margin-bottom: 24px; }
        .mi-explore-link { color: #b4915a; text-decoration: none; font-size: 14px; font-weight: 500; border: 1px solid rgba(180,145,90,0.3); padding: 10px 20px; border-radius: 8px; }

        .mi-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.06); border-top-color: #b4915a; animation: mispin 0.8s linear infinite; margin: 80px auto; display: block; }
        @keyframes mispin { to { transform: rotate(360deg); } }

        @media (max-width: 600px) { .mi-card { flex-wrap: wrap; } .mi-status { order: -1; } }
      `}</style>

      <div className="mi-root">
        <div className="mi-header">
          <h1 className="mi-title">My <em>Enrollments</em></h1>
          <p className="mi-subtitle">Track your learning progress and course status</p>
        </div>

        {loading ? <div className="mi-spinner" /> : inscriptions.length === 0 ? (
          <div className="mi-empty">
            <div className="mi-empty-icon">🎓</div>
            <div className="mi-empty-title">No enrollments yet</div>
            <div className="mi-empty-desc">Start learning by enrolling in a course</div>
            <Link to="/formations" className="mi-explore-link">Explore Courses</Link>
          </div>
        ) : (
          <div className="mi-list">
            {inscriptions.map((ins, i) => {
              const status = ins.statut || ins.status || 'pending';
              const meta = STATUS_META[status] || STATUS_META.pending;
              return (
                <div key={ins._id} className="mi-card">
                  <div className="mi-card-icon">{String.fromCharCode(65 + (i % 26))}</div>
                  <div className="mi-card-info">
                    <div className="mi-card-name">{ins.formation?.titre || ins.formation?.title || 'Formation'}</div>
                    <div className="mi-card-date">{new Date(ins.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
                  </div>
                  <span className="mi-status" style={{ color: meta.color, background: meta.bg }}>{meta.label}</span>
                  {ins.formation?._id && (
                    <Link to={`/formations/${ins.formation._id}`} className="mi-view-link">View →</Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default MyInscriptions;