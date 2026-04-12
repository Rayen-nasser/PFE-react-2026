import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import userService from '../../services/users';
import StatusBadge from '../../shared/components/StatusBadge';

const ROLES = {
  apprenant: { label: 'Apprenant', color: '#6a9fd8', bg: 'rgba(106,159,216,.15)' },
  formateur: { label: 'Formateur', color: '#c8a86e', bg: 'rgba(200,168,110,.15)' },
  responsableCF: { label: 'Responsable CF', color: '#7dbf7d', bg: 'rgba(125,191,125,.15)' },
  admin: { label: 'Admin', color: '#e07070', bg: 'rgba(224,112,112,.15)' },
};

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await userService.getAll();
      setUsers(res.data.data || res.data);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleBlock = async (userId) => {
    setActionLoading(userId);
    try {
      await userService.block(userId);
      setUsers(users.map(u => u._id === userId ? { ...u, block: true } : u));
    } catch (err) {
      setError('Failed to block user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnblock = async (userId) => {
    setActionLoading(userId);
    try {
      await userService.unblock(userId);
      setUsers(users.map(u => u._id === userId ? { ...u, block: false } : u));
    } catch (err) {
      setError('Failed to unblock user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setActionLoading(userId);
    try {
      await userService.changeRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      setError('Failed to change role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    setActionLoading(userId);
    try {
      await userService.delete(userId);
      setUsers(users.filter(u => u._id !== userId));
    } catch (err) {
      setError('Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesFilter = filter === 'all' || user.role === filter;
    const matchesSearch = !search || 
      user.nom?.toLowerCase().includes(search.toLowerCase()) ||
      user.prenom?.toLowerCase().includes(search.toLowerCase()) ||
      user.email?.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const stats = {
    total: users.length,
    apprenant: users.filter(u => u.role === 'apprenant').length,
    formateur: users.filter(u => u.role === 'formateur').length,
    responsableCF: users.filter(u => u.role === 'responsableCF').length,
    admin: users.filter(u => u.role === 'admin').length,
    blocked: users.filter(u => u.block).length,
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');
        .ad-root { font-family: 'DM Sans', sans-serif; color: #e8e4dc; padding-top: 48px; min-height: 100vh; background: #0c0c0e; }
        .ad-header { margin-bottom: 32px; }
        .ad-title { font-family: 'Cormorant Garamond', serif; font-size: clamp(32px, 4vw, 48px); font-weight: 300; color: #f0ebe0; margin: 0 0 8px; }
        .ad-title em { font-style: italic; color: #b4915a; }
        .ad-subtitle { font-size: 14px; color: #555; font-weight: 300; }
        
        .ad-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .ad-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 12px; padding: 16px 20px; }
        .ad-stat-val { font-family: 'Cormorant Garamond', serif; font-size: 32px; font-weight: 400; color: #b4915a; }
        .ad-stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-top: 4px; }
        
        .ad-filters { display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 24px; align-items: center; }
        .ad-search { flex: 1; min-width: 200px; padding: 10px 16px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; color: #e8e4dc; font-size: 14px; outline: none; }
        .ad-search:focus { border-color: #b4915a; }
        .ad-search::placeholder { color: #555; }
        
        .ad-tabs { display: flex; gap: 4px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 4px; }
        .ad-tab { padding: 8px 16px; border: none; background: transparent; color: #555; font-size: 13px; border-radius: 6px; cursor: pointer; transition: all 0.2s; font-family: 'DM Sans', sans-serif; }
        .ad-tab:hover { color: #888; }
        .ad-tab.active { background: rgba(180,145,90,0.15); color: #b4915a; }
        .ad-tab-count { margin-left: 6px; opacity: 0.7; }
        
        .ad-table-wrap { overflow-x: auto; }
        .ad-table { width: 100%; border-collapse: collapse; }
        .ad-table th { text-align: left; padding: 12px 16px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; border-bottom: 1px solid rgba(255,255,255,0.06); }
        .ad-table td { padding: 14px 16px; border-bottom: 1px solid rgba(255,255,255,0.04); font-size: 14px; }
        .ad-table tr:hover td { background: rgba(255,255,255,0.02); }
        
        .ad-user-cell { display: flex; align-items: center; gap: 12px; }
        .ad-avatar { width: 36px; height: 36px; border-radius: 50%; background: rgba(180,145,90,0.15); display: flex; align-items: center; justify-content: center; font-size: 14px; color: #b4915a; overflow: hidden; }
        .ad-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .ad-user-name { font-weight: 500; color: #e8e4dc; }
        .ad-user-email { font-size: 12px; color: #555; }
        
        .ad-role-badge { display: inline-flex; align-items: center; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.06em; }
        
        .ad-blocked { opacity: 0.5; }
        .ad-blocked-label { display: inline-flex; align-items: center; gap: 4px; padding: 4px 8px; background: rgba(224,112,112,0.15); color: #e07070; border-radius: 4px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
        
        .ad-actions { display: flex; gap: 6px; }
        .ad-btn { padding: 6px 12px; border-radius: 6px; font-size: 12px; cursor: pointer; transition: all 0.2s; border: 1px solid rgba(255,255,255,0.1); background: transparent; font-family: 'DM Sans', sans-serif; }
        .ad-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .ad-btn-role { color: #b4915a; }
        .ad-btn-role:hover:not(:disabled) { background: rgba(180,145,90,0.15); }
        .ad-btn-block { color: #c8a86e; }
        .ad-btn-block:hover:not(:disabled) { background: rgba(200,168,110,0.15); }
        .ad-btn-unblock { color: #4aa87d; }
        .ad-btn-unblock:hover:not(:disabled) { background: rgba(74,168,125,0.15); }
        .ad-btn-delete { color: #e07070; }
        .ad-btn-delete:hover:not(:disabled) { background: rgba(224,112,112,0.15); }
        
        .ad-role-select { padding: 6px 10px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; color: #e8e4dc; font-size: 12px; cursor: pointer; }
        
        .ad-error { padding: 12px 16px; background: rgba(224,112,112,0.1); border: 1px solid rgba(224,112,112,0.3); border-radius: 8px; color: #e07070; font-size: 14px; margin-bottom: 20px; }
        .ad-empty { text-align: center; padding: 60px 20px; color: #555; font-size: 14px; }
        
        .ad-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.06); border-top-color: #b4915a; animation: adspin 0.8s linear infinite; margin: 60px auto; display: block; }
        @keyframes adspin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="ad-root">
        <div className="max-w-7xl mx-auto">
          <div className="ad-header">
            <h1 className="ad-title">Admin <em>Dashboard</em></h1>
            <p className="ad-subtitle">Manage users and system settings</p>
          </div>

          {/* Stats */}
          <div className="ad-stats">
            <div className="ad-stat"><div className="ad-stat-val">{stats.total}</div><div className="ad-stat-label">Total Users</div></div>
            <div className="ad-stat"><div className="ad-stat-val">{stats.apprenant}</div><div className="ad-stat-label">Apprenants</div></div>
            <div className="ad-stat"><div className="ad-stat-val">{stats.formateur}</div><div className="ad-stat-label">Formateurs</div></div>
            <div className="ad-stat"><div className="ad-stat-val">{stats.responsableCF}</div><div className="ad-stat-label">Resp. CF</div></div>
            <div className="ad-stat"><div className="ad-stat-val">{stats.admin}</div><div className="ad-stat-label">Admins</div></div>
            <div className="ad-stat"><div className="ad-stat-val" style={{color: '#e07070'}}>{stats.blocked}</div><div className="ad-stat-label">Blocked</div></div>
          </div>

          {error && <div className="ad-error">{error}</div>}

          {/* Filters */}
          <div className="ad-filters">
            <input 
              type="text" 
              className="ad-search" 
              placeholder="Search by name or email..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="ad-tabs">
              <button className={`ad-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>
                All <span className="ad-tab-count">{stats.total}</span>
              </button>
              <button className={`ad-tab ${filter === 'apprenant' ? 'active' : ''}`} onClick={() => setFilter('apprenant')}>
                Apprenants <span className="ad-tab-count">{stats.apprenant}</span>
              </button>
              <button className={`ad-tab ${filter === 'formateur' ? 'active' : ''}`} onClick={() => setFilter('formateur')}>
                Formateurs <span className="ad-tab-count">{stats.formateur}</span>
              </button>
              <button className={`ad-tab ${filter === 'responsableCF' ? 'active' : ''}`} onClick={() => setFilter('responsableCF')}>
                Resp. CF <span className="ad-tab-count">{stats.responsableCF}</span>
              </button>
              <button className={`ad-tab ${filter === 'admin' ? 'active' : ''}`} onClick={() => setFilter('admin')}>
                Admins <span className="ad-tab-count">{stats.admin}</span>
              </button>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div className="ad-spinner" />
          ) : filteredUsers.length === 0 ? (
            <div className="ad-empty">No users found</div>
          ) : (
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map(user => (
                    <tr key={user._id} className={user.block ? 'ad-blocked' : ''}>
                      <td>
                        <div className="ad-user-cell">
                          <div className="ad-avatar">
                            {user.user_image ? (
                              <img src={`http://localhost:5000/${user.user_image}`} alt="" />
                            ) : (
                              (user.nom?.[0] || user.prenom?.[0] || user.email?.[0] || '?').toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="ad-user-name">{user.nom} {user.prenom}</div>
                            <div className="ad-user-email">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <select 
                          className="ad-role-select"
                          value={user.role}
                          onChange={e => handleRoleChange(user._id, e.target.value)}
                          disabled={actionLoading === user._id}
                          style={{ 
                            color: ROLES[user.role]?.color, 
                            background: ROLES[user.role]?.bg 
                          }}
                        >
                          <option value="apprenant">Apprenant</option>
                          <option value="formateur">Formateur</option>
                          <option value="responsableCF">Responsable CF</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td>
                        {user.block ? (
                          <span className="ad-blocked-label">Blocked</span>
                        ) : (
                          <span style={{ color: '#4aa87d', fontSize: 12 }}>Active</span>
                        )}
                      </td>
                      <td>
                        <div className="ad-actions">
                          {user.block ? (
                            <button 
                              className="ad-btn ad-btn-unblock" 
                              onClick={() => handleUnblock(user._id)}
                              disabled={actionLoading === user._id}
                            >
                              Unblock
                            </button>
                          ) : (
                            <button 
                              className="ad-btn ad-btn-block" 
                              onClick={() => handleBlock(user._id)}
                              disabled={actionLoading === user._id}
                            >
                              Block
                            </button>
                          )}
                          <button 
                            className="ad-btn ad-btn-delete" 
                            onClick={() => handleDelete(user._id)}
                            disabled={actionLoading === user._id}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
