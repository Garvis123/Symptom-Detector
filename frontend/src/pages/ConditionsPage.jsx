import React from 'react';
import { useChecker } from '../context/CheckerContext';
import PreviousButton from '../components/PreviousButton';
import ContinueButton from '../components/ContinueButton';
import './conditionPage.css';

const ConditionsPage = () => {
  const { userData, updateUserData } = useChecker();
  const [selectedCondition, setSelectedCondition] = React.useState(
    userData.selectedCondition || null
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  
  const handleConditionSelect = (condition) => {
    setSelectedCondition(condition);
    updateUserData({ selectedCondition: condition });
    // Clear any previous errors
    setError(null);
  };
  
  const handleContinue = async () => {
    if (!selectedCondition) return false;
    
    setIsLoading(true);
    setError(null);
  
    try {
      // Make sure to properly encode the condition name for the URL
      const conditionName = encodeURIComponent(selectedCondition.name);
      console.log(`Fetching details for: ${conditionName}`);
      
      const response = await fetch(`http://localhost:5000/api/condition-details/${conditionName}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to fetch condition details');
      }
  
      const data = await response.json();
      console.log('Received condition details:', data);
  
      if (data.details) {
        // Store the details in context
        updateUserData({ details: data.details });
        setIsLoading(false);
        return true;
      } else {
        throw new Error('No details received from the server');
      }
  
    } catch (err) {
      console.error('Error fetching condition details:', err);
      setError(err.message || 'Error fetching condition details');
      setIsLoading(false);
      return false;
    }
  };
  
  return (
    <div className="conditions-page">
      <div className="user-info">
        <div className="info-item">
          <span className="label">Age:</span> {userData.age}
        </div>
        <div className="info-item">
          <span className="label">Sex:</span> {userData.sex}
        </div>
      </div>
      
      <div className="symptoms-summary">
        <h3>Based on your symptoms:</h3>
        <p className="symptom-text">{userData.symptoms}</p>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <div className="conditions-list">
        <h2>Possible Conditions</h2>
        <p className="instruction">Select a condition to learn more details</p>
        
        {userData.conditions && userData.conditions.map((condition) => (
          <div 
            key={condition.id || condition.name}
            className={`condition-card ${selectedCondition?.id === condition.id || 
              selectedCondition?.name === condition.name ? 'selected' : ''}`}
            onClick={() => handleConditionSelect(condition)}
          >
            <div className="condition-header">
              <h3>{condition.name}</h3>
              <span className={`probability ${condition.probability.toLowerCase()}`}>
                {condition.probability} Probability
              </span>
            </div>
            <p className="condition-description">{condition.description}</p>
          </div>
        ))}
      </div>
      
      <div className="buttons-container">
        <PreviousButton />
        <ContinueButton 
          onClick={handleContinue} 
          disabled={!selectedCondition || isLoading} 
        />
        {isLoading && <span className="loading-indicator">Loading...</span>}
      </div>
    </div>
  );
};

export default ConditionsPage;