import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inscriptionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyInscriptions = () => {
  const [inscriptions, setInscriptions] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      inscriptionService.getMyInscriptions()
        .then((res) => setInscriptions(res.data.data || res.data))
        .catch(console.error);
    }
  }, [user]);

  if (!user) return <p>Please login to view your enrollments.</p>;

  return (
    <div>
      <h1>My Enrollments</h1>
      {inscriptions.length === 0 ? <p>No enrollments yet.</p> : (
        <div style={{ display: 'grid', gap: '15px' }}>
          {inscriptions.map((ins) => (
            <div key={ins._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <h3>Formation: {ins.formation?.titre || ins.formation?.title}</h3>
              <p><strong>Status:</strong> {ins.statut || ins.status}</p>
              <p><strong>Date:</strong> {new Date(ins.createdAt).toLocaleDateString()}</p>
              <Link to={`/formations/${ins.formation?._id}`}>View Formation</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyInscriptions;
