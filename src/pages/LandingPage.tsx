
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';
import AuthModal from '../components/AuthModal';

const LandingPage = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('signup');
  
  // Temporary login function, will be replaced with Supabase auth
  const handleLogin = () => {
    // Mock successful login
    window.location.href = '/dashboard';
  };
  
  const openSignupModal = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
  };
  
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-gradient">
            Build Worlds. Craft Stories. Forge Fates.
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-foreground/80">
            FateEngine is the ultimate universe builder for writers, game designers, and worldbuilding enthusiasts.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button onClick={openSignupModal} size="lg" className="text-lg px-8 py-6">
              Start Building <ArrowRight className="ml-2" size={20} />
            </Button>
            <Link to="/plans">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Craft Your Universe</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Worlds</h3>
              <p className="text-muted-foreground mb-4">
                Create detailed worlds with rich histories, cultures, and geography.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Characters</h3>
              <p className="text-muted-foreground mb-4">
                Develop complex characters with unique backstories, motivations, and relationships.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Locations</h3>
              <p className="text-muted-foreground mb-4">
                Design immersive locations from sprawling cities to mysterious dungeons.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Factions</h3>
              <p className="text-muted-foreground mb-4">
                Create political factions, guilds, or organizations with complex hierarchies.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Items</h3>
              <p className="text-muted-foreground mb-4">
                Craft legendary artifacts, magical items, and everyday objects with history.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-semibold mb-3">Export</h3>
              <p className="text-muted-foreground mb-4">
                Export your creations as PDFs or images to share with others or use in your projects.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Shape Your Universe?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-foreground/80">
            Join thousands of worldbuilders and bring your ideas to life with FateEngine.
          </p>
          <Button onClick={openSignupModal} size="lg" className="text-lg px-8 py-6">
            Get Started Free
          </Button>
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
