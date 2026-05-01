const express = require('express');
const router = express.Router();
const solanaWalletService = require('../services/wallet');
const evmWalletService = require('../services/evmWallet');

// Detect wallet type from address format
function detectWalletType(address) {
  // EVM addresses: 0x followed by 40 hex chars
  if (/^0x[a-fA-F0-9]{40}$/.test(address)) {
    return 'evm';
  }
  // Solana addresses: Base58, typically 32-44 chars
  if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address)) {
    return 'solana';
  }
  return null;
}

// Unified wallet analysis endpoint
router.get('/:address', async (req, res) => {
  try {
    const { address } = req.params;
    const { chain, roast } = req.query;

    // Detect wallet type
    const walletType = detectWalletType(address);
    
    if (!walletType) {
      return res.status(400).json({ 
        error: 'Invalid wallet address',
        hint: 'Supported formats: EVM (0x...) or Solana (base58)'
      });
    }

    let analysis;

    if (walletType === 'solana') {
      analysis = await solanaWalletService.analyzeWallet(address);
      analysis.walletType = 'solana';
      analysis.chain = 'solana';
    } else {
      // EVM wallet - use specified chain or default to ethereum
      const targetChain = chain || 'ethereum';
      analysis = await evmWalletService.analyzeWallet(address, targetChain);
      analysis.walletType = 'evm';
    }

    // Generate roast if requested
    if (roast === 'true') {
      analysis.roast = await generateWalletRoast(analysis);
    }

    res.json(analysis);
  } catch (error) {
    console.error('Wallet analysis error:', error);
    
    if (error.message.includes('Invalid')) {
      return res.status(400).json({ error: error.message });
    }
    
    res.status(500).json({ error: 'Failed to analyze wallet' });
  }
});

// Multi-chain analysis - analyze same EVM address across chains
router.get('/:address/multichain', async (req, res) => {
  try {
    const { address } = req.params;
    const { roast } = req.query;

    // Only for EVM addresses
    if (!evmWalletService.isValidAddress(address)) {
      return res.status(400).json({ 
        error: 'Multichain analysis only available for EVM addresses (0x...)'
      });
    }

    const chains = ['ethereum', 'bsc', 'base', 'polygon', 'arbitrum'];
    const results = {};
    let totalBalance = 0;
    let totalTransactions = 0;
    let totalTokens = 0;
    let totalNFTs = 0;

    // Analyze across all chains in parallel
    const analyses = await Promise.allSettled(
      chains.map(chain => evmWalletService.analyzeWallet(address, chain))
    );

    analyses.forEach((result, index) => {
      const chain = chains[index];
      if (result.status === 'fulfilled') {
        results[chain] = result.value;
        totalBalance += result.value.balance.usd || 0;
        totalTransactions += result.value.transactions.total || 0;
        totalTokens += result.value.tokens.count || 0;
        totalNFTs += result.value.nfts.count || 0;
      } else {
        results[chain] = { error: result.reason?.message || 'Failed to analyze' };
      }
    });

    const multiChainAnalysis = {
      address,
      walletType: 'evm',
      multichain: true,
      summary: {
        totalBalanceUSD: Math.round(totalBalance * 100) / 100,
        totalTransactions,
        totalTokens,
        totalNFTs,
        chainsActive: Object.values(results).filter(r => !r.error && r.transactions?.total > 0).length
      },
      chains: results,
      overallTier: calculateMultichainTier(totalBalance, totalTransactions, totalTokens, totalNFTs),
      overallScore: calculateMultichainScore(totalBalance, totalTransactions, totalTokens, totalNFTs)
    };

    if (roast === 'true') {
      multiChainAnalysis.roast = await generateMultichainRoast(multiChainAnalysis);
    }

    res.json(multiChainAnalysis);
  } catch (error) {
    console.error('Multichain analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze wallet across chains' });
  }
});

function calculateMultichainScore(balanceUSD, txCount, tokens, nfts) {
  let score = 0;
  
  // Balance (0-30)
  if (balanceUSD >= 100000) score += 30;
  else if (balanceUSD >= 10000) score += 25;
  else if (balanceUSD >= 1000) score += 20;
  else if (balanceUSD >= 100) score += 15;
  else if (balanceUSD >= 10) score += 10;
  else if (balanceUSD > 0) score += 5;

  // Activity (0-30)
  if (txCount >= 5000) score += 30;
  else if (txCount >= 1000) score += 25;
  else if (txCount >= 500) score += 20;
  else if (txCount >= 100) score += 15;
  else if (txCount >= 20) score += 10;
  else if (txCount > 0) score += 5;

  // Diversity (0-20)
  if (tokens >= 50) score += 20;
  else if (tokens >= 20) score += 15;
  else if (tokens >= 10) score += 12;
  else if (tokens >= 5) score += 8;
  else if (tokens > 0) score += 4;

  // NFTs (0-20)
  if (nfts >= 100) score += 20;
  else if (nfts >= 50) score += 16;
  else if (nfts >= 20) score += 12;
  else if (nfts >= 5) score += 8;
  else if (nfts > 0) score += 4;

  return score;
}

function calculateMultichainTier(balanceUSD, txCount, tokens, nfts) {
  const score = calculateMultichainScore(balanceUSD, txCount, tokens, nfts);
  
  if (score >= 85) return 'S';
  if (score >= 70) return 'A';
  if (score >= 55) return 'B';
  if (score >= 40) return 'C';
  if (score >= 25) return 'D';
  return 'F';
}

async function generateWalletRoast(analysis) {
  const OpenAI = require('openai');
  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  const chainName = analysis.chain === 'solana' ? 'Solana' : 
                    analysis.chain === 'bsc' ? 'BNB Chain' :
                    analysis.chain === 'ethereum' ? 'Ethereum' :
                    analysis.chain.charAt(0).toUpperCase() + analysis.chain.slice(1);

  const symbol = analysis.balance?.symbol || (analysis.chain === 'solana' ? 'SOL' : 'ETH');
  const nativeBalance = analysis.balance?.native || analysis.balance?.sol || 0;
  const usdBalance = analysis.balance?.usd || 0;

  const prompt = `You're a BRUTAL crypto roast comedian with absolutely ZERO chill. DESTROY this ${chainName} wallet. Be savage, toxic, and ruthless. No mercy. Make them regret ever connecting their wallet.

Wallet Stats:
- Chain: ${chainName}
- Balance: ${nativeBalance.toFixed(4)} ${symbol} ($${usdBalance.toFixed(2)})
- Total Transactions: ${analysis.transactions?.total || 0}
- Wallet Age: ${analysis.walletAge?.formatted || 'Unknown'}
- Tokens Held: ${analysis.tokens?.count || 0}
- NFTs Held: ${analysis.nfts?.count || 0}
- Quality Tier: ${analysis.tier}
- Overall Score: ${analysis.overallScore}/100

ABSOLUTELY DESTROY THIS WALLET. Be TOXIC:
- Broke? Humiliate them.
- Too many NFTs? Call them a JPEG hoarder who bought the top.
- New wallet? Tourist who'll get rugged.
- Old but empty? They already got rugged.
- BNB Chain? Mock them for being too broke for ETH gas.
- Low activity? They're scared of losing more money.

2-3 sentences of pure destruction. GO OFF.`;

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
    
    // Fallback roasts based on stats
    if (usdBalance < 10) {
      return `Your ${chainName} wallet has $${usdBalance.toFixed(2)}. That's not a portfolio, that's pocket change you forgot about. Even gas fees look at your balance and laugh.`;
    }
    if (analysis.nfts?.count > 20) {
      return `${analysis.nfts.count} NFTs? Congrats, you're the proud owner of the world's most expensive folder of screenshots. Your portfolio is basically a museum of bad decisions.`;
    }
    return "Couldn't generate a roast - your wallet is probably too boring to roast anyway. 🤷";
  }
}

async function generateMultichainRoast(analysis) {
  const OpenAI = require('openai');
  const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: 'https://openrouter.ai/api/v1'
  });

  const prompt = `You're a BRUTAL crypto roast comedian. This person's wallet has been analyzed across MULTIPLE chains. DESTROY them for spreading their poverty across the entire blockchain ecosystem.

Multichain Stats:
- Total Balance: $${analysis.summary.totalBalanceUSD}
- Total Transactions: ${analysis.summary.totalTransactions}
- Total Tokens: ${analysis.summary.totalTokens}
- Total NFTs: ${analysis.summary.totalNFTs}
- Chains Active: ${analysis.summary.chainsActive}/5

Be SAVAGE. Mock them for:
- Spreading crumbs across chains
- Being active on cheap chains (BNB, Polygon) = too broke for ETH gas
- Many chains but no money = desperately chasing airdrops
- Low activity everywhere = they gave up
- Lots of NFTs across chains = degenerate collector

2-3 sentences of BRUTAL roasting.`;

  try {
    const response = await client.chat.completions.create({
      model: 'openai/gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 150,
      temperature: 0.95
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Multichain roast error:', error);
    return `$${analysis.summary.totalBalanceUSD} spread across ${analysis.summary.chainsActive} chains? That's not diversification, that's just being broke in multiple currencies. Even your wallet is having an identity crisis.`;
  }
}

module.exports = router;
