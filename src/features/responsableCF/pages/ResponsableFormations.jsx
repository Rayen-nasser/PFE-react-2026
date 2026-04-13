import { useState, useEffect } from 'react';
import { formationService } from '../services/formation';
import { centreService } from '../services/centre';
import { categorieService } from '../../formations/services/categories';
import ResponsableCFLayout from '../components/ResponsableCFLayout';

export default function ResponsableFormations() {
  const [formations, setFormations] = useState([]);
  const [centres, setCentres] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingFormation, setEditingFormation] = useState(null);
  const [formData, setFormData] = useState({ titre: '', description: '', prix: 0, duree: 0, centreId: '', categorieId: '', image: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [formationsRes, centresRes, categoriesRes] = await Promise.all([
        formationService.getAll(),
        centreService.getMyCentres(),
        categorieService.getAll(),
      ]);
      setFormations(formationsRes.data.data || []);
      setCentres(centresRes.data.data || []);
      setCategories(categoriesRes.data.data || []);
    } catch {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.titre.trim() || !formData.centreId) return;

    setSubmitting(true);
    try {
      if (editingFormation) {
        await formationService.update(editingFormation._id, formData);
      } else {
        await formationService.create(formData);
      }
      setShowModal(false);
      setEditingFormation(null);
      setFormData({ titre: '', description: '', prix: 0, duree: 0, centreId: '', categorieId: '', image: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save formation');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (formation) => {
    setEditingFormation(formation);
    setFormData({
      titre: formation.titre || '',
      description: formation.description || '',
      prix: formation.prix || 0,
      duree: formation.duree || 0,
      centreId: formation.centreId?._id || '',
      categorieId: formation.categorieId?._id || '',
      image: formation.image || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this formation?')) return;
    try {
      await formationService.delete(id);
      fetchData();
    } catch {
      setError('Failed to delete formation');
    }
  };

  const openCreateModal = () => {
    setEditingFormation(null);
    setFormData({ titre: '', description: '', prix: 0, duree: 0, centreId: centres[0]?._id || '', categorieId: '', image: '' });
    setShowModal(true);
  };

  return (
    <ResponsableCFLayout title="My <em>Formations</em>" subtitle="Manage your training courses">
      <style>{`
        .rf-add-btn { padding: 10px 20px; background: linear-gradient(135deg, #c8a86e, #b4915a); color: #0c0c0e; font-size: 14px; font-weight: 500; border: none; border-radius: 8px; cursor: pointer; transition: opacity 0.2s; font-family: 'DM Sans', sans-serif; }
        .rf-add-btn:hover { opacity: 0.9; }

        .rf-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
        .rf-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; overflow: hidden; transition: border-color 0.2s, transform 0.2s; }
        .rf-card:hover { border-color: rgba(200,168,110,0.3); transform: translateY(-2px); }
        .rf-card-image { width: 100%; height: 160px; object-fit: cover; background: linear-gradient(135deg, rgba(200,168,110,0.2), rgba(180,145,90,0.1)); display: flex; align-items: center; justify-content: center; }
        .rf-card-image img { width: 100%; height: 100%; object-fit: cover; }
        .rf-card-image svg { width: 48px; height: 48px; opacity: 0.3; color: #c8a86e; }
        .rf-card-body { padding: 20px; }
        .rf-card-title { font-family: 'Cormorant Garamond', serif; font-size: 20px; font-weight: 400; color: #f0ebe0; margin: 0 0 8px; }
        .rf-card-meta { font-size: 12px; color: #555; margin-bottom: 8px; }
        .rf-card-price { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #c8a86e; margin-bottom: 8px; }
        .rf-card-price.free { color: #4aa87d; }
        .rf-card-actions { display: flex; gap: 8px; }

        .rf-btn { flex: 1; padding: 8px 16px; border-radius: 8px; font-size: 13px; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); background: transparent; font-family: 'DM Sans', sans-serif; }
        .rf-btn-edit { color: #c8a86e; }
        .rf-btn-edit:hover { background: rgba(200,168,110,0.15); }
        .rf-btn-delete { color: #e07070; }
        .rf-btn-delete:hover { background: rgba(224,112,112,0.15); }

        .rf-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; overflow-y: auto; }
        .rf-modal { background: #1a1a1e; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; max-width: 600px; width: 100%; margin: 40px auto; }
        .rf-modal-header { display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .rf-modal-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: #f0ebe0; }
        .rf-modal-close { background: none; border: none; color: #555; cursor: pointer; font-size: 24px; }
        .rf-modal-close:hover { color: #e8e4dc; }
        .rf-modal-body { padding: 24px; max-height: 60vh; overflow-y: auto; }
        .rf-form-group { margin-bottom: 16px; }
        .rf-form-label { display: block; font-size: 12px; text-transform: uppercase; letter-spacing: 0.08em; color: #555; margin-bottom: 8px; }
        .rf-form-input, .rf-form-textarea, .rf-form-select { width: 100%; padding: 12px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e8e4dc; font-size: 14px; font-family: 'DM Sans', sans-serif; }
        .rf-form-textarea { min-height: 100px; resize: vertical; }
        .rf-form-select { cursor: pointer; }
        .rf-form-input:focus, .rf-form-textarea:focus, .rf-form-select:focus { border-color: #c8a86e; outline: none; }
        .rf-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .rf-modal-footer { display: flex; justify-content: flex-end; gap: 12px; padding: 20px 24px; border-top: 1px solid rgba(255,255,255,0.06); }
        .rf-btn-cancel { padding: 10px 20px; border-radius: 8px; font-size: 14px; cursor: pointer; border: 1px solid rgba(255,255,255,0.1); background: transparent; color: #888; font-family: 'DM Sans', sans-serif; }
        .rf-btn-cancel:hover { border-color: rgba(255,255,255,0.2); color: #e8e4dc; }
        .rf-btn-submit { padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 500; cursor: pointer; border: none; background: linear-gradient(135deg, #c8a86e, #b4915a); color: #0c0c0e; font-family: 'DM Sans', sans-serif; }
        .rf-btn-submit:hover { opacity: 0.9; }
        .rf-btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

        .rf-empty { text-align: center; padding: 60px 20px; color: #555; }
        .rf-empty-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; color: #888; margin-bottom: 8px; }
        .rf-error { padding: 12px 16px; background: rgba(224,112,112,0.1); border: 1px solid rgba(224,112,112,0.3); border-radius: 8px; color: #e07070; font-size: 14px; margin-bottom: 20px; }
        .rf-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.06); border-top-color: #c8a86e; animation: rfspin 0.8s linear infinite; margin: 60px auto; display: block; }
        @keyframes rfspin { to { transform: rotate(360deg); } }
      `}</style>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px' }}>
        <button className="rf-add-btn" onClick={openCreateModal} disabled={centres.length === 0}>+ Add Formation</button>
      </div>

      {error && <div className="rf-error">{error}</div>}
      {centres.length === 0 && !loading && (
        <div className="rf-error">Please create a centre first before adding formations.</div>
      )}

      {loading ? (
        <div className="rf-spinner" />
      ) : formations.length === 0 ? (
        <div className="rf-empty">
          <div className="rf-empty-title">No formations yet</div>
          <p>Create your first training course</p>
        </div>
      ) : (
        <div className="rf-grid">
          {formations.map(formation => (
            <div key={formation._id} className="rf-card">
              <div className="rf-card-image">
                {formation.image ? (
                  <img src={formation.image} alt={formation.titre} />
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
                )}
              </div>
              <div className="rf-card-body">
                <h3 className="rf-card-title">{formation.titre}</h3>
                <div className="rf-card-meta">
                  {formation.centreId?.nom || 'No centre'} &middot; {formation.duree || 0}h
                </div>
                <div className={`rf-card-price ${formation.prix === 0 ? 'free' : ''}`}>
                  {formation.prix === 0 ? 'Free' : `${formation.prix} DT`}
                </div>
                <div className="rf-card-actions">
                  <button className="rf-btn rf-btn-edit" onClick={() => handleEdit(formation)}>Edit</button>
                  <button className="rf-btn rf-btn-delete" onClick={() => handleDelete(formation._id)}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="rf-modal-overlay" onClick={() => setShowModal(false)}>
          <div className="rf-modal" onClick={e => e.stopPropagation()}>
            <div className="rf-modal-header">
              <h2 className="rf-modal-title">{editingFormation ? 'Edit Formation' : 'Add Formation'}</h2>
              <button className="rf-modal-close" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="rf-modal-body">
                <div className="rf-form-group">
                  <label className="rf-form-label">Title *</label>
                  <input type="text" className="rf-form-input" value={formData.titre} onChange={e => setFormData(d => ({ ...d, titre: e.target.value }))} placeholder="Formation title" required />
                </div>
                <div className="rf-form-group">
                  <label className="rf-form-label">Description</label>
                  <textarea className="rf-form-textarea" value={formData.description} onChange={e => setFormData(d => ({ ...d, description: e.target.value }))} placeholder="Description..." />
                </div>
                <div className="rf-form-row">
                  <div className="rf-form-group">
                    <label className="rf-form-label">Price (DT)</label>
                    <input type="number" className="rf-form-input" value={formData.prix} onChange={e => setFormData(d => ({ ...d, prix: Number(e.target.value) }))} min="0" step="0.01" />
                  </div>
                  <div className="rf-form-group">
                    <label className="rf-form-label">Duration (hours)</label>
                    <input type="number" className="rf-form-input" value={formData.duree} onChange={e => setFormData(d => ({ ...d, duree: Number(e.target.value) }))} min="0" />
                  </div>
                </div>
                <div className="rf-form-row">
                  <div className="rf-form-group">
                    <label className="rf-form-label">Centre *</label>
                    <select className="rf-form-select" value={formData.centreId} onChange={e => setFormData(d => ({ ...d, centreId: e.target.value }))} required>
                      <option value="">Select centre</option>
                      {centres.map(c => (
                        <option key={c._id} value={c._id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>
                  <div className="rf-form-group">
                    <label className="rf-form-label">Category</label>
                    <select className="rf-form-select" value={formData.categorieId} onChange={e => setFormData(d => ({ ...d, categorieId: e.target.value }))}>
                      <option value="">Select category</option>
                      {categories.map(c => (
                        <option key={c._id} value={c._id}>{c.nom}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="rf-form-group">
                  <label className="rf-form-label">Image URL</label>
                  <input type="text" className="rf-form-input" value={formData.image} onChange={e => setFormData(d => ({ ...d, image: e.target.value }))} placeholder="Image URL" />
                </div>
              </div>
              <div className="rf-modal-footer">
                <button type="button" className="rf-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="rf-btn-submit" disabled={submitting || !formData.titre.trim() || !formData.centreId}>
                  {submitting ? 'Saving...' : (editingFormation ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </ResponsableCFLayout>
  );
}
