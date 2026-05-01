const axios = require('axios');

class WalletService {
  constructor() {
    // Using public Solana RPC and APIs
    this.heliusApiKey = process.env.HELIUS_API_KEY;
    this.solanaRpc = this.heliusApiKey 
      ? `https://mainnet.helius-rpc.com/?api-key=${this.heliusApiKey}`
      : 'https://api.mainnet-beta.solana.com';
  }

  async analyzeWallet(address) {
    console.log('Analyzing Solana wallet:', address);

    try {
      const [balance, txHistory, tokens, nfts] = await Promise.all([
        this.getBalance(address),
        this.getTransactionHistory(address),
        this.getTokenBalances(address),
        this.getNFTs(address)
      ]);

      const analysis = {
        address,
        balance: {
          sol: balance,
          usd: balance * await this.getSolPrice()
        },
        transactions: {
          total: txHistory.total,
          recent: txHistory.recent,
          firstTx: txHistory.firstTx,
          lastTx: txHistory.lastTx
        },
        tokens: {
          count: tokens.length,
          holdings: tokens.slice(0, 10) // Top 10 tokens
        },
        nfts: {
          count: nfts.length,
          collections: this.groupNFTsByCollection(nfts)
        },
        scores: this.calculateWalletScores(balance, txHistory, tokens, nfts),
        walletAge: this.calculateWalletAge(txHistory.firstTx),
        tier: null
      };

      analysis.tier = this.calculateWalletTier(analysis.scores);
      analysis.overallScore = this.calculateOverallWalletScore(analysis.scores);

      return analysis;
    } catch (error) {
      console.error('Wallet analysis error:', error.message);
      throw error;
    }
  }

  async getBalance(address) {
    try {
      const response = await axios.post(this.solanaRpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getBalance',
        params: [address]
      }, { timeout: 10000 });

      return (response.data.result?.value || 0) / 1e9; // Convert lamports to SOL
    } catch (error) {
      console.error('Balance fetch error:', error.message);
      return 0;
    }
  }

  async getTransactionHistory(address) {
    try {
      const response = await axios.post(this.solanaRpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getSignaturesForAddress',
        params: [address, { limit: 100 }]
      }, { timeout: 15000 });

      const signatures = response.data.result || [];
      
      return {
        total: signatures.length,
        recent: signatures.slice(0, 10).map(s => ({
          signature: s.signature,
          timestamp: s.blockTime ? new Date(s.blockTime * 1000).toISOString() : null,
          status: s.err ? 'failed' : 'success'
        })),
        firstTx: signatures.length > 0 ? signatures[signatures.length - 1].blockTime : null,
        lastTx: signatures.length > 0 ? signatures[0].blockTime : null
      };
    } catch (error) {
      console.error('Transaction history error:', error.message);
      return { total: 0, recent: [], firstTx: null, lastTx: null };
    }
  }

  async getTokenBalances(address) {
    try {
      const response = await axios.post(this.solanaRpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ]
      }, { timeout: 15000 });

      const accounts = response.data.result?.value || [];
      
      return accounts
        .map(acc => ({
          mint: acc.account.data.parsed.info.mint,
          amount: acc.account.data.parsed.info.tokenAmount.uiAmount,
          decimals: acc.account.data.parsed.info.tokenAmount.decimals
        }))
        .filter(t => t.amount > 0)
        .sort((a, b) => b.amount - a.amount);
    } catch (error) {
      console.error('Token balances error:', error.message);
      return [];
    }
  }

  async getNFTs(address) {
    // If we have Helius, use their enhanced API
    if (this.heliusApiKey) {
      try {
        const response = await axios.get(
          `https://api.helius.xyz/v0/addresses/${address}/nfts?api-key=${this.heliusApiKey}`,
          { timeout: 15000 }
        );
        return response.data || [];
      } catch (error) {
        console.error('Helius NFT fetch error:', error.message);
      }
    }

    // Fallback: just count token accounts with 1 balance (likely NFTs)
    try {
      const response = await axios.post(this.solanaRpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'getTokenAccountsByOwner',
        params: [
          address,
          { programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA' },
          { encoding: 'jsonParsed' }
        ]
      }, { timeout: 15000 });

      const accounts = response.data.result?.value || [];
      
      // NFTs typically have amount = 1 and decimals = 0
      return accounts
        .filter(acc => {
          const info = acc.account.data.parsed.info.tokenAmount;
          return info.uiAmount === 1 && info.decimals === 0;
        })
        .map(acc => ({
          mint: acc.account.data.parsed.info.mint,
          name: 'Unknown NFT'
        }));
    } catch (error) {
      console.error('NFT fetch error:', error.message);
      return [];
    }
  }

  async getSolPrice() {
    try {
      const response = await axios.get(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd',
        { timeout: 5000 }
      );
      return response.data.solana?.usd || 150; // Fallback price
    } catch (error) {
      return 150; // Fallback
    }
  }

  groupNFTsByCollection(nfts) {
    const collections = {};
    nfts.forEach(nft => {
      const collection = nft.collection?.name || nft.collectionName || 'Unknown';
      if (!collections[collection]) {
        collections[collection] = { name: collection, count: 0 };
      }
      collections[collection].count++;
    });
    return Object.values(collections).sort((a, b) => b.count - a.count).slice(0, 5);
  }

  calculateWalletScores(balance, txHistory, tokens, nfts) {
    // Balance Score (0-100)
    let balanceScore;
    if (balance >= 1000) balanceScore = 100;
    else if (balance >= 100) balanceScore = 85;
    else if (balance >= 10) balanceScore = 70;
    else if (balance >= 1) balanceScore = 55;
    else if (balance >= 0.1) balanceScore = 40;
    else if (balance > 0) balanceScore = 25;
    else balanceScore = 0;

    // Activity Score (0-100)
    let activityScore;
    if (txHistory.total >= 1000) activityScore = 100;
    else if (txHistory.total >= 500) activityScore = 85;
    else if (txHistory.total >= 100) activityScore = 70;
    else if (txHistory.total >= 50) activityScore = 55;
    else if (txHistory.total >= 10) activityScore = 40;
    else if (txHistory.total > 0) activityScore = 25;
    else activityScore = 0;

    // Diversity Score (tokens + NFTs)
    const diversityCount = tokens.length + nfts.length;
    let diversityScore;
    if (diversityCount >= 50) diversityScore = 100;
    else if (diversityCount >= 20) diversityScore = 80;
    else if (diversityCount >= 10) diversityScore = 60;
    else if (diversityCount >= 5) diversityScore = 40;
    else if (diversityCount > 0) diversityScore = 25;
    else diversityScore = 0;

    // Age Score
    const walletAge = this.calculateWalletAge(txHistory.firstTx);
    let ageScore;
    if (walletAge.days >= 365 * 2) ageScore = 100;
    else if (walletAge.days >= 365) ageScore = 80;
    else if (walletAge.days >= 180) ageScore = 60;
    else if (walletAge.days >= 90) ageScore = 40;
    else if (walletAge.days >= 30) ageScore = 25;
    else ageScore = 10;

    // NFT Score
    let nftScore;
    if (nfts.length >= 100) nftScore = 100;
    else if (nfts.length >= 50) nftScore = 85;
    else if (nfts.length >= 20) nftScore = 70;
    else if (nfts.length >= 10) nftScore = 55;
    else if (nfts.length >= 5) nftScore = 40;
    else if (nfts.length > 0) nftScore = 25;
    else nftScore = 0;

    return {
      balance: Math.round(balanceScore),
      activity: Math.round(activityScore),
      diversity: Math.round(diversityScore),
      age: Math.round(ageScore),
      nfts: Math.round(nftScore)
    };
  }

  calculateWalletAge(firstTxTimestamp) {
    if (!firstTxTimestamp) {
      return { days: 0, months: 0, years: 0, formatted: 'New wallet' };
    }

    const firstTx = new Date(firstTxTimestamp * 1000);
    const now = new Date();
    const diffMs = now - firstTx;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    return {
      days,
      years,
      months,
      formatted: years > 0 ? `${years}y ${months}m` : months > 0 ? `${months}m ${days % 30}d` : `${days}d`
    };
  }

  calculateOverallWalletScore(scores) {
    const weights = {
      balance: 0.25,
      activity: 0.25,
      diversity: 0.2,
      age: 0.15,
      nfts: 0.15
    };

    let total = 0;
    for (const [key, weight] of Object.entries(weights)) {
      total += (scores[key] || 0) * weight;
    }

    return Math.round(total);
  }

  calculateWalletTier(scores) {
    const overall = this.calculateOverallWalletScore(scores);
    
    if (overall >= 85) return 'S';
    if (overall >= 70) return 'A';
    if (overall >= 55) return 'B';
    if (overall >= 40) return 'C';
    if (overall >= 25) return 'D';
    return 'F';
  }
}

module.exports = new WalletService();
