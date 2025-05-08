
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full bg-background border-t border-muted py-6">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="text-xl font-bold text-gradient">
              FateEngine
            </Link>
            <p className="text-sm text-muted-foreground mt-1">
              Build worlds, craft stories, forge fates.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8 items-center">
            <div className="flex space-x-4">
              <Link to="/privacy" className="text-sm hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-sm hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link to="/support" className="text-sm hover:text-primary transition-colors">
                Support
              </Link>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground">
                © {new Date().getFullYear()} FateEngine. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
