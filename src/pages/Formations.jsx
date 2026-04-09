import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { formationService, categorieService } from '../services/api';

const Formations = () => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('category');

  useEffect(() => {
    categorieService.getAll()
      .then((res) => setCategories(res.data.data || res.data))
      .catch(console.error);

    if (categoryId) {
      formationService.getAll()
        .then((res) => {
          const allFormations = res.data.data || res.data;
          setFormations(allFormations.filter(f => f.categorie === categoryId));
        })
        .catch(console.error);
    } else {
      formationService.getAll()
        .then((res) => setFormations(res.data.data || res.data))
        .catch(console.error);
    }
  }, [categoryId]);

  return (
    <div>
      <h1>Formations</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <Link to="/formations" style={{ marginRight: '10px' }}>All</Link>
        {categories.map((cat) => (
          <Link 
            key={cat._id} 
            to={`/formations?category=${cat._id}`}
            style={{ marginRight: '10px', padding: '5px 10px', border: '1px solid #ccc', borderRadius: '4px' }}
          >
            {cat.nom || cat.name}
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {formations.map((formation) => (
          <div key={formation._id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '20px' }}>
            <h3>{formation.titre || formation.title}</h3>
            <p>{formation.description}</p>
            <p><strong>Price:</strong> {formation.prix || formation.price} DT</p>
            <p><strong>Duration:</strong> {formation.duree || formation.duration} hours</p>
            <Link to={`/formations/${formation._id}`}>
              <button style={{ marginTop: '10px', padding: '8px 16px', cursor: 'pointer' }}>
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Formations;
