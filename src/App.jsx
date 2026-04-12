import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './shared/context/AuthContext';
import { Layout } from './shared/layout';
import AdminRoute from './components/AdminRoute';
import Home from './features/home/pages/Home';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import ForgotPassword from './features/auth/pages/ForgotPassword';
import ResetPassword from './features/auth/pages/ResetPassword';
import Profile from './features/profile/pages/Profile';
import Formations from './features/formations/pages/Formations';
import FormationDetail from './features/formations/pages/FormationDetail';
import Centres from './features/centres/pages/Centres';
import MyInscriptions from './features/dashboard/pages/MyInscriptions';
import MyPaiements from './features/dashboard/pages/MyPaiements';
import MyFavoris from './features/dashboard/pages/MyFavoris';
import AdminDashboard from './features/admin/pages/AdminDashboard';
import AdminUsers from './features/admin/pages/AdminUsers';
import AdminReports from './features/admin/pages/AdminReports';
import AdminStatistics from './features/admin/pages/AdminStatistics';
import AdminCategories from './features/admin/pages/AdminCategories';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="profile" element={<Profile />} />
            <Route path="formations" element={<Formations />} />
            <Route path="formations/:id" element={<FormationDetail />} />
            <Route path="centres" element={<Centres />} />
            <Route path="my-inscriptions" element={<MyInscriptions />} />
            <Route path="my-paiements" element={<MyPaiements />} />
            <Route path="my-favoris" element={<MyFavoris />} />
          </Route>
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <AdminUsers />
            </AdminRoute>
          } />
          <Route path="/admin/reports" element={
            <AdminRoute>
              <AdminReports />
            </AdminRoute>
          } />
          <Route path="/admin/statistics" element={
            <AdminRoute>
              <AdminStatistics />
            </AdminRoute>
          } />
          <Route path="/admin/categories" element={
            <AdminRoute>
              <AdminCategories />
            </AdminRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
