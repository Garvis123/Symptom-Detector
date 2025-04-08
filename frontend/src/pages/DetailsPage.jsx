import React, { useEffect } from 'react';
import { useChecker } from '../context/CheckerContext';
import { useNavigate } from 'react-router-dom';
import PreviousButton from '../components/PreviousButton';
import ContinueButton from '../components/ContinueButton';
import './detailpage.css';

const DetailsPage = () => {
  const { userData, updateUserData } = useChecker();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to conditions page if details are missing
    if (!userData.details || !userData.selectedCondition) {
      navigate('/conditions'); // Adjust the path as needed
    }
  }, [userData.details, userData.selectedCondition, navigate]);

  const handleContinue = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/condition-details/${encodeURIComponent(userData.selectedCondition.name)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          conditionName: userData.selectedCondition.name
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch treatment suggestions');
      }
  
      const data = await response.json();
  
      if (data.treatments) {
        updateUserData({ treatments: data.treatments });
      } else {
        throw new Error('No treatment data received');
      }
  
      return true;
    } catch (error) {
      console.error('Treatment fetch error:', error);
      alert('Failed to load treatment suggestions. Please try again.');
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
        <ContinueButton onClick={handleContinue} />
      </div>
    </div>
  );
};

export default DetailsPage;
