
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';
import WorldDetail from './pages/WorldDetail';
import Plans from './pages/Plans';
import Support from './pages/Support';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from '@/components/ui/toaster';
import CharacterCreation from './pages/CharacterCreation';
import CharacterPreview from './pages/CharacterPreview';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/worlds/:worldId" element={<WorldDetail />} />
        <Route path="/worlds/:worldId/characters/create" element={<CharacterCreation />} />
        <Route path="/worlds/:worldId/characters/:characterId" element={<CharacterPreview />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/support" element={<Support />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/login" element={<Navigate to="/" />} />
        <Route path="/signup" element={<Navigate to="/" />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
}

export default App;
