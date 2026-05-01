const express = require('express');
const router = express.Router();
const analyzerService = require('../services/analyzer');
const roastService = require('../services/roast');

// Analyze a Twitter/X account
router.get('/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const { roast } = req.query;

    // Clean username (remove @ if present)
    const cleanUsername = username.replace(/^@/, '');

    // Get analysis
    const analysis = await analyzerService.analyzeAccount(cleanUsername);

    // Generate roast if requested
    if (roast === 'true') {
      analysis.roast = await roastService.generateRoast(analysis);
    }

    res.json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error.code === 50) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.status(500).json({ error: 'Failed to analyze account' });
  }
});

// Just get a roast for an already-analyzed account
router.post('/roast', async (req, res) => {
  try {
    const { analysis } = req.body;
    
    if (!analysis) {
      return res.status(400).json({ error: 'Analysis data required' });
    }

    const roast = await roastService.generateRoast(analysis);
    res.json({ roast });
  } catch (error) {
    console.error('Roast error:', error);
    res.status(500).json({ error: 'Failed to generate roast' });
  }
});

module.exports = router;
