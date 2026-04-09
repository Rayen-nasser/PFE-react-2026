import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Profile from './pages/Profile';
import Formations from './pages/Formations';
import FormationDetail from './pages/FormationDetail';
import Centres from './pages/Centres';
import MyInscriptions from './pages/MyInscriptions';
import MyPaiements from './pages/MyPaiements';
import MyFavoris from './pages/MyFavoris';

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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
