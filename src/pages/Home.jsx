import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { formationService, categorieService } from '../services/api';
import { Card, Button } from '../components/ui';

const Home = () => {
  const [formations, setFormations] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      formationService.getAll(),
      categorieService.getAll()
    ])
      .then(([formationsRes, categoriesRes]) => {
        setFormations(formationsRes.data.data || formationsRes.data);
        setCategories(categoriesRes.data.data || categoriesRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const features = [
    {
      icon: '📚',
      title: 'Expert Instructors',
      description: 'Learn from industry professionals with years of experience'
    },
    {
      icon: '🎯',
      title: 'Flexible Learning',
      description: 'Study at your own pace, anytime, anywhere'
    },
    {
      icon: '🏆',
      title: 'Certificates',
      description: 'Earn recognized certificates upon completion'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-3xl mb-12">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.05%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-50"></div>
        <div className="relative px-8 py-16 md:py-24">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Unlock Your Potential with Online Learning
            </h1>
            <p className="text-lg text-primary-100 mb-8">
              Discover thousands of courses taught by expert instructors. 
              Start your journey to success today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/formations">
                <Button className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 text-lg">
                  Explore Courses
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="text-center">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Browse by Category</h2>
          <Link to="/formations" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link 
              key={cat._id} 
              to={`/formations?category=${cat._id}`}
              className="group"
            >
              <Card hover className="text-center py-6">
                <div className="text-2xl mb-2">📁</div>
                <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                  {cat.nom || cat.name}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Courses Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Featured Courses</h2>
          <Link to="/formations" className="text-primary-600 hover:text-primary-700 font-medium">
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {formations.slice(0, 8).map((formation) => (
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
                    {formation.titre || formation.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                    {formation.description}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-xl font-bold text-primary-600">
                      {formation.prix || formation.price} <span className="text-sm font-normal text-gray-500">DT</span>
                    </span>
                    <span className="text-sm text-gray-500">
                      {formation.duree || formation.duration}h
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
