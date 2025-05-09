
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";
import { useEffect } from 'react';

const NotFound = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if this is a world not found case
  const isWorldPath = location.pathname.startsWith('/worlds/');
  const worldId = isWorldPath ? location.pathname.split('/')[2] : null;
  
  // If we're on a world path that doesn't exist, check localStorage
  useEffect(() => {
    if (isWorldPath && worldId) {
      // Check if there's a recently created world that might match
      const lastCreatedWorldId = localStorage.getItem('lastCreatedWorldId');
      
      if (lastCreatedWorldId && lastCreatedWorldId !== worldId) {
        console.log('Last created world ID found but doesn\'t match current path:', lastCreatedWorldId);
        // We have a recently created world, but it's not the one we're looking for
        // This suggests there might be a navigation issue, try redirecting
        navigate(`/worlds/${lastCreatedWorldId}`);
      }
    }
  }, [isWorldPath, worldId, navigate]);
  
  return (
    <Layout>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        {isWorldPath ? (
          <>
            <h1 className="text-6xl font-bold mb-6">World Not Found</h1>
            <p className="text-2xl mb-8">The world you're looking for doesn't exist.</p>
            <p className="text-muted-foreground max-w-md mb-8">
              This world may have been deleted or you might have followed an incorrect link.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-6xl font-bold mb-6">404</h1>
            <p className="text-2xl mb-8">Oops! This page has been lost in another realm.</p>
            <p className="text-muted-foreground max-w-md mb-8">
              The page you're looking for doesn't exist or has been moved to another dimension.
            </p>
          </>
        )}
        <Link to="/dashboard">
          <Button size="lg">Return to Dashboard</Button>
        </Link>
      </div>
    </Layout>
  );
};

export default NotFound;
