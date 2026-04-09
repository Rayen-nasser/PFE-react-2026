import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const MyFavoris = () => {
  const [favoris, setFavoris] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      favoriService.getAll()
        .then((res) => setFavoris(res.data.data || res.data))
        .catch(console.error);
    }
  }, [user]);

  const handleRemove = async (id) => {
    try {
      await favoriService.remove(id);
      setFavoris(favoris.filter(f => f._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Please login to view your favorites.</p>;

  return (
    <div>
      <h1>My Favorites</h1>
      {favoris.length === 0 ? <p>No favorites yet.</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {favoris.map((fav) => (
            <div key={fav._id} style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
              <h3>{fav.formation?.titre || fav.formation?.title}</h3>
              <p>{fav.formation?.description}</p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/formations/${fav.formation?._id}`}>
                  <button>View</button>
                </Link>
                <button onClick={() => handleRemove(fav._id)} style={{ background: '#ff4444', color: 'white' }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyFavoris;
