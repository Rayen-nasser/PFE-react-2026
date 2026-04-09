import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { formationService, leconService, avisService, inscriptionService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const FormationDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formation, setFormation] = useState(null);
  const [lecons, setLecons] = useState([]);
  const [avis, setAvis] = useState([]);
  const [newAvis, setNewAvis] = useState({ commentaire: '', note: 5 });
  const [error, setError] = useState('');

  useEffect(() => {
    formationService.getById(id)
      .then((res) => setFormation(res.data.data || res.data))
      .catch(console.error);

    leconService.getByFormation(id)
      .then((res) => setLecons(res.data.data || res.data))
      .catch(console.error);

    avisService.getByFormation(id)
      .then((res) => setAvis(res.data.data || res.data))
      .catch(console.error);
  }, [id]);

  const handleInscription = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      await inscriptionService.create({ formation: id });
      alert('Enrolled successfully!');
      navigate('/my-inscriptions');
    } catch (err) {
      setError(err.response?.data?.message || 'Enrollment failed');
    }
  };

  const handleAvisSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await avisService.create({ 
        formation: id, 
        commentaire: newAvis.commentaire, 
        note: newAvis.note 
      });
      setAvis([...avis, res.data.data || res.data]);
      setNewAvis({ commentaire: '', note: 5 });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add review');
    }
  };

  if (!formation) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px' }}>
      <h1>{formation.titre || formation.title}</h1>
      <p>{formation.description}</p>
      <p><strong>Price:</strong> {formation.prix || formation.price} DT</p>
      <p><strong>Duration:</strong> {formation.duree || formation.duration} hours</p>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button onClick={handleInscription} style={{ padding: '12px 24px', fontSize: '16px', cursor: 'pointer' }}>
        Enroll Now
      </button>

      <section style={{ marginTop: '40px' }}>
        <h2>Lessons</h2>
        {lecons.length === 0 ? <p>No lessons yet</p> : (
          <ul>
            {lecons.map((lecon) => (
              <li key={lecon._id} style={{ padding: '10px', borderBottom: '1px solid #eee' }}>
                <strong>{lecon.titre || lecon.title}</strong> - {lecon.duree || lecon.duration} min
              </li>
            ))}
          </ul>
        )}
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Reviews</h2>
        {avis.map((a) => (
          <div key={a._id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '10px', borderRadius: '5px' }}>
            <p><strong>Note:</strong> {a.note}/5</p>
            <p>{a.commentaire}</p>
          </div>
        ))}

        {user && (
          <form onSubmit={handleAvisSubmit} style={{ marginTop: '20px' }}>
            <h3>Add Review</h3>
            <div style={{ marginBottom: '10px' }}>
              <label>Note: </label>
              <select value={newAvis.note} onChange={(e) => setNewAvis({...newAvis, note: Number(e.target.value)})}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea 
                placeholder="Commentaire" 
                value={newAvis.commentaire}
                onChange={(e) => setNewAvis({...newAvis, commentaire: e.target.value})}
                style={{ width: '100%', height: '80px' }}
              />
            </div>
            <button type="submit">Submit Review</button>
          </form>
        )}
      </section>
    </div>
  );
};

export default FormationDetail;
