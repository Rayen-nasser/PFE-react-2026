import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, Button } from '../components/ui';
import { formationService, categorieService, centreService } from '../services/api';

const Formations = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [centres, setCentres] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    categorieId: searchParams.get('categorieId') || '',
    centreId: searchParams.get('centreId') || '',
    prixMin: searchParams.get('prixMin') || '',
    prixMax: searchParams.get('prixMax') || '',
    dureeMax: searchParams.get('dureeMax') || '',
  });

  useEffect(() => {
    Promise.all([
      categorieService.getAll(),
      centreService.getAll(),
    ])
      .then(([catRes, centreRes]) => {
        setCategories(catRes.data.data || catRes.data);
        setCentres(centreRes.data.data || centreRes.data);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    fetchFormations();
  }, [filters]);

  const fetchFormations = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.categorieId) params.categorieId = filters.categorieId;
      if (filters.centreId) params.centreId = filters.centreId;
      if (filters.prixMin) params.prixMin = filters.prixMin;
      if (filters.prixMax) params.prixMax = filters.prixMax;
      if (filters.dureeMax) params.dureeMax = filters.dureeMax;

      const res = await formationService.getAll(params);
      setFormations(res.data.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.set(key, value);
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      categorieId: '',
      centreId: '',
      prixMin: '',
      prixMax: '',
      dureeMax: '',
    });
    setSearchParams({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Courses</h1>
        <p className="text-gray-600">Find and enroll in courses that match your interests</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <form onSubmit={handleSearch}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <input
                type="text"
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
                placeholder="Search courses..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                name="categorieId"
                value={filters.categorieId}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat._id} value={cat._id}>{cat.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Center</label>
              <select
                name="centreId"
                value={filters.centreId}
                onChange={handleFilterChange}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              >
                <option value="">All Centers</option>
                {centres.map(centre => (
                  <option key={centre._id} value={centre._id}>{centre.nom}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Duration (hours)</label>
              <input
                type="number"
                name="dureeMax"
                value={filters.dureeMax}
                onChange={handleFilterChange}
                placeholder="e.g. 20"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Price (DT)</label>
              <input
                type="number"
                name="prixMin"
                value={filters.prixMin}
                onChange={handleFilterChange}
                placeholder="Min"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Price (DT)</label>
              <input
                type="number"
                name="prixMax"
                value={filters.prixMax}
                onChange={handleFilterChange}
                placeholder="Max"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex items-end gap-2">
              <Button type="submit" className="flex-1">Search</Button>
              {hasActiveFilters && (
                <Button type="button" variant="secondary" onClick={clearFilters}>Clear</Button>
              )}
            </div>
          </div>
        </form>
      </Card>

      {/* Results */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[300px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      ) : formations.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-4xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No courses found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>Clear Filters</Button>
          )}
        </Card>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-4">{formations.length} course{formations.length !== 1 ? 's' : ''} found</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {formations.map((formation) => (
              <Link key={formation._id} to={`/formations/${formation._id}`} className="group">
                <Card hover className="h-full flex flex-col overflow-hidden p-0">
                  <div className="h-40 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                    <span className="text-5xl text-white/50">🎓</span>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <span className="text-xs font-medium text-primary-600 mb-2 uppercase tracking-wide">
                      {formation.categorie?.nom || 'Course'}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {formation.titre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                      {formation.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xl font-bold text-primary-600">
                        {formation.prix} <span className="text-sm font-normal text-gray-500">DT</span>
                      </span>
                      <span className="text-sm text-gray-500">{formation.duree}h</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Formations;
