const twitterService = require('./twitter');

class AnalyzerService {
  
  async analyzeAccount(username) {
    // Fetch user data
    const user = await twitterService.getUser(username);
    if (!user) throw new Error('User not found');

    const userId = user.id;
    const metrics = user.public_metrics;

    // Fetch recent tweets for engagement analysis
    const tweets = await twitterService.getUserTweets(userId, 50);

    // Calculate metrics
    const analysis = {
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        description: user.description,
        profileImage: user.profile_image_url?.replace('_normal', '_400x400'),
        verified: user.verified,
        verifiedType: user.verified_type,
        createdAt: user.created_at,
        location: user.location
      },
      metrics: {
        followers: metrics.followers_count,
        following: metrics.following_count,
        tweets: metrics.tweet_count,
        listed: metrics.listed_count
      },
      scores: this.calculateScores(user, tweets),
      engagement: this.calculateEngagement(tweets, metrics.followers_count),
      accountAge: this.calculateAccountAge(user.created_at),
      tier: null // Will be set after scoring
    };

    // Calculate overall tier
    analysis.tier = this.calculateTier(analysis.scores);
    analysis.overallScore = this.calculateOverallScore(analysis.scores);

    return analysis;
  }

  calculateScores(user, tweets) {
    const metrics = user.public_metrics;
    
    // Follower/Following Ratio Score (0-100)
    const ratio = metrics.followers_count / Math.max(metrics.following_count, 1);
    const ratioScore = Math.min(100, ratio * 20);

    // Account Age Score (0-100)
    const ageInDays = (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24);
    const ageScore = Math.min(100, ageInDays / 10);

    // Activity Score (0-100)
    const tweetsPerDay = metrics.tweet_count / Math.max(ageInDays, 1);
    const activityScore = Math.min(100, tweetsPerDay * 10);

    // Engagement Score (0-100)
    let engagementScore = 0;
    if (tweets.length > 0) {
      const totalEngagement = tweets.reduce((sum, tweet) => {
        const tm = tweet.public_metrics || {};
        return sum + (tm.like_count || 0) + (tm.retweet_count || 0) * 2 + (tm.reply_count || 0) * 3;
      }, 0);
      const avgEngagement = totalEngagement / tweets.length;
      const engagementRate = (avgEngagement / Math.max(metrics.followers_count, 1)) * 100;
      engagementScore = Math.min(100, engagementRate * 20);
    }

    // Influence Score (based on listed count and verification)
    let influenceScore = Math.min(50, metrics.listed_count / 10);
    if (user.verified) influenceScore += 30;
    if (user.verified_type === 'blue') influenceScore += 10;
    if (user.verified_type === 'business') influenceScore += 20;
    influenceScore = Math.min(100, influenceScore);

    return {
      ratio: Math.round(ratioScore),
      age: Math.round(ageScore),
      activity: Math.round(activityScore),
      engagement: Math.round(engagementScore),
      influence: Math.round(influenceScore)
    };
  }

  calculateEngagement(tweets, followerCount) {
    if (!tweets || tweets.length === 0) {
      return { rate: 0, avgLikes: 0, avgRetweets: 0, avgReplies: 0 };
    }

    let totalLikes = 0, totalRetweets = 0, totalReplies = 0;

    tweets.forEach(tweet => {
      const m = tweet.public_metrics || {};
      totalLikes += m.like_count || 0;
      totalRetweets += m.retweet_count || 0;
      totalReplies += m.reply_count || 0;
    });

    const avgLikes = totalLikes / tweets.length;
    const avgRetweets = totalRetweets / tweets.length;
    const avgReplies = totalReplies / tweets.length;
    const totalEngagement = avgLikes + avgRetweets + avgReplies;
    const rate = (totalEngagement / Math.max(followerCount, 1)) * 100;

    return {
      rate: Math.round(rate * 100) / 100,
      avgLikes: Math.round(avgLikes),
      avgRetweets: Math.round(avgRetweets),
      avgReplies: Math.round(avgReplies)
    };
  }

  calculateAccountAge(createdAt) {
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const years = Math.floor(days / 365);
    const months = Math.floor((days % 365) / 30);

    return {
      days,
      years,
      months,
      formatted: years > 0 ? `${years}y ${months}m` : `${months}m ${days % 30}d`
    };
  }

  calculateOverallScore(scores) {
    // Weighted average
    const weights = {
      ratio: 0.2,
      age: 0.1,
      activity: 0.15,
      engagement: 0.35,
      influence: 0.2
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

module.exports = new AnalyzerService();
