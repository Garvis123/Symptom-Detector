import React, { useState, useEffect } from 'react';
import { useChecker } from '../context/CheckerContext';
import PreviousButton from '../components/PreviousButton';
import ContinueButton from '../components/ContinueButton';
import './SymptomPage.css';

const SymptomsPage = () => {
  const { userData, updateUserData } = useChecker();
  const [symptoms, setSymptoms] = useState(userData.symptoms || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');
        
        setSymptoms(prev => {
          // Only update if the new transcript is different to avoid state loops
          return transcript !== prev ? transcript : prev;
        });
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
        setError('Speech recognition failed. Please try again or type your symptoms.');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      // Clear error if there was one
      setError('');
      recognition.start();
      setIsListening(true);
    }
  };

  const handleContinue = async () => {
    if (!symptoms.trim()) {
      setError('Please enter your symptoms');
      return false;
    }
  
    updateUserData({ symptoms });
    setIsProcessing(true);
    setError('');
  
    try {
      const response = await fetch('http://localhost:5000/api/gemini/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          age: userData.age,
          sex: userData.sex,
          symptoms,
        }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to analyze symptoms');
      }
  
      const data = await response.json();
  
      if (data.conditions) {
        updateUserData({ conditions: data.conditions });
        setIsProcessing(false);
        return true;
      } else {
        throw new Error('Invalid data format');
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Failed to analyze symptoms. Please try again.');
      setIsProcessing(false);
      return false;
    }
  };
  
  return (
    <div className="symptoms-page">
      <div className="user-info">
        <div className="info-item">
          <span className="label">Age:</span> {userData.age}
        </div>
        <div className="info-item">
          <span className="label">Sex:</span> {userData.sex}
        </div>
      </div>
      
      <div className="symptoms-form">
        <h2>What symptoms are you experiencing?</h2>
        <p className="instruction">
          Please describe your symptoms in detail, including when they started, 
          their severity, and any other relevant information.
        </p>
        
        <div className="textarea-container">
          <textarea
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            placeholder="E.g., I've had a headache for the past 3 days, along with a fever of 101°F and a sore throat..."
            rows={6}
            className={`${error ? 'error' : ''} ${isListening ? 'listening' : ''}`}
          />
          
          <button 
            type="button" 
            onClick={toggleListening} 
            className={`voice-btn ${isListening ? 'active' : ''}`}
            title={isListening ? "Stop recording" : "Start voice input"}
          >
            <i className={`fa ${isListening ? 'fa-stop' : 'fa-microphone'}`}></i>
            {isListening ? 'Stop' : 'Speak'}
          </button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {isListening && <div className="listening-indicator">Listening... Speak now</div>}
      </div>
      
      <div className="buttons-container">
        <PreviousButton />
        <ContinueButton 
          onClick={handleContinue} 
          disabled={isProcessing || !symptoms.trim()} 
        />
      </div>
      
      {isProcessing && <div className="loading">Analyzing your symptoms...</div>}
    </div>
  );
};

export default SymptomsPage;