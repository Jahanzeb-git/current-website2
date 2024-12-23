import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const DynamicProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect based on the `id` in the URL
    if (id === 'ai-powered-data-science') {
      navigate('/projects/ai-powered-data-science-page'); // Redirect to ProjectDetail.tsx
    } else if (id === 'neural-network-visualizer') {
      navigate('/projects/neural-network-visualizer-page'); // Redirect to ProjectDetail2.tsx
    } else {
      navigate('/not-found'); // Redirect to a 404 or error page if `id` is invalid
    }
  }, [id, navigate]);

  return (
    <div>
      <p>Redirecting...</p>
    </div>
  );
};

export default DynamicProjectDetail;
