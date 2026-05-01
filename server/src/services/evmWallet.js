const axios = require('axios');

class EVMWalletService {
  constructor() {
    // Public RPC endpoints (fallbacks)
    this.rpcEndpoints = {
      ethereum: process.env.ETH_RPC_URL || 'https://eth.llamarpc.com',
      bsc: process.env.BSC_RPC_URL || 'https://bsc-dataseed.binance.org',
      base: process.env.BASE_RPC_URL || 'https://mainnet.base.org',
      polygon: process.env.POLYGON_RPC_URL || 'https://polygon-rpc.com',
      arbitrum: process.env.ARBITRUM_RPC_URL || 'https://arb1.arbitrum.io/rpc'
    };

    // Block explorer APIs
    this.explorerApis = {
      ethereum: 'https://api.etherscan.io/api',
      bsc: 'https://api.bscscan.com/api',
      base: 'https://api.basescan.org/api',
      polygon: 'https://api.polygonscan.com/api',
      arbitrum: 'https://api.arbiscan.io/api'
    };

    // Native currency info
    this.nativeCurrency = {
      ethereum: { symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum' },
      bsc: { symbol: 'BNB', decimals: 18, coingeckoId: 'binancecoin' },
      base: { symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum' },
      polygon: { symbol: 'MATIC', decimals: 18, coingeckoId: 'matic-network' },
      arbitrum: { symbol: 'ETH', decimals: 18, coingeckoId: 'ethereum' }
    };
  }

  // Validate EVM address
  isValidAddress(address) {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  // Detect chain from context or default to ethereum
  detectChain(chain) {
    const validChains = ['ethereum', 'bsc', 'base', 'polygon', 'arbitrum'];
    if (chain && validChains.includes(chain.toLowerCase())) {
      return chain.toLowerCase();
    }
    return 'ethereum'; // Default
  }

  async analyzeWallet(address, chain = 'ethereum') {
    console.log(`Analyzing EVM wallet on ${chain}:`, address);

    if (!this.isValidAddress(address)) {
      throw new Error('Invalid EVM address');
    }

    chain = this.detectChain(chain);

    try {
      const [balance, txHistory, tokens, nfts, price] = await Promise.all([
        this.getBalance(address, chain),
        this.getTransactionHistory(address, chain),
        this.getTokenBalances(address, chain),
        this.getNFTs(address, chain),
        this.getNativePrice(chain)
      ]);

      const analysis = {
        address,
        chain,
        balance: {
          native: balance,
          symbol: this.nativeCurrency[chain].symbol,
          usd: balance * price
        },
        transactions: {
          total: txHistory.total,
          recent: txHistory.recent,
          firstTx: txHistory.firstTx,
          lastTx: txHistory.lastTx
        },
        tokens: {
          count: tokens.length,
          holdings: tokens.slice(0, 10)
        },
        nfts: {
          count: nfts.length,
          items: nfts.slice(0, 10)
        },
        scores: this.calculateScores(balance, txHistory, tokens, nfts),
        walletAge: this.calculateWalletAge(txHistory.firstTx),
        tier: null,
        overallScore: null
      };

      analysis.tier = this.calculateTier(analysis.scores);
      analysis.overallScore = this.calculateOverallScore(analysis.scores);

      return analysis;
    } catch (error) {
      console.error(`EVM wallet analysis error (${chain}):`, error.message);
      throw error;
    }
  }

  async getBalance(address, chain) {
    try {
      const rpc = this.rpcEndpoints[chain];
      const response = await axios.post(rpc, {
        jsonrpc: '2.0',
        id: 1,
        method: 'eth_getBalance',
        params: [address, 'latest']
      }, { timeout: 10000 });

      const balanceWei = parseInt(response.data.result, 16);
      return balanceWei / 1e18;
    } catch (error) {
      console.error(`Balance fetch error (${chain}):`, error.message);
      return 0;
    }
  }

  async getTransactionHistory(address, chain) {
    try {
      const apiUrl = this.explorerApis[chain];
      const apiKey = this.getApiKey(chain);
      
      // Note: Without API key, these have lower rate limits
      const url = `${apiUrl}?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=100&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`;
      
      const response = await axios.get(url, { timeout: 15000 });
      
      if (response.data.status !== '1' || !response.data.result) {
        return { total: 0, recent: [], firstTx: null, lastTx: null };
      }

      const txs = response.data.result;
      
      return {
        total: txs.length,
        recent: txs.slice(0, 10).map(tx => ({
          hash: tx.hash,
          timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
          from: tx.from,
          to: tx.to,
          value: parseInt(tx.value) / 1e18,
          status: tx.isError === '0' ? 'success' : 'failed'
        })),
        firstTx: txs.length > 0 ? parseInt(txs[txs.length - 1].timeStamp) : null,
        lastTx: txs.length > 0 ? parseInt(txs[0].timeStamp) : null
      };
    } catch (error) {
      console.error(`Transaction history error (${chain}):`, error.message);
      return { total: 0, recent: [], firstTx: null, lastTx: null };
    }
  }

  async getTokenBalances(address, chain) {
    try {
      const apiUrl = this.explorerApis[chain];
      const apiKey = this.getApiKey(chain);
      
      const url = `${apiUrl}?module=account&action=tokentx&address=${address}&page=1&offset=100&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`;
      
      const response = await axios.get(url, { timeout: 15000 });
      
      if (response.data.status !== '1' || !response.data.result) {
        return [];
      }

      // Aggregate unique tokens
      const tokenMap = new Map();
      
      response.data.result.forEach(tx => {
        const key = tx.contractAddress.toLowerCase();
        if (!tokenMap.has(key)) {
          tokenMap.set(key, {
            contract: tx.contractAddress,
            name: tx.tokenName,
            symbol: tx.tokenSymbol,
            decimals: parseInt(tx.tokenDecimal),
            lastSeen: tx.timeStamp
          });
        }
      });

      return Array.from(tokenMap.values()).slice(0, 20);
    } catch (error) {
      console.error(`Token balances error (${chain}):`, error.message);
      return [];
    }
  }

  async getNFTs(address, chain) {
    try {
      const apiUrl = this.explorerApis[chain];
      const apiKey = this.getApiKey(chain);
      
      const url = `${apiUrl}?module=account&action=tokennfttx&address=${address}&page=1&offset=100&sort=desc${apiKey ? `&apikey=${apiKey}` : ''}`;
      
      const response = await axios.get(url, { timeout: 15000 });
      
      if (response.data.status !== '1' || !response.data.result) {
        return [];
      }

      // Get unique NFTs currently held (received but not sent out)
      const nftMap = new Map();
      
      response.data.result.forEach(tx => {
        const key = `${tx.contractAddress}-${tx.tokenID}`;
        const isReceived = tx.to.toLowerCase() === address.toLowerCase();
        
        if (isReceived) {
          nftMap.set(key, {
            contract: tx.contractAddress,
            tokenId: tx.tokenID,
            name: tx.tokenName,
            symbol: tx.tokenSymbol
          });
        } else {
          nftMap.delete(key);
        }
      });

      return Array.from(nftMap.values());
    } catch (error) {
      console.error(`NFT fetch error (${chain}):`, error.message);
      return [];
    }
  }

  async getNativePrice(chain) {
    try {
      const coingeckoId = this.nativeCurrency[chain].coingeckoId;
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoId}&vs_currencies=usd`,
        { timeout: 5000 }
      );
      return response.data[coingeckoId]?.usd || this.getFallbackPrice(chain);
    } catch (error) {
      return this.getFallbackPrice(chain);
    }
  }

  getFallbackPrice(chain) {
    const fallbacks = {
      ethereum: 3500,
      bsc: 600,
      base: 3500,
      polygon: 0.7,
      arbitrum: 3500
    };
    return fallbacks[chain] || 1;
  }

  getApiKey(chain) {
    const keys = {
      ethereum: process.env.ETHERSCAN_API_KEY,
      bsc: process.env.BSCSCAN_API_KEY,
      base: process.env.BASESCAN_API_KEY,
      polygon: process.env.POLYGONSCAN_API_KEY,
      arbitrum: process.env.ARBISCAN_API_KEY
    };
    return keys[chain] || null;
  }

  calculateScores(balance, txHistory, tokens, nfts) {
    // Balance Score (0-100)
    let balanceScore;
    if (balance >= 100) balanceScore = 100;
    else if (balance >= 10) balanceScore = 85;
    else if (balance >= 1) balanceScore = 70;
    else if (balance >= 0.1) balanceScore = 55;
    else if (balance >= 0.01) balanceScore = 40;
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

    // Diversity Score
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
    if (walletAge.days >= 365 * 3) ageScore = 100;
    else if (walletAge.days >= 365 * 2) ageScore = 85;
    else if (walletAge.days >= 365) ageScore = 70;
    else if (walletAge.days >= 180) ageScore = 55;
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

  calculateOverallScore(scores) {
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

  calculateTier(scores) {
    const overall = this.calculateOverallScore(scores);
    
    if (overall >= 85) return 'S';
    if (overall >= 70) return 'A';
    if (overall >= 55) return 'B';
    if (overall >= 40) return 'C';
    if (overall >= 25) return 'D';
    return 'F';
  }
}

module.exports = new EVMWalletService();
