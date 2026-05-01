const express = require('express');
const router = express.Router();
const { createCanvas, loadImage, registerFont } = require('canvas');
const axios = require('axios');

// Generate shareable stat card
router.post('/generate', async (req, res) => {
  try {
    const { analysis } = req.body;

    if (!analysis) {
      return res.status(400).json({ error: 'Analysis data required' });
    }

    const { user, metrics, scores, tier, engagement, overallScore } = analysis;

    // Create canvas
    const width = 600;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0D0D0D');
    gradient.addColorStop(1, '#1A1A2E');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Border
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(10, 10, width - 20, height - 20);

    // XRay branding
    ctx.fillStyle = '#666';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('XRAY', 30, 40);

    // Tier badge
    const tierColors = {
      'S': '#FFD700',
      'A': '#00FF88',
      'B': '#00BFFF',
      'C': '#FFA500',
      'D': '#FF6B6B',
      'F': '#888888'
    };
    
    ctx.fillStyle = tierColors[tier] || '#888';
    ctx.beginPath();
    ctx.arc(width - 60, 60, 35, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.fillStyle = '#000';
    ctx.font = 'bold 36px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(tier, width - 60, 72);
    ctx.textAlign = 'left';

    // Profile image placeholder (circle)
    ctx.fillStyle = '#333';
    ctx.beginPath();
    ctx.arc(90, 120, 50, 0, Math.PI * 2);
    ctx.fill();

    // Try to load profile image
    try {
      if (user.profileImage) {
        const response = await axios.get(user.profileImage, { responseType: 'arraybuffer' });
        const img = await loadImage(Buffer.from(response.data));
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(90, 120, 48, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, 42, 72, 96, 96);
        ctx.restore();
      }
    } catch (e) {
      // Profile image failed to load, keep placeholder
    }

    // Username and name
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(user.name || user.username, 160, 105);
    
    ctx.fillStyle = '#888';
    ctx.font = '16px Arial';
    ctx.fillText(`@${user.username}`, 160, 130);

    // Overall score
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 48px Arial';
    ctx.fillText(overallScore.toString(), 160, 180);
    ctx.font = '16px Arial';
    ctx.fillStyle = '#888';
    ctx.fillText('/ 100', 230, 180);

    // Stats grid
    const statsY = 220;
    const statsSpacing = 140;

    // Followers
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(formatNumber(metrics.followers), 30, statsY);
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.fillText('FOLLOWERS', 30, statsY + 18);

    // Following
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(formatNumber(metrics.following), 30 + statsSpacing, statsY);
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.fillText('FOLLOWING', 30 + statsSpacing, statsY + 18);

    // Tweets
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(formatNumber(metrics.tweets), 30 + statsSpacing * 2, statsY);
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.fillText('TWEETS', 30 + statsSpacing * 2, statsY + 18);

    // Engagement
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`${engagement.rate}%`, 30 + statsSpacing * 3, statsY);
    ctx.fillStyle = '#888';
    ctx.font = '12px Arial';
    ctx.fillText('ENGAGEMENT', 30 + statsSpacing * 3, statsY + 18);

    // Score bars
    const barsY = 280;
    const barWidth = 100;
    const barHeight = 8;

    const scoreItems = [
      { label: 'Ratio', value: scores.ratio },
      { label: 'Age', value: scores.age },
      { label: 'Activity', value: scores.activity },
      { label: 'Engagement', value: scores.engagement },
      { label: 'Influence', value: scores.influence }
    ];

    scoreItems.forEach((item, i) => {
      const x = 30 + (i * 112);
      
      // Label
      ctx.fillStyle = '#888';
      ctx.font = '11px Arial';
      ctx.fillText(item.label, x, barsY);
      
      // Bar background
      ctx.fillStyle = '#333';
      ctx.fillRect(x, barsY + 8, barWidth, barHeight);
      
      // Bar fill
      const fillColor = item.value >= 70 ? '#00FF88' : item.value >= 40 ? '#FFA500' : '#FF6B6B';
      ctx.fillStyle = fillColor;
      ctx.fillRect(x, barsY + 8, (item.value / 100) * barWidth, barHeight);
      
      // Value
      ctx.fillStyle = '#FFF';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(item.value.toString(), x + barWidth + 5, barsY + 16);
    });

    // Footer
    ctx.fillStyle = '#444';
    ctx.font = '11px Arial';
    ctx.fillText('Generated by XRay • xray.vercel.app', 30, height - 25);

    // Convert to base64
    const buffer = canvas.toBuffer('image/png');
    const base64 = `data:image/png;base64,${buffer.toString('base64')}`;

    res.json({ card: base64 });
  } catch (error) {
    console.error('Card generation error:', error);
    res.status(500).json({ error: 'Failed to generate card' });
  }
});

function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

module.exports = router;
