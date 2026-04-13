import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { centreService } from '../services/centre';
import { formationService } from '../services/formation';
import { inscriptionService } from '../services/inscription';
import { paymentService } from '../services/payment';
import ResponsableCFLayout from '../components/ResponsableCFLayout';

export default function ResponsableDashboard() {
  const [stats, setStats] = useState({
    centres: 0,
    formations: 0,
    inscriptions: 0,
    pendingInscriptions: 0,
    revenue: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const [centresRes, formationsRes, inscriptionsRes, paymentsRes] = await Promise.all([
        centreService.getMyCentres(),
        formationService.getAll(),
        inscriptionService.getAll(),
        paymentService.getAll(),
      ]);

      const centres = centresRes.data.data || [];
      const formations = formationsRes.data.data || [];
      const inscriptions = inscriptionsRes.data.data || [];
      const payments = paymentsRes.data.data || [];

      const pendingInscriptions = inscriptions.filter(i => i.statut === 'en attente').length;
      const revenue = payments
        .filter(p => p.statut === 'confirmé')
        .reduce((sum, p) => sum + (p.montant || 0), 0);
      const pendingPayments = payments
        .filter(p => p.statut === 'en_attente')
        .reduce((sum, p) => sum + (p.montant || 0), 0);

      setStats({
        centres: centres.length,
        formations: formations.length,
        inscriptions: inscriptions.length,
        pendingInscriptions,
        revenue,
        pendingPayments,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ResponsableCFLayout>
      <style>{`
        .rd-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 40px; }
        .rd-stat { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); border-radius: 16px; padding: 24px; transition: border-color 0.2s; }
        .rd-stat:hover { border-color: rgba(125,191,125,0.3); }
        .rd-stat-icon { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .rd-stat-icon svg { width: 20px; height: 20px; }
        .rd-stat-icon.blue { background: rgba(106,159,216,.15); color: #6a9fd8; }
        .rd-stat-icon.gold { background: rgba(200,168,110,.15); color: #c8a86e; }
        .rd-stat-icon.red { background: rgba(224,112,112,.15); color: #e07070; }
        .rd-stat-icon.green { background: rgba(74,168,125,.15); color: #4aa87d; }
        .rd-stat-icon.purple { background: rgba(180,145,90,.15); color: #b4915a; }
        .rd-stat-value { font-family: 'Cormorant Garamond', serif; font-size: 36px; font-weight: 400; color: #f0ebe0; line-height: 1; }
        .rd-stat-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #555; margin-top: 8px; }
        
        .rd-section { margin-bottom: 40px; }
        .rd-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .rd-section-title { font-family: 'Cormorant Garamond', serif; font-size: 24px; font-weight: 400; color: #f0ebe0; }
        .rd-link { color: #7dbf7d; font-size: 13px; text-decoration: none; transition: color 0.2s; }
        .rd-link:hover { color: #9dd49d; }
        
        .rd-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px; }
        .rd-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 14px; padding: 20px; transition: border-color 0.2s; }
        .rd-card:hover { border-color: rgba(125,191,125,0.2); }
        .rd-card-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px; }
        .rd-card-title { font-weight: 500; color: #f0ebe0; font-size: 16px; }
        .rd-card-badge { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 500; }
        .rd-card-badge.pending { background: rgba(200,168,110,.15); color: #c8a86e; }
        .rd-card-badge.confirmed { background: rgba(74,168,125,.15); color: #4aa87d; }
        .rd-card-badge.accepted { background: rgba(74,168,125,.15); color: #4aa87d; }
        .rd-card-badge.refused { background: rgba(224,112,112,.15); color: #e07070; }
        .rd-card-meta { font-size: 13px; color: #555; }
        .rd-card-amount { font-family: 'Cormorant Garamond', serif; font-size: 28px; color: #7dbf7d; margin-top: 8px; }
        
        .rd-quick-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }
        .rd-action { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 12px; padding: 20px; text-align: center; text-decoration: none; color: inherit; transition: all 0.2s; }
        .rd-action:hover { border-color: rgba(125,191,125,0.3); transform: translateY(-2px); }
        .rd-action-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 12px; }
        .rd-action-icon svg { width: 24px; height: 24px; }
        .rd-action-label { font-weight: 500; color: #f0ebe0; margin-bottom: 4px; }
        .rd-action-desc { font-size: 12px; color: #555; }
        
        .rd-spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.06); border-top-color: #7dbf7d; animation: rdspin 0.8s linear infinite; margin: 60px auto; display: block; }
        @keyframes rdspin { to { transform: rotate(360deg); } }
      `}</style>

      {loading ? (
        <div className="rd-spinner" />
      ) : (
        <>
          <div className="rd-stats">
            <div className="rd-stat">
              <div className="rd-stat-icon blue">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>
              </div>
              <div className="rd-stat-value">{stats.centres}</div>
              <div className="rd-stat-label">My Centres</div>
            </div>
            <div className="rd-stat">
              <div className="rd-stat-icon gold">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div className="rd-stat-value">{stats.formations}</div>
              <div className="rd-stat-label">Formations</div>
            </div>
            <div className="rd-stat">
              <div className="rd-stat-icon red">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div className="rd-stat-value">{stats.pendingInscriptions}</div>
              <div className="rd-stat-label">Pending Inscriptions</div>
            </div>
            <div className="rd-stat">
              <div className="rd-stat-icon green">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <div className="rd-stat-value">{stats.revenue.toLocaleString()} DT</div>
              <div className="rd-stat-label">Total Revenue</div>
            </div>
          </div>

          <div className="rd-quick-actions">
            <Link to="/responsable/centres" className="rd-action">
              <div className="rd-action-icon" style={{ background: 'rgba(106,159,216,.15)', color: '#6a9fd8' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 21h18M5 21V7l8-4v18M19 21V11l-6-4M9 9v.01M9 12v.01M9 15v.01M9 18v.01"/></svg>
              </div>
              <div className="rd-action-label">Manage Centres</div>
              <div className="rd-action-desc">Add or edit your training centres</div>
            </Link>
            <Link to="/responsable/formations" className="rd-action">
              <div className="rd-action-icon" style={{ background: 'rgba(200,168,110,.15)', color: '#c8a86e' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              </div>
              <div className="rd-action-label">Manage Formations</div>
              <div className="rd-action-desc">Create and update courses</div>
            </Link>
            <Link to="/responsable/inscriptions" className="rd-action">
              <div className="rd-action-icon" style={{ background: 'rgba(224,112,112,.15)', color: '#e07070' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
              </div>
              <div className="rd-action-label">Review Inscriptions</div>
              <div className="rd-action-desc">{stats.pendingInscriptions} pending requests</div>
            </Link>
            <Link to="/responsable/payments" className="rd-action">
              <div className="rd-action-icon" style={{ background: 'rgba(74,168,125,.15)', color: '#4aa87d' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
              </div>
              <div className="rd-action-label">View Payments</div>
              <div className="rd-action-desc">Track revenue and transactions</div>
            </Link>
          </div>
        </>
      )}
    </ResponsableCFLayout>
  );
}
