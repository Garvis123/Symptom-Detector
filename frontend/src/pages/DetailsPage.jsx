import React, { useEffect, useState } from 'react';
import { useChecker } from '../context/CheckerContext';
import { useNavigate } from 'react-router-dom';
import PreviousButton from '../components/PreviousButton';
import ContinueButton from '../components/ContinueButton';
import './detailpage.css';

const DetailsPage = () => {
  const { userData, updateUserData } = useChecker();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect to conditions page if details are missing
    if (!userData.details || !userData.selectedCondition) {
      navigate('/conditions'); // Adjust the path as needed
    }
  }, [userData.details, userData.selectedCondition, navigate]);

  const handleContinue = async () => {
    if (!userData.selectedCondition) return false;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Use the treatments endpoint with a GET request instead
      const response = await fetch(
        `http://localhost:5000/api/treatments/${encodeURIComponent(userData.selectedCondition.name)}`, 
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch treatment suggestions');
      }

      const data = await response.json();
      console.log('Treatment data received:', data);

      if (data.treatments) {
        updateUserData({ treatments: data.treatments });
        setIsLoading(false);
        return true;
      } else {
        throw new Error('No treatment data received');
      }
    } catch (error) {
      console.error('Treatment fetch error:', error);
      setError(error.message || 'Failed to load treatment suggestions');
      setIsLoading(false);
      return false;
    }
  };

  if (!userData.details || !userData.selectedCondition) {
    return <div className="loading">Loading details...</div>;
  }

  return (
    <div className="details-page">
      <div className="user-info">
        <div className="info-item">
          <span className="label">Age:</span> {userData.age}
        </div>
        <div className="info-item">
          <span className="label">Sex:</span> {userData.sex}
        </div>
      </div>

      <div className="condition-header">
        <h2>{userData.selectedCondition.name}</h2>
        <span className={`probability ${userData.selectedCondition.probability?.toLowerCase()}`}>
          {userData.selectedCondition.probability} Probability
        </span>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="details-section">
        <div className="detail-card">
          <h3>Overview</h3>
          <p>{userData.details.overview}</p>
        </div>

        <div className="detail-card">
          <h3>Causes</h3>
          <p>{userData.details.causes}</p>
        </div>

        <div className="detail-card">
          <h3>Risk Factors</h3>
          <ul>
            {userData.details.riskFactors?.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h3>Possible Complications</h3>
          <ul>
            {userData.details.complications?.map((complication, index) => (
              <li key={index}>{complication}</li>
            ))}
          </ul>
        </div>

        <div className="detail-card">
          <h3>Prevention</h3>
          <ul>
            {userData.details.prevention?.map((prevention, index) => (
              <li key={index}>{prevention}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="buttons-container">
        <PreviousButton />
        <ContinueButton 
          onClick={handleContinue} 
          disabled={isLoading}
        />
        {isLoading && <span className="loading-indicator">Loading treatments...</span>}
      </div>
    </div>
  );
};

export default DetailsPage;