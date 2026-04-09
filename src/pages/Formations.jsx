import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formationService, categorieService } from '../services/api';

const Formations = () => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    categorieService.getAll()
      .then((res) => setCategories(res.data.data || res.data))
      .catch(console.error);

    formationService.getAll()
      .then((res) => {
        const all = res.data.data || res.data;
        setFormations(categoryId ? all.filter(f => f.categorie === categoryId || f.categorie?._id === categoryId) : all);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryId]);

  const filtered = formations.filter(f => {
    const q = searchQuery.toLowerCase();
    return !q || (f.titre || f.title || '').toLowerCase().includes(q) || (f.description || '').toLowerCase().includes(q);
  });

  const activeCat = categories.find(c => c._id === categoryId);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .fm-root { font-family: 'DM Sans', sans-serif; color: #e8e4dc; padding-top: 48px; }

        .fm-header { margin-bottom: 48px; }
        .fm-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(36px, 5vw, 56px); font-weight: 300;
          color: #f0ebe0; margin: 0 0 12px; line-height: 1.05;
        }
        .fm-title em { font-style: italic; color: #b4915a; }
        .fm-subtitle { font-size: 14px; color: #555; font-weight: 300; }

        /* Search */
        .fm-search-bar {
          position: relative; max-width: 480px; margin-bottom: 40px;
        }
        .fm-search-icon {
          position: absolute; left: 14px; top: 50%; transform: translateY(-50%);
          color: #444; pointer-events: none;
        }
        .fm-search-input {
          width: 100%; padding: 12px 16px 12px 42px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 10px; font-size: 14px; color: #e8e4dc;
          font-family: 'DM Sans', sans-serif; outline: none;
          transition: border-color 0.2s, background 0.2s;
        }
        .fm-search-input::placeholder { color: #444; }
        .fm-search-input:focus { border-color: rgba(180,145,90,0.4); background: rgba(180,145,90,0.04); }

        /* Category filters */
        .fm-cats {
          display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 40px;
        }
        .fm-cat-btn {
          padding: 6px 16px; border-radius: 40px;
          border: 1px solid rgba(255,255,255,0.09);
          background: transparent;
          color: #666; font-size: 12px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; text-decoration: none;
          transition: all 0.2s; display: inline-block;
          letter-spacing: 0.03em;
        }
        .fm-cat-btn:hover { color: #e8e4dc; border-color: rgba(255,255,255,0.2); }
        .fm-cat-btn.active {
          background: rgba(180,145,90,0.12);
          border-color: rgba(180,145,90,0.4);
          color: #b4915a;
        }

        /* Count */
        .fm-count { font-size: 12px; color: #444; margin-bottom: 24px; letter-spacing: 0.06em; text-transform: uppercase; }

        /* Grid */
        .fm-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        .fm-card {
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 14px; overflow: hidden;
          background: rgba(255,255,255,0.02);
          text-decoration: none;
          display: flex; flex-direction: column;
          transition: border-color 0.25s, transform 0.25s, box-shadow 0.25s;
        }
        .fm-card:hover {
          border-color: rgba(180,145,90,0.25);
          transform: translateY(-3px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.35);
        }
        .fm-card-thumb {
          height: 140px;
          background: linear-gradient(135deg, #111114, #1a1a22);
          display: flex; align-items: center; justify-content: center;
          position: relative;
        }
        .fm-card-glyph {
          font-family: 'Cormorant Garamond', serif;
          font-size: 72px; font-weight: 300;
          color: rgba(180,145,90,0.12);
          line-height: 1; user-select: none;
        }
        .fm-card-cat-tag {
          position: absolute; bottom: 12px; left: 12px;
          padding: 3px 9px; border-radius: 5px;
          background: rgba(180,145,90,0.12); border: 1px solid rgba(180,145,90,0.2);
          font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; color: #b4915a;
        }
        .fm-card-body { padding: 20px; flex: 1; display: flex; flex-direction: column; }
        .fm-card-title {
          font-size: 15px; font-weight: 500; color: #e8e4dc; margin-bottom: 8px;
          line-height: 1.4;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
        }
        .fm-card-desc {
          font-size: 12px; color: #555; line-height: 1.6; font-weight: 300;
          display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
          flex: 1; margin-bottom: 16px;
        }
        .fm-card-footer {
          display: flex; align-items: center; justify-content: space-between;
          padding-top: 14px; border-top: 1px solid rgba(255,255,255,0.05);
        }
        .fm-price {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px; color: #b4915a; font-weight: 400;
        }
        .fm-price-unit { font-size: 11px; color: #555; font-family: 'DM Sans', sans-serif; margin-left: 2px; }
        .fm-duration { font-size: 12px; color: #444; }

        /* Empty state */
        .fm-empty {
          text-align: center; padding: 80px 24px; color: #444;
        }
        .fm-empty-icon { font-size: 48px; margin-bottom: 16px; opacity: 0.4; }
        .fm-empty-title { font-size: 16px; color: #666; margin-bottom: 8px; }
        .fm-empty-desc { font-size: 13px; }

        /* Spinner */
        .fm-spinner {
          width: 32px; height: 32px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,0.06); border-top-color: #b4915a;
          animation: fmspin 0.8s linear infinite;
          margin: 80px auto;
        }
        @keyframes fmspin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="fm-root">
        <div className="fm-header">
          <h1 className="fm-title">
            {activeCat ? <>{activeCat.nom || activeCat.name} <em>Courses</em></> : <>All <em>Courses</em></>}
          </h1>
          <p className="fm-subtitle">Explore our full library of professional training programs</p>
        </div>

        {/* Search */}
        <div className="fm-search-bar">
          <span className="fm-search-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </span>
          <input
            className="fm-search-input"
            placeholder="Search courses…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Category filters */}
        <div className="fm-cats">
          <Link to="/formations" className={`fm-cat-btn${!categoryId ? ' active' : ''}`}>All</Link>
          {categories.map(cat => (
            <Link
              key={cat._id}
              to={`/formations?category=${cat._id}`}
              className={`fm-cat-btn${categoryId === cat._id ? ' active' : ''}`}
            >
              {cat.nom || cat.name}
            </Link>
          ))}
        </div>

        {loading ? (
          <div className="fm-spinner" />
        ) : (
          <>
            <div className="fm-count">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</div>
            {filtered.length === 0 ? (
              <div className="fm-empty">
                <div className="fm-empty-icon">◈</div>
                <div className="fm-empty-title">No courses found</div>
                <div className="fm-empty-desc">Try a different search or category</div>
              </div>
            ) : (
              <div className="fm-grid">
                {filtered.map((f, i) => (
                  <Link key={f._id} to={`/formations/${f._id}`} className="fm-card">
                    <div className="fm-card-thumb">
                      <div className="fm-card-glyph">{String.fromCharCode(65 + (i % 26))}</div>
                      {(f.categorie?.nom || f.categorie?.name) && (
                        <span className="fm-card-cat-tag">{f.categorie.nom || f.categorie.name}</span>
                      )}
                    </div>
                    <div className="fm-card-body">
                      <div className="fm-card-title">{f.titre || f.title}</div>
                      <div className="fm-card-desc">{f.description}</div>
                      <div className="fm-card-footer">
                        <div>
                          <span className="fm-price">{f.prix || f.price}</span>
                          <span className="fm-price-unit">DT</span>
                        </div>
                        <span className="fm-duration">{f.duree || f.duration}h</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Formations;