const express = require('express');
const router = express.Router();
const roastService = require('../services/roast');

// PFP style effects will be handled client-side with CSS filters
// This endpoint just returns the filter configuration

// Get available styles
router.get('/styles', (req, res) => {
  const styles = [
    { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(100%)' },
    { id: 'sepia', name: 'Sepia', filter: 'sepia(100%)' },
    { id: 'blur', name: 'Blur', filter: 'blur(3px)' },
    { id: 'brightness', name: 'Bright', filter: 'brightness(1.3)' },
    { id: 'contrast', name: 'High Contrast', filter: 'contrast(1.5)' },
    { id: 'saturate', name: 'Vibrant', filter: 'saturate(2)' },
    { id: 'hue-rotate-90', name: 'Hue Shift', filter: 'hue-rotate(90deg)' },
    { id: 'invert', name: 'Invert', filter: 'invert(100%)' },
    { id: 'vintage', name: 'Vintage', filter: 'sepia(50%) contrast(1.1) brightness(0.9)' },
    { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
    { id: 'warm', name: 'Warm', filter: 'sepia(30%) saturate(1.4)' }
  ];
  res.json({ styles });
});

// Get seasonal themes
router.get('/seasons', (req, res) => {
  const seasons = [
    { id: 'winter', name: 'Winter', filter: 'brightness(1.1) saturate(0.8) hue-rotate(180deg)', overlay: '#87CEEB33' },
    { id: 'spring', name: 'Spring', filter: 'saturate(1.3) brightness(1.1)', overlay: '#98FB9833' },
    { id: 'summer', name: 'Summer', filter: 'saturate(1.4) brightness(1.15) contrast(1.1)', overlay: '#FFD70033' },
    { id: 'fall', name: 'Fall', filter: 'sepia(30%) saturate(1.2)', overlay: '#FF8C0033' },
    { id: 'halloween', name: 'Halloween', filter: 'contrast(1.2) brightness(0.9)', overlay: '#FF450066' },
    { id: 'christmas', name: 'Christmas', filter: 'saturate(1.2)', overlay: '#FF000033' }
  ];
  res.json({ seasons });
});

// Generate lore for PFP
router.post('/lore', async (req, res) => {
  try {
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ error: 'PFP description required' });
    }

    const lore = await roastService.generateLore(description);
    res.json({ lore });
  } catch (error) {
    console.error('Lore generation error:', error);
    res.status(500).json({ error: 'Failed to generate lore' });
  }
});

module.exports = router;
