import React from 'react';
import { useLocation } from 'react-router-dom';

const Recommendations = () => {
  const location = useLocation();
  const { recommendations } = location.state || { recommendations: [] };

  return (
    <div>
      <h2>Recommended Tracks</h2>
      <ul>
        {recommendations.map((trackName, index) => (
          <li key={index}>{trackName}</li>
        ))}
      </ul>
    </div>
  );
};

export default Recommendations;
