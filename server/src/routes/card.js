const express = require('express');
const router = express.Router();

// Generate shareable stat card data (frontend will render it)
router.post('/generate', async (req, res) => {
  try {
    const { analysis } = req.body;

    if (!analysis) {
      return res.status(400).json({ error: 'Analysis data required' });
    }

    // Return structured data for frontend to render as a card
    // The frontend will use HTML/CSS to create the visual card
    const cardData = {
      user: {
        username: analysis.user.username,
        name: analysis.user.name,
        profileImage: analysis.user.profileImage,
        verified: analysis.user.verified
      },
      tier: analysis.tier,
      overallScore: analysis.overallScore,
      metrics: analysis.metrics,
      scores: analysis.scores,
      engagement: analysis.engagement,
      accountAge: analysis.accountAge
    };

    res.json({ cardData });
  } catch (error) {
    console.error('Card generation error:', error);
    res.status(500).json({ error: 'Failed to generate card data' });
  }
});

module.exports = router;
