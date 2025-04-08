const CheckupSession = require('../models/CheckupSession');
const geminiService = require('../services/geminiService');
const { analyzeSymptoms } = require('../services/geminiService');


// Analyze symptoms using Gemini AI
exports.analyzeSymptoms = async (req, res) => {
  try {
    const { symptoms } = req.body;
    const analysis = await geminiService.analyzeSymptoms(symptoms);
    res.json({ conditions: analysis });
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    res.status(500).json({ error: 'Failed to analyze symptoms' });
  }
};

// Get detailed information about a condition
exports.getConditionDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition } = req.query;

    if (!condition) {
      return res.status(400).json({ message: 'Please provide condition name' });
    }

    // Use Gemini AI to get condition details
    const details = await geminiService.getConditionDetails(condition);

    res.status(200).json(details);
  } catch (error) {
    console.error('Error getting condition details:', error);
    res.status(500).json({ message: 'Failed to get condition details', error: error.message });
  }
};

// Get treatment options for a condition
exports.getTreatments = async (req, res) => {
  try {
    const { id } = req.params;
    const { condition } = req.query;

    if (!condition) {
      return res.status(400).json({ message: 'Please provide condition name' });
    }

    // Use Gemini AI to get treatment options
    const treatments = await geminiService.getTreatmentOptions(condition);

    res.status(200).json(treatments);
  } catch (error) {
    console.error('Error getting treatment options:', error);
    res.status(500).json({ message: 'Failed to get treatment options', error: error.message });
  }
};

// Save the checkup session data (optional)
exports.saveCheckupSession = async (req, res) => {
  try {
    const sessionData = req.body;
    
    // Create a new session
    const session = new CheckupSession(sessionData);
    await session.save();
    
    res.status(201).json({ message: 'Session saved successfully', sessionId: session._id });
  } catch (error) {
    console.error('Error saving session:', error);
    res.status(500).json({ message: 'Failed to save session', error: error.message });
  }
};