
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to the main landing page
    navigate('/');
  }, [navigate]);

  return null;
};

export default Index;
