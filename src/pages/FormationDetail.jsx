import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formationService, leconService, avisService, inscriptionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const StarIcon = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? '#b4915a' : 'none'} stroke="#b4915a" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const FormationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formation, setFormation] = useState(null);
  const [lecons, setLecons] = useState([]);
  const [avis, setAvis] = useState([]);
  const [newAvis, setNewAvis] = useState({ commentaire: '', note: 5 });
  const [error, setError] = useState('');
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    formationService.getById(id).then(r => setFormation(r.data.data || r.data)).catch(console.error);
    leconService.getByFormation(id).then(r => setLecons(r.data.data || r.data)).catch(console.error);
    avisService.getByFormation(id).then(r => setAvis(r.data.data || r.data)).catch(console.error);
  }, [id]);

  const handleInscription = async () => {
    if (!user) { navigate('/login'); return; }
    setEnrolling(true);
    try {
      await inscriptionService.create({ formation: id });
      setEnrolled(true);
      setTimeout(() => navigate('/my-inscriptions'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    } finally { setEnrolling(false); }
  };

  const handleAvisSubmit = async (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    try {
      const res = await avisService.create({ formation: id, commentaire: newAvis.commentaire, note: newAvis.note });
      setAvis(prev => [...prev, res.data.data || res.data]);
      setNewAvis({ commentaire: '', note: 5 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  const avgRating = avis.length ? (avis.reduce((s, a) => s + (a.note || 0), 0) / avis.length).toFixed(1) : null;

  if (!formation) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div className="fd-spinner" />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .fd-root { font-family: 'DM Sans', sans-serif; color: #e8e4dc; padding-top: 48px; }
        .fd-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.06); border-top-color: #b4915a; animation: fdspin 0.8s linear infinite; }
        @keyframes fdspin { to { transform: rotate(360deg); } }

        .fd-back { display: inline-flex; align-items: center; gap: 6px; color: #555; font-size: 13px; text-decoration: none; margin-bottom: 32px; transition: color 0.2s; }
        .fd-back:hover { color: #b4915a; }

        /* Hero */
        .fd-hero {
          display: grid; grid-template-columns: 1fr 320px; gap: 40px; align-items: start; margin-bottom: 64px;
        }
        @media (max-width: 900px) { .fd-hero { grid-template-columns: 1fr; } }

        .fd-cat-tag {
          display: inline-block; padding: 4px 12px; border-radius: 6px;
          background: rgba(180,145,90,0.1); border: 1px solid rgba(180,145,90,0.2);
          font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #b4915a;
          margin-bottom: 16px;
        }
        .fd-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(32px, 4vw, 52px); font-weight: 300;
          color: #f0ebe0; line-height: 1.1; margin-bottom: 20px;
        }
        .fd-desc { font-size: 15px; color: #666; line-height: 1.75; font-weight: 300; margin-bottom: 24px; }
        .fd-meta { display: flex; gap: 24px; flex-wrap: wrap; }
        .fd-meta-item { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #555; }
        .fd-meta-item strong { color: #888; }

        /* Enroll card */
        .fd-enroll-card {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 28px;
          position: sticky; top: 80px;
        }
        .fd-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 48px; font-weight: 300; color: #b4915a; line-height: 1;
          margin-bottom: 4px;
        }
        .fd-price-unit { font-size: 14px; color: #555; margin-bottom: 24px; }
        .fd-enroll-btn {
          width: 100%; padding: 15px;
          background: linear-gradient(135deg, #b4915a, #c8a86e);
          border: none; border-radius: 10px;
          color: #0c0c0e; font-size: 15px; font-weight: 500;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: opacity 0.2s; margin-bottom: 12px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .fd-enroll-btn:hover:not(:disabled) { opacity: 0.9; }
        .fd-enroll-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .fd-enroll-btn.success { background: linear-gradient(135deg, #4aa87d, #3d9068); }
        .fd-enroll-hint { font-size: 12px; color: #444; text-align: center; }
        .fd-card-divider { height: 1px; background: rgba(255,255,255,0.06); margin: 20px 0; }
        .fd-card-detail { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 10px; }
        .fd-card-detail-label { color: #555; }
        .fd-card-detail-value { color: #aaa; }

        /* Error */
        .fd-error { background: rgba(220,53,53,0.08); border: 1px solid rgba(220,53,53,0.2); border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #e07070; margin-bottom: 16px; }

        /* Section */
        .fd-section { margin-bottom: 56px; }
        .fd-section-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px; font-weight: 400; color: #f0ebe0;
          margin-bottom: 24px; padding-bottom: 16px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }

        /* Lessons */
        .fd-lecon {
          display: flex; align-items: center; gap: 16px;
          padding: 14px 16px; border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02);
          margin-bottom: 8px; transition: border-color 0.2s;
        }
        .fd-lecon:hover { border-color: rgba(180,145,90,0.2); }
        .fd-lecon-num { font-family: 'Cormorant Garamond', serif; font-size: 18px; color: rgba(180,145,90,0.4); min-width: 28px; }
        .fd-lecon-title { font-size: 14px; color: #e8e4dc; flex: 1; }
        .fd-lecon-dur { font-size: 12px; color: #444; }

        /* Reviews */
        .fd-rating-summary { display: flex; align-items: center; gap: 12px; margin-bottom: 28px; }
        .fd-rating-big { font-family: 'Cormorant Garamond', serif; font-size: 56px; font-weight: 300; color: #b4915a; line-height: 1; }
        .fd-rating-stars { display: flex; gap: 3px; margin-bottom: 4px; }
        .fd-rating-count { font-size: 12px; color: #555; }

        .fd-avis-card {
          padding: 20px; border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.06);
          background: rgba(255,255,255,0.02); margin-bottom: 12px;
        }
        .fd-avis-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 10px; }
        .fd-avis-stars { display: flex; gap: 2px; }
        .fd-avis-date { font-size: 11px; color: #444; }
        .fd-avis-comment { font-size: 13px; color: #777; line-height: 1.7; font-weight: 300; }

        /* Review form */
        .fd-review-form {
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; padding: 24px; margin-top: 24px;
        }
        .fd-review-title { font-size: 15px; font-weight: 500; color: #e8e4dc; margin-bottom: 20px; }
        .fd-label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #555; margin-bottom: 8px; display: block; }
        .fd-select {
          padding: 10px 14px; background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          color: #e8e4dc; font-family: 'DM Sans', sans-serif; font-size: 14px;
          outline: none; margin-bottom: 16px; cursor: pointer;
        }
        .fd-textarea {
          width: 100%; padding: 12px 14px;
          background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 8px; color: #e8e4dc; font-family: 'DM Sans', sans-serif;
          font-size: 14px; outline: none; resize: vertical; min-height: 96px;
          margin-bottom: 16px; transition: border-color 0.2s; box-sizing: border-box;
        }
        .fd-textarea:focus { border-color: rgba(180,145,90,0.4); }
        .fd-textarea::placeholder { color: #444; }
        .fd-submit-btn {
          padding: 11px 24px; background: linear-gradient(135deg, #b4915a, #c8a86e);
          border: none; border-radius: 8px; color: #0c0c0e;
          font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: opacity 0.2s;
        }
        .fd-submit-btn:hover { opacity: 0.9; }
        .fd-empty { font-size: 14px; color: #444; padding: 16px 0; }
      `}</style>

      <div className="fd-root">
        <Link to="/formations" className="fd-back">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back to courses
        </Link>

        {/* Hero grid */}
        <div className="fd-hero">
          <div>
            {(formation.categorie?.nom || formation.categorie?.name) && (
              <span className="fd-cat-tag">{formation.categorie.nom || formation.categorie.name}</span>
            )}
            <h1 className="fd-title">{formation.titre || formation.title}</h1>
            <p className="fd-desc">{formation.description}</p>
            <div className="fd-meta">
              <div className="fd-meta-item"><strong>Duration:</strong> {formation.duree || formation.duration}h</div>
              {avgRating && <div className="fd-meta-item"><strong>Rating:</strong> {avgRating}/5 ({avis.length} reviews)</div>}
            </div>
          </div>

          {/* Enroll card */}
          <div className="fd-enroll-card">
            <div className="fd-price">{formation.prix || formation.price}</div>
            <div className="fd-price-unit">Tunisian Dinar</div>
            {error && <div className="fd-error">{error}</div>}
            <button
              className={`fd-enroll-btn${enrolled ? ' success' : ''}`}
              onClick={handleInscription}
              disabled={enrolling || enrolled}
            >
              {enrolled ? '✓ Enrolled!' : enrolling ? 'Processing…' : 'Enroll Now'}
            </button>
            <p className="fd-enroll-hint">{user ? 'Secure enrollment' : 'Create a free account to enroll'}</p>
            <div className="fd-card-divider" />
            <div className="fd-card-detail"><span className="fd-card-detail-label">Duration</span><span className="fd-card-detail-value">{formation.duree || formation.duration}h</span></div>
            <div className="fd-card-detail"><span className="fd-card-detail-label">Lessons</span><span className="fd-card-detail-value">{lecons.length}</span></div>
            <div className="fd-card-detail"><span className="fd-card-detail-label">Language</span><span className="fd-card-detail-value">French / Arabic</span></div>
          </div>
        </div>

        {/* Lessons */}
        <div className="fd-section">
          <h2 className="fd-section-title">Course Content</h2>
          {lecons.length === 0 ? (
            <p className="fd-empty">No lessons available yet.</p>
          ) : lecons.map((l, i) => (
            <div key={l._id} className="fd-lecon">
              <div className="fd-lecon-num">{String(i + 1).padStart(2, '0')}</div>
              <div className="fd-lecon-title">{l.titre || l.title}</div>
              <div className="fd-lecon-dur">{l.duree || l.duration} min</div>
            </div>
          ))}
        </div>

        {/* Reviews */}
        <div className="fd-section">
          <h2 className="fd-section-title">Reviews</h2>
          {avgRating && (
            <div className="fd-rating-summary">
              <div className="fd-rating-big">{avgRating}</div>
              <div>
                <div className="fd-rating-stars">
                  {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= Math.round(avgRating)} />)}
                </div>
                <div className="fd-rating-count">{avis.length} review{avis.length !== 1 ? 's' : ''}</div>
              </div>
            </div>
          )}
          {avis.length === 0 && <p className="fd-empty">No reviews yet. Be the first!</p>}
          {avis.map(a => (
            <div key={a._id} className="fd-avis-card">
              <div className="fd-avis-header">
                <div className="fd-avis-stars">
                  {[1,2,3,4,5].map(n => <StarIcon key={n} filled={n <= a.note} />)}
                </div>
                {a.createdAt && <span className="fd-avis-date">{new Date(a.createdAt).toLocaleDateString()}</span>}
              </div>
              <p className="fd-avis-comment">{a.commentaire}</p>
            </div>
          ))}

          {user && (
            <form onSubmit={handleAvisSubmit} className="fd-review-form">
              <div className="fd-review-title">Leave a Review</div>
              <label className="fd-label">Rating</label>
              <select
                className="fd-select"
                value={newAvis.note}
                onChange={e => setNewAvis(p => ({ ...p, note: Number(e.target.value) }))}
              >
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} star{n !== 1 ? 's' : ''}</option>)}
              </select>
              <label className="fd-label">Comment</label>
              <textarea
                className="fd-textarea"
                placeholder="Share your experience…"
                value={newAvis.commentaire}
                onChange={e => setNewAvis(p => ({ ...p, commentaire: e.target.value }))}
              />
              <button type="submit" className="fd-submit-btn">Submit Review</button>
            </form>
          )}
          {!user && (
            <p style={{ fontSize: '13px', color: '#555', marginTop: 16 }}>
              <Link to="/login" style={{ color: '#b4915a' }}>Sign in</Link> to leave a review.
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default FormationDetail;