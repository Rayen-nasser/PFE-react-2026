import { useState, useEffect } from 'react';
import ApprenantLayout from '../components/ApprenantLayout';
import { paiementService } from '../../../services/api';
import LoadingSpinner from '../../../shared/components/LoadingSpinner';
import { formatDate } from '../../../shared/utils/format';

export default function ApprenantPaiements() {
  const [paiements, setPaiements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await paiementService.getMyPaiements();
      setPaiements(res.data.data || []);
    } catch (e) {
      console.error('Failed to fetch payments', e);
    } finally {
      setLoading(false);
    }
  };

  const total = paiements.reduce((s, p) => s + (p.montant || 0), 0);
  const completedTotal = paiements.filter(p => p.statut === 'confirme').reduce((s, p) => s + (p.montant || 0), 0);

  const statusMeta = {
    confirme: { label: 'Confirmed', color: '#4aa87d', bg: 'rgba(74,168,125,0.1)' },
    en_attente: { label: 'Pending', color: '#c8a86e', bg: 'rgba(200,168,110,0.1)' },
    refuse: { label: 'Rejected', color: '#e07070', bg: 'rgba(220,110,110,0.1)' },
  };

  return (
    <ApprenantLayout title="My <em>Payments</em>" subtitle="Your payment history">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div style={{
          background: 'rgba(124,168,212,0.08)',
          border: '1px solid rgba(124,168,212,0.2)',
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Spent
          </div>
          <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond', serif", color: '#7ca8d4', fontWeight: 400 }}>
            {total} <span style={{ fontSize: 16, color: '#555' }}>DT</span>
          </div>
        </div>
        <div style={{
          background: 'rgba(74,168,125,0.08)',
          border: '1px solid rgba(74,168,125,0.2)',
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Completed Payments
          </div>
          <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond', serif", color: '#4aa87d', fontWeight: 400 }}>
            {completedTotal} <span style={{ fontSize: 16, color: '#555' }}>DT</span>
          </div>
        </div>
        <div style={{
          background: 'rgba(255,255,255,0.02)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: 24,
        }}>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Total Transactions
          </div>
          <div style={{ fontSize: 36, fontFamily: "'Cormorant Garamond', serif", color: '#f0ebe0', fontWeight: 400 }}>
            {paiements.length}
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 400, color: '#f0ebe0', marginBottom: 20 }}>
        Transaction History
      </h2>

      {loading ? (
        <LoadingSpinner />
      ) : paiements.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, background: 'rgba(255,255,255,0.02)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 18, color: '#888', marginBottom: 8 }}>No payments yet</div>
          <div style={{ fontSize: 14, color: '#555' }}>Your payment history will appear here</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {paiements.map(p => {
            const meta = statusMeta[p.statut] || statusMeta.en_attente;
            return (
              <div key={p._id} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 20,
                padding: '20px 24px',
                borderRadius: 12,
                border: '1px solid rgba(255,255,255,0.07)',
                background: 'rgba(255,255,255,0.02)',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'}
              >
                <div style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  background: 'rgba(124,168,212,0.08)',
                  border: '1px solid rgba(124,168,212,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7ca8d4" strokeWidth="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 500, color: '#e8e4dc', marginBottom: 4 }}>
                    {p.formation?.titre || p.formationId?.titre || 'Course Payment'}
                  </div>
                  <div style={{ fontSize: 12, color: '#555' }}>
                    {p.methodePaiement || 'Card'} &middot; {formatDate(p.createdAt)}
                  </div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, color: '#f0ebe0', fontWeight: 400 }}>
                    {p.montant || 0} <span style={{ fontSize: 12, color: '#555' }}>DT</span>
                  </div>
                  <div style={{
                    display: 'inline-block',
                    marginTop: 6,
                    fontSize: 10,
                    padding: '3px 10px',
                    borderRadius: 12,
                    background: meta.bg,
                    color: meta.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {meta.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </ApprenantLayout>
  );
}
