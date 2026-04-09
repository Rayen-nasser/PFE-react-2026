import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { centreService } from '../services/api';

const Centres = () => {
  const [centres, setCentres] = useState([]);

  useEffect(() => {
    centreService.getAll()
      .then((res) => setCentres(res.data.data || res.data))
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Training Centres</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {centres.map((centre) => (
          <div key={centre._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>{centre.nom || centre.name}</h3>
            <p>{centre.adresse || centre.address}</p>
            <p>{centre.description}</p>
            <p><strong>Phone:</strong> {centre.telephone || centre.phone}</p>
            <Link to={`/formations?centre=${centre._id}`}>
              <button style={{ marginTop: '10px' }}>View Formations</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Centres;
