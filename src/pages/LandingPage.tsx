
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { ArrowRight, Book, Sparkles, Globe, Users, Map, CopyPlus } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  
  // Check login status on component mount
  useEffect(() => {
    const token = localStorage.getItem('fateToken');
    setIsLoggedIn(!!token);
  }, []);
  
  // Login function that redirects to dashboard
  const handleLogin = () => {
    // Mock successful login
    localStorage.setItem('fateengine_session', 'true');
    localStorage.setItem('fateToken', 'mock_token_' + Date.now());
    navigate('/dashboard');
  };
  
  const openSignupModal = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };
  
  const handlePrimaryAction = () => {
    if (isLoggedIn) {
      // If logged in, go directly to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, open signup modal
      openSignupModal();
    }
  };
  
  return (
    <Layout>
      {/* Hero Section with animated background */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-background to-black opacity-80"></div>
          <div className="absolute top-[5%] left-[10%] w-64 h-64 rounded-full bg-purple-600/20 blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-[15%] right-[10%] w-80 h-80 rounded-full bg-blue-600/20 blur-[120px] animate-pulse delay-700"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gradient">
            Build Worlds. <br className="hidden md:block" />Craft Stories. <br className="hidden md:block" />Forge Fates.
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto text-foreground/90">
            The ultimate universe builder for writers, game designers, and worldbuilding enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={handlePrimaryAction} size="lg" className="text-lg px-8 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0">
              {isLoggedIn ? "Go to Dashboard" : "Start Building"} <ArrowRight className="ml-2" size={20} />
            </Button>
            <Link to="/plans">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/20 bg-black/30 backdrop-blur-sm hover:bg-white/10">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section with improved cards */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Craft Your Universe</h2>
          <p className="text-xl text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Everything you need to create rich, immersive worlds for your stories, games, and more.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-lg border border-white/10 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
                <Globe className="text-purple-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Worlds</h3>
              <p className="text-muted-foreground">
                Create detailed worlds with rich histories, cultures, and geography. Set the foundations for your storytelling.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-white/10 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                <Users className="text-blue-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Characters</h3>
              <p className="text-muted-foreground">
                Develop complex characters with unique backstories, motivations, and relationships that drive your narratives.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-white/10 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
                <Map className="text-emerald-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Locations</h3>
              <p className="text-muted-foreground">
                Design immersive locations from sprawling cities to mysterious dungeons with rich detail and atmosphere.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-white/10 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-full bg-amber-500/20 flex items-center justify-center mb-4">
                <Users className="text-amber-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Factions</h3>
              <p className="text-muted-foreground">
                Create political factions, guilds, or organizations with complex hierarchies and competing interests.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-white/10 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4">
                <Sparkles className="text-rose-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Items</h3>
              <p className="text-muted-foreground">
                Craft legendary artifacts, magical items, and everyday objects with history and significance to your world.
              </p>
            </div>
            
            <div className="bg-card p-8 rounded-lg border border-white/10 shadow-lg transition-transform hover:-translate-y-1 duration-300">
              <div className="h-12 w-12 rounded-full bg-cyan-500/20 flex items-center justify-center mb-4">
                <CopyPlus className="text-cyan-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Export</h3>
              <p className="text-muted-foreground">
                Export your creations as PDFs or images to share with others or use in your projects and presentations.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-gradient-to-br from-background to-black/80">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Creators Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <p className="italic text-muted-foreground mb-4">"FateEngine completely transformed my worldbuilding process. I can now organize my ideas in one place."</p>
              <p className="font-semibold">— Alex Chen, Fantasy Writer</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <p className="italic text-muted-foreground mb-4">"As a game master, this tool has saved me hours of prep time for my campaigns."</p>
              <p className="font-semibold">— Jamie Rodriguez, TTRPG Creator</p>
            </div>
            
            <div className="bg-card p-6 rounded-lg border border-white/10">
              <p className="italic text-muted-foreground mb-4">"The character creation features are incredible. My characters have never felt more alive."</p>
              <p className="font-semibold">— Sam Taylor, Novelist</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section with improved styling */}
      <section className="py-20 md:py-28 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-background via-background/90 to-background/60"></div>
          <div className="absolute -top-[5%] right-[10%] w-72 h-72 rounded-full bg-purple-600/20 blur-[100px] animate-pulse"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <h2 className="text-4xl font-bold mb-6">Ready to Shape Your Universe?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto text-foreground/80">
            Join thousands of worldbuilders and bring your ideas to life with FateEngine.
          </p>
          <Button onClick={handlePrimaryAction} size="lg" className="text-lg px-10 py-6 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 border-0">
            {isLoggedIn ? "Go to Dashboard" : "Start Creating Today"}
          </Button>
          
          <div className="mt-6 flex justify-center items-center space-x-2 text-muted-foreground">
            <Book size={16} />
            <span>No credit card required</span>
          </div>
        </div>
      </section>
      
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        setMode={setAuthMode}
        onLogin={handleLogin}
      />
    </Layout>
  );
};

export default LandingPage;