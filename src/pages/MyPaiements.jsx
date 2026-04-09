import { useState, useEffect } from 'react';
import { paiementService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyPaiements = () => {
  const [paiements, setPaiements] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      paiementService.getMyPaiements()
        .then((res) => setPaiements(res.data.data || res.data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <p>Please login to view your payments.</p>;

  return (
    <div>
      <h1>My Payments</h1>
      {paiements.length === 0 ? <p>No payments yet.</p> : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {paiements.map((p) => (
            <div key={p._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <h3>Amount: {p.montant || p.amount} DT</h3>
              <p><strong>Method:</strong> {p.mode || p.method}</p>
              <p><strong>Status:</strong> {p.statut || p.status}</p>
              <p><strong>Date:</strong> {new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPaiements;
