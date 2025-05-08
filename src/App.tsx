
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Import pages
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import WorldDetail from './pages/WorldDetail';
import CharacterCreation from './pages/CharacterCreation';
import Plans from './pages/Plans';
import Support from './pages/Support';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/worlds/:worldId" element={<WorldDetail />} />
          <Route path="/worlds/:worldId/characters/create" element={<CharacterCreation />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/support" element={<Support />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
