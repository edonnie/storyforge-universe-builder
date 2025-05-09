
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in (has a token)
    const token = localStorage.getItem('fateToken');
    
    if (token) {
      // If logged in, redirect to dashboard
      navigate('/dashboard');
    } else {
      // If not logged in, redirect to landing page
      navigate('/');
    }
  }, [navigate]);

  return null;
};

export default Index;
