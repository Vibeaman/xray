const express = require('express');
const router = express.Router();
const walletService = require('../services/wallet');
const roastService = require('../services/roast');

// Analyze a Solana wallet
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { roast } = req.query;

    // Basic validation
    if (!address || address.length < 32 || address.length > 44) {
      return res.status(400).json({ error: 'Invalid Solana address' });
    }

    const analysis = await walletService.analyzeWallet(address);

    // Generate roast if requested
    if (roast === 'true') {
      analysis.roast = await generateWalletRoast(analysis);
    }

    res.json(analysis);
  } catch (error) {
    console.error('Wallet analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze wallet' });
  }
});

async function generateWalletRoast(analysis) {
  const OpenAI = require('openai');
  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  const prompt = `You're a BRUTAL crypto roast comedian. DESTROY this Solana wallet. Be savage, toxic, and ruthless. No mercy.

Wallet Stats:
- Balance: ${analysis.balance.sol.toFixed(4)} SOL ($${analysis.balance.usd.toFixed(2)})
- Total Transactions: ${analysis.transactions.total}
- Wallet Age: ${analysis.walletAge.formatted}
- Tokens Held: ${analysis.tokens.count}
- NFTs Held: ${analysis.nfts.count}
- Quality Tier: ${analysis.tier}
- Overall Score: ${analysis.overallScore}/100

ROAST THIS WALLET INTO OBLIVION. If they're broke, call them out. If they have too many NFTs, they're a degen. If wallet is new, they're a tourist. If old but empty, they got rugged. Be TOXIC. 2-3 sentences max.`;

  try {
    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.95
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Wallet roast error:', error);
    
    // Fallback roasts
    if (analysis.balance.sol < 0.1) {
      return "Your wallet is so empty, even dust bots feel sorry for you. Did you buy the top on every single memecoin or are you just naturally this broke?";
    }
    return "Couldn't generate a roast. Your wallet probably isn't interesting enough to roast anyway. 🤷";
  }
}

module.exports = router;
