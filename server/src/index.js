require('dotenv').config();
const express = require('express');
const cors = require('cors');

const analyzeRouter = require('./routes/analyze');
const pfpRouter = require('./routes/pfp');
const cardRouter = require('./routes/card');
const walletRouter = require('./routes/wallet');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Routes
app.use('/api/analyze', analyzeRouter);
app.use('/api/pfp', pfpRouter);
app.use('/api/card', cardRouter);
app.use('/api/wallet', walletRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'xray', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`XRay API running on port ${PORT}`);
});
