const express = require('express');
const router = express.Router();
const sharp = require('sharp');
const roastService = require('../services/roast');

// Apply style effects to PFP
router.post('/style', async (req, res) => {
  try {
    const { image, style } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image required' });
    }

    // Decode base64 image
    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    let processed;

    switch (style) {
      case 'grayscale':
        processed = await sharp(imageBuffer).grayscale().png().toBuffer();
        break;
      
      case 'blur':
        processed = await sharp(imageBuffer).blur(5).png().toBuffer();
        break;
      
      case 'sharpen':
        processed = await sharp(imageBuffer).sharpen({ sigma: 2 }).png().toBuffer();
        break;
      
      case 'negate':
        processed = await sharp(imageBuffer).negate().png().toBuffer();
        break;
      
      case 'sepia':
        processed = await sharp(imageBuffer)
          .modulate({ saturation: 0.5 })
          .tint({ r: 112, g: 66, b: 20 })
          .png()
          .toBuffer();
        break;
      
      case 'vintage':
        processed = await sharp(imageBuffer)
          .modulate({ brightness: 1.1, saturation: 0.8 })
          .gamma(1.2)
          .png()
          .toBuffer();
        break;

      case 'vibrant':
        processed = await sharp(imageBuffer)
          .modulate({ saturation: 1.5, brightness: 1.1 })
          .png()
          .toBuffer();
        break;

      case 'cool':
        processed = await sharp(imageBuffer)
          .tint({ r: 100, g: 150, b: 255 })
          .png()
          .toBuffer();
        break;

      case 'warm':
        processed = await sharp(imageBuffer)
          .tint({ r: 255, g: 150, b: 100 })
          .png()
          .toBuffer();
        break;

      default:
        processed = await sharp(imageBuffer).png().toBuffer();
    }

    const base64Result = `data:image/png;base64,${processed.toString('base64')}`;
    res.json({ image: base64Result, style });
  } catch (error) {
    console.error('PFP style error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
});

// Add seasonal overlay to PFP
router.post('/seasonal', async (req, res) => {
  try {
    const { image, season } = req.body;

    if (!image) {
      return res.status(400).json({ error: 'Image required' });
    }

    const imageBuffer = Buffer.from(image.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    const size = Math.min(metadata.width || 400, metadata.height || 400);

    // For now, just apply a tint based on season
    // In production, you'd overlay actual seasonal graphics
    let processed;

    switch (season) {
      case 'winter':
        processed = await sharp(imageBuffer)
          .modulate({ brightness: 1.1 })
          .tint({ r: 200, g: 220, b: 255 })
          .png()
          .toBuffer();
        break;
      
      case 'spring':
        processed = await sharp(imageBuffer)
          .modulate({ saturation: 1.2 })
          .tint({ r: 255, g: 230, b: 240 })
          .png()
          .toBuffer();
        break;
      
      case 'summer':
        processed = await sharp(imageBuffer)
          .modulate({ brightness: 1.15, saturation: 1.1 })
          .tint({ r: 255, g: 240, b: 200 })
          .png()
          .toBuffer();
        break;
      
      case 'fall':
        processed = await sharp(imageBuffer)
          .modulate({ saturation: 1.1 })
          .tint({ r: 255, g: 200, b: 150 })
          .png()
          .toBuffer();
        break;
      
      case 'halloween':
        processed = await sharp(imageBuffer)
          .modulate({ saturation: 0.9, brightness: 0.9 })
          .tint({ r: 255, g: 150, b: 50 })
          .png()
          .toBuffer();
        break;
      
      case 'christmas':
        processed = await sharp(imageBuffer)
          .modulate({ saturation: 1.1 })
          .tint({ r: 255, g: 200, b: 200 })
          .png()
          .toBuffer();
        break;

      default:
        processed = await sharp(imageBuffer).png().toBuffer();
    }

    const base64Result = `data:image/png;base64,${processed.toString('base64')}`;
    res.json({ image: base64Result, season });
  } catch (error) {
    console.error('Seasonal PFP error:', error);
    res.status(500).json({ error: 'Failed to process image' });
  }
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

// Merge two PFPs
router.post('/merge', async (req, res) => {
  try {
    const { image1, image2, mode = 'blend' } = req.body;

    if (!image1 || !image2) {
      return res.status(400).json({ error: 'Two images required' });
    }

    const buffer1 = Buffer.from(image1.replace(/^data:image\/\w+;base64,/, ''), 'base64');
    const buffer2 = Buffer.from(image2.replace(/^data:image\/\w+;base64,/, ''), 'base64');

    // Resize both to same size
    const size = 400;
    const img1 = await sharp(buffer1).resize(size, size).png().toBuffer();
    const img2 = await sharp(buffer2).resize(size, size).png().toBuffer();

    let merged;

    if (mode === 'split') {
      // Left half of img1, right half of img2
      const left = await sharp(img1).extract({ left: 0, top: 0, width: size / 2, height: size }).toBuffer();
      const right = await sharp(img2).extract({ left: size / 2, top: 0, width: size / 2, height: size }).toBuffer();
      
      merged = await sharp({
        create: { width: size, height: size, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
      })
        .composite([
          { input: left, left: 0, top: 0 },
          { input: right, left: size / 2, top: 0 }
        ])
        .png()
        .toBuffer();
    } else {
      // Blend mode - overlay with transparency
      merged = await sharp(img1)
        .composite([{ input: img2, blend: 'overlay' }])
        .png()
        .toBuffer();
    }

    const base64Result = `data:image/png;base64,${merged.toString('base64')}`;
    res.json({ image: base64Result, mode });
  } catch (error) {
    console.error('PFP merge error:', error);
    res.status(500).json({ error: 'Failed to merge images' });
  }
});

module.exports = router;
