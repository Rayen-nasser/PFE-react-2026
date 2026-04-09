import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/api';

/* ─── icons ─── */
const EditIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const SaveIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const Spinner = () => (
  <svg className="pf-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);
const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

/* ─── role badge ─── */
const ROLE_META = {
  apprenant:     { label: 'Student',        color: '#6a9fd8', bg: 'rgba(106,159,216,.12)', icon: '🎓' },
  formateur:     { label: 'Trainer',         color: '#c8a86e', bg: 'rgba(200,168,110,.12)', icon: '🧑‍🏫' },
  responsableCF: { label: 'Center Manager',  color: '#7dbf7d', bg: 'rgba(125,191,125,.12)', icon: '🏢' },
  admin:         { label: 'Admin',            color: '#e07070', bg: 'rgba(220,110,110,.12)', icon: '🔑' },
};

/* ─── inline editable field ─── */
const InfoRow = ({ label, value, name, editing, formData, onChange, type = 'text', children }) => {
  if (!editing) {
    return (
      <div className="pf-info-row">
        <span className="pf-info-label">{label}</span>
        <span className="pf-info-value">{value || <span className="pf-info-empty">—</span>}</span>
      </div>
    );
  }
  return (
    <div className="pf-info-row pf-info-row--edit">
      <span className="pf-info-label">{label}</span>
      {children ? (
        <select name={name} value={formData[name]} onChange={onChange} className="pf-input pf-select">
          {children}
        </select>
      ) : (
        <input type={type} name={name} value={formData[name]} onChange={onChange} className="pf-input" />
      )}
    </div>
  );
};

const Profile = () => {
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    nom: '', prenom: '', telephone: '',
    niveauEtude: '', dateNaissance: '', adresse: '',
    specialite: '', experience: '',
  });

  useEffect(() => {
    if (!authLoading && !user) navigate('/login', { state: { from: { pathname: '/profile' } } });
    else if (user) fetchProfile();
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const res = await authService.getProfile();
      const d = res.data.data || res.data;
      setProfile(d);
      setFormData({
        nom:           d.nom           || '',
        prenom:        d.prenom        || '',
        telephone:     d.telephone     || '',
        niveauEtude:   d.niveauEtude   || '',
        dateNaissance: d.dateNaissance ? d.dateNaissance.split('T')[0] : '',
        adresse:       d.adresse       || '',
        specialite:    d.specialite    || '',
        experience:    d.experience    || '',
      });
    } catch {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(p => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      await authService.updateProfile(formData);
      setSuccess('Profile updated successfully');
      setEditing(false);
      await fetchProfile();
      setTimeout(() => setSuccess(''), 4000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError('');
    // reset
    if (profile) {
      setFormData({
        nom:           profile.nom           || '',
        prenom:        profile.prenom        || '',
        telephone:     profile.telephone     || '',
        niveauEtude:   profile.niveauEtude   || '',
        dateNaissance: profile.dateNaissance ? profile.dateNaissance.split('T')[0] : '',
        adresse:       profile.adresse       || '',
        specialite:    profile.specialite    || '',
        experience:    profile.experience    || '',
      });
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const roleMeta = ROLE_META[profile?.role] || {};

  if (loading || authLoading) return (
    <div className="pf-loading">
      <div className="pf-loading-ring" />
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

        .pf-root {
          min-height: 100vh; background: #0c0c0e;
          font-family: 'DM Sans', sans-serif; color: #e8e4dc;
          padding: 40px 24px;
        }
        .pf-loading {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: #0c0c0e;
        }
        .pf-loading-ring {
          width: 40px; height: 40px; border-radius: 50%;
          border: 2px solid rgba(255,255,255,.08); border-top-color: #b4915a;
          animation: pf-spin .8s linear infinite;
        }
        @keyframes pf-spin { to { transform: rotate(360deg); } }

        .pf-container { max-width: 640px; margin: 0 auto; }

        /* ── top bar ── */
        .pf-topbar {
          display: flex; align-items: center; justify-content: space-between; margin-bottom: 40px;
        }
        .pf-logo {
          font-family: 'Cormorant Garamond', serif;
          font-size: 20px; font-weight: 500; color: #b4915a; letter-spacing: .04em;
        }
        .pf-logout-btn {
          display: flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.09);
          border-radius: 8px; padding: 8px 14px; color: #888; font-size: 13px;
          font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s;
        }
        .pf-logout-btn:hover { border-color: rgba(220,110,110,.4); color: #e07070; }

        /* ── card ── */
        .pf-card {
          background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.08);
          border-radius: 16px; overflow: hidden;
        }

        /* ── hero ── */
        .pf-hero {
          background: linear-gradient(145deg, #111114 0%, #1a1a22 100%);
          padding: 36px 32px; position: relative; overflow: hidden;
        }
        .pf-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: radial-gradient(ellipse 60% 80% at 80% 50%, rgba(180,145,90,.08) 0%, transparent 65%);
        }
        .pf-hero-content { position: relative; display: flex; align-items: center; gap: 24px; }
        .pf-avatar {
          width: 72px; height: 72px; border-radius: 50%;
          border: 2px solid rgba(180,145,90,.3);
          flex-shrink: 0; background: rgba(255,255,255,.05);
          display: flex; align-items: center; justify-content: center;
          font-size: 28px; overflow: hidden;
        }
        .pf-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .pf-hero-text h1 {
          font-family: 'Cormorant Garamond', serif;
          font-size: 26px; font-weight: 400; color: #f0ebe0; margin: 0 0 6px;
        }
        .pf-hero-text p { font-size: 13px; color: #666; margin: 0 0 12px; }
        .pf-role-badge {
          display: inline-flex; align-items: center; gap: 5px;
          padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 500;
          letter-spacing: .06em; text-transform: uppercase;
        }

        /* ── body ── */
        .pf-body { padding: 28px 32px; }

        /* ── section ── */
        .pf-section { margin-bottom: 28px; }
        .pf-section-header {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,.06);
        }
        .pf-section-title {
          font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #555; font-weight: 500;
        }

        /* ── info rows ── */
        .pf-info-row {
          display: flex; align-items: center; padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,.04);
        }
        .pf-info-row:last-child { border-bottom: none; }
        .pf-info-row--edit { align-items: center; }
        .pf-info-label {
          width: 160px; font-size: 12px; color: #555; letter-spacing: .04em;
          text-transform: uppercase; flex-shrink: 0;
        }
        .pf-info-value { font-size: 14px; color: #e8e4dc; }
        .pf-info-empty { color: #333; }

        /* ── inline input ── */
        .pf-input {
          flex: 1; padding: 8px 12px; background: rgba(255,255,255,.05);
          border: 1px solid rgba(255,255,255,.12); border-radius: 7px;
          font-size: 13px; color: #e8e4dc; font-family: 'DM Sans', sans-serif;
          outline: none; transition: border-color .2s;
        }
        .pf-input:focus { border-color: #b4915a; }
        .pf-select { appearance: none; cursor: pointer; }

        /* ── action buttons ── */
        .pf-actions { display: flex; gap: 10px; }
        .pf-btn-edit {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 16px; background: rgba(180,145,90,.1);
          border: 1px solid rgba(180,145,90,.25); border-radius: 8px;
          color: #b4915a; font-size: 13px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all .2s;
        }
        .pf-btn-edit:hover { background: rgba(180,145,90,.18); }
        .pf-btn-save {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 18px; background: linear-gradient(135deg, #b4915a, #c8a86e);
          border: none; border-radius: 8px;
          color: #0c0c0e; font-size: 13px; font-weight: 500; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: opacity .2s;
        }
        .pf-btn-save:disabled { opacity: .5; cursor: not-allowed; }
        .pf-btn-cancel {
          padding: 8px 16px; background: transparent;
          border: 1px solid rgba(255,255,255,.1); border-radius: 8px;
          color: #666; font-size: 13px; font-family: 'DM Sans', sans-serif;
          cursor: pointer; transition: all .2s;
        }
        .pf-btn-cancel:hover { border-color: rgba(255,255,255,.2); color: #aaa; }

        .pf-spinner { animation: pf-spin .8s linear infinite; }

        /* ── toast ── */
        .pf-toast {
          position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
          padding: 12px 20px; border-radius: 10px; font-size: 13px; font-weight: 500;
          display: flex; align-items: center; gap: 8px;
          box-shadow: 0 8px 32px rgba(0,0,0,.4); z-index: 999;
          animation: pf-toast-in .3s ease;
        }
        .pf-toast.success { background: #1a2e1a; border: 1px solid rgba(74,168,125,.3); color: #4aa87d; }
        .pf-toast.error   { background: #2e1a1a; border: 1px solid rgba(220,110,110,.3); color: #e07070; }
        @keyframes pf-toast-in { from { opacity:0; transform: translateX(-50%) translateY(10px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

        .pf-role-section-label {
          font-size: 11px; letter-spacing: .14em; text-transform: uppercase; color: #555;
          margin-bottom: 18px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,.06);
          font-weight: 500;
        }
      `}</style>

      <div className="pf-root">
        <div className="pf-container">
          {/* Topbar */}
          <div className="pf-topbar">
            <div className="pf-logo">Forma</div>
            <button className="pf-logout-btn" onClick={handleLogout}>
              <LogoutIcon /> Sign out
            </button>
          </div>

          <div className="pf-card">
            {/* Hero */}
            <div className="pf-hero">
              <div className="pf-hero-content">
                <div className="pf-avatar">
                  {profile?.user_image
                    ? <img src={`http://localhost:5000/${profile.user_image}`} alt="Avatar" />
                    : roleMeta.icon || '👤'
                  }
                </div>
                <div className="pf-hero-text">
                  <h1>{profile?.nom} {profile?.prenom}</h1>
                  <p>{profile?.email}</p>
                  {roleMeta.label && (
                    <span className="pf-role-badge" style={{ color: roleMeta.color, background: roleMeta.bg, border: `1px solid ${roleMeta.color}30` }}>
                      {roleMeta.icon} {roleMeta.label}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="pf-body">
              {/* Section: Personal */}
              <div className="pf-section">
                <div className="pf-section-header">
                  <span className="pf-section-title">Personal Information</span>
                  {!editing ? (
                    <button className="pf-btn-edit" onClick={() => setEditing(true)}>
                      <EditIcon /> Edit
                    </button>
                  ) : (
                    <div className="pf-actions">
                      <button className="pf-btn-cancel" onClick={handleCancel}>Cancel</button>
                      <button className="pf-btn-save" onClick={handleSave} disabled={saving}>
                        {saving ? <Spinner /> : <SaveIcon />}
                        {saving ? 'Saving…' : 'Save'}
                      </button>
                    </div>
                  )}
                </div>

                <InfoRow label="First Name" value={profile?.nom}       name="nom"       editing={editing} formData={formData} onChange={handleChange} />
                <InfoRow label="Last Name"  value={profile?.prenom}    name="prenom"    editing={editing} formData={formData} onChange={handleChange} />
                <InfoRow label="Email"      value={profile?.email}     name="email"     editing={false}   formData={formData} onChange={handleChange} />
                <InfoRow label="Phone"      value={profile?.telephone} name="telephone" editing={editing} formData={formData} onChange={handleChange} type="tel" />
              </div>

              {/* Role-specific */}
              {profile?.role === 'apprenant' && (
                <div className="pf-section">
                  <p className="pf-role-section-label">Academic Details</p>
                  <InfoRow
                    label="Education Level"
                    value={profile?.niveauEtude}
                    name="niveauEtude"
                    editing={editing} formData={formData} onChange={handleChange}
                  >
                    <option value="">Select level</option>
                    {['primaire','secondaire','bac','licence','master','doctorat'].map(v => (
                      <option key={v} value={v}>{v.charAt(0).toUpperCase()+v.slice(1)}</option>
                    ))}
                  </InfoRow>
                  <InfoRow
                    label="Date of Birth"
                    value={profile?.dateNaissance ? new Date(profile.dateNaissance).toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' }) : ''}
                    name="dateNaissance"
                    editing={editing} formData={formData} onChange={handleChange} type="date"
                  />
                  <InfoRow label="Address" value={profile?.adresse} name="adresse" editing={editing} formData={formData} onChange={handleChange} />
                </div>
              )}

              {profile?.role === 'formateur' && (
                <div className="pf-section">
                  <p className="pf-role-section-label">Professional Details</p>
                  <InfoRow label="Specialty"    value={profile?.specialite} name="specialite" editing={editing} formData={formData} onChange={handleChange} />
                  <InfoRow
                    label="Experience"
                    value={profile?.experience ? `${profile.experience} year${profile.experience !== 1 ? 's' : ''}` : ''}
                    name="experience"
                    editing={editing} formData={formData} onChange={handleChange} type="number"
                  />
                </div>
              )}

              {profile?.role === 'responsableCF' && (
                <div className="pf-section">
                  <p className="pf-role-section-label">Center Details</p>
                  <div className="pf-info-row">
                    <span className="pf-info-label">Managed Center</span>
                    <span className="pf-info-value">{profile?.centreGereId || <span className="pf-info-empty">—</span>}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      {success && (
        <div className="pf-toast success">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
          {success}
        </div>
      )}
      {error && (
        <div className="pf-toast error">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          {error}
        </div>
      )}
    </>
  );
};

export default Profile;