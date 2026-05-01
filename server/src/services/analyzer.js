const twitterService = require('./twitter');

class AnalyzerService {
  
  async analyzeAccount(username) {
    // Fetch user data
    const user = await twitterService.getUser(username);
    if (!user) throw new Error('User not found');

    const userId = user.id;
    const metrics = user.public_metrics || { followers_count: 0, following_count: 0, tweet_count: 0, listed_count: 0, like_count: 0 };

    // Fetch recent tweets + pinned tweet
    let tweetData = { tweets: [], pinnedTweet: null };
    try {
      tweetData = await twitterService.getUserTweets(userId, 5);
    } catch (err) {
      console.error('Failed to fetch tweets:', err.message);
    }

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
        listed: metrics.listed_count,
        likes: metrics.like_count || 0
      },
      recentTweets: tweetData.tweets,
      pinnedTweet: tweetData.pinnedTweet,
      scores: this.calculateScores(user),
      engagement: this.estimateEngagement(user),
      accountAge: this.calculateAccountAge(user.created_at),
      tier: null
    };

    // Calculate overall tier
    analysis.tier = this.calculateTier(analysis.scores);
    analysis.overallScore = this.calculateOverallScore(analysis.scores);

    return analysis;
  }

  calculateScores(user) {
    const metrics = user.public_metrics;
    const followers = metrics.followers_count || 0;
    const following = metrics.following_count || 1;
    const tweets = metrics.tweet_count || 0;
    const listed = metrics.listed_count || 0;
    const likes = metrics.like_count || 0;
    
    // Account age in days
    const ageInDays = Math.max(1, (Date.now() - new Date(user.created_at)) / (1000 * 60 * 60 * 24));

    // 1. Follower/Following Ratio Score (0-100)
    // Good ratio: followers > following (influencer), bad: following >> followers (spammy)
    const ratio = followers / Math.max(following, 1);
    let ratioScore;
    if (ratio >= 10) ratioScore = 100;
    else if (ratio >= 5) ratioScore = 85;
    else if (ratio >= 2) ratioScore = 70;
    else if (ratio >= 1) ratioScore = 55;
    else if (ratio >= 0.5) ratioScore = 40;
    else if (ratio >= 0.2) ratioScore = 25;
    else ratioScore = 10;

    // 2. Account Age Score (0-100)
    // Older accounts are more established
    let ageScore;
    if (ageInDays >= 365 * 5) ageScore = 100; // 5+ years
    else if (ageInDays >= 365 * 3) ageScore = 85; // 3+ years
    else if (ageInDays >= 365 * 2) ageScore = 70; // 2+ years
    else if (ageInDays >= 365) ageScore = 55; // 1+ years
    else if (ageInDays >= 180) ageScore = 40; // 6+ months
    else if (ageInDays >= 90) ageScore = 25; // 3+ months
    else ageScore = 10;

    // 3. Activity Score (0-100)
    // Based on tweets per day - optimal is 1-5 tweets/day
    const tweetsPerDay = tweets / ageInDays;
    let activityScore;
    if (tweetsPerDay >= 1 && tweetsPerDay <= 10) activityScore = 100; // Active but not spammy
    else if (tweetsPerDay > 10 && tweetsPerDay <= 20) activityScore = 80; // Very active
    else if (tweetsPerDay > 20) activityScore = 50; // Possibly spammy
    else if (tweetsPerDay >= 0.5) activityScore = 75; // Moderately active
    else if (tweetsPerDay >= 0.1) activityScore = 50; // Occasional
    else activityScore = 20; // Dormant

    // 4. Estimated Engagement Score (0-100)
    // Since we can't get actual tweets, estimate from:
    // - Likes given (active user who engages)
    // - Listed count (others find them valuable)
    // - Follower quality indicators
    
    const likesPerDay = likes / ageInDays;
    const listsPerFollower = (listed / Math.max(followers, 1)) * 1000;
    const followersPerTweet = followers / Math.max(tweets, 1);
    
    // Estimate: accounts with high listed count relative to followers get good engagement
    // Accounts that like a lot are engaged users
    // Good followers-per-tweet ratio suggests quality content
    
    let engagementScore = 0;
    
    // Listed ratio (high value signal)
    if (listsPerFollower >= 5) engagementScore += 35;
    else if (listsPerFollower >= 2) engagementScore += 25;
    else if (listsPerFollower >= 1) engagementScore += 15;
    else if (listsPerFollower >= 0.5) engagementScore += 10;
    else engagementScore += 5;
    
    // Activity engagement (likes given)
    if (likesPerDay >= 5 && likesPerDay <= 50) engagementScore += 25;
    else if (likesPerDay >= 1) engagementScore += 15;
    else if (likesPerDay >= 0.1) engagementScore += 10;
    else engagementScore += 5;
    
    // Followers per tweet (content quality indicator)
    if (followersPerTweet >= 1) engagementScore += 40;
    else if (followersPerTweet >= 0.5) engagementScore += 30;
    else if (followersPerTweet >= 0.1) engagementScore += 20;
    else if (followersPerTweet >= 0.05) engagementScore += 15;
    else engagementScore += 5;
    
    engagementScore = Math.min(100, engagementScore);

    // 5. Influence Score (0-100)
    // Based on followers, verification, listed count
    let influenceScore = 0;
    
    // Follower tiers
    if (followers >= 1000000) influenceScore += 50;
    else if (followers >= 100000) influenceScore += 40;
    else if (followers >= 10000) influenceScore += 30;
    else if (followers >= 1000) influenceScore += 20;
    else if (followers >= 500) influenceScore += 15;
    else if (followers >= 100) influenceScore += 10;
    else influenceScore += 5;
    
    // Listed count bonus
    if (listed >= 1000) influenceScore += 20;
    else if (listed >= 100) influenceScore += 15;
    else if (listed >= 10) influenceScore += 10;
    else if (listed >= 1) influenceScore += 5;
    
    // Verification bonus
    if (user.verified) {
      if (user.verified_type === 'business' || user.verified_type === 'government') {
        influenceScore += 30;
      } else if (user.verified_type === 'blue') {
        influenceScore += 15;
      } else {
        influenceScore += 20; // Legacy verified
      }
    }
    
    influenceScore = Math.min(100, influenceScore);

    return {
      ratio: Math.round(ratioScore),
      age: Math.round(ageScore),
      activity: Math.round(activityScore),
      engagement: Math.round(engagementScore),
      influence: Math.round(influenceScore)
    };
  }

  estimateEngagement(user) {
    const metrics = user.public_metrics;
    const followers = metrics.followers_count || 1;
    const tweets = metrics.tweet_count || 1;
    const likes = metrics.like_count || 0;
    const listed = metrics.listed_count || 0;
    
    // Estimate engagement rate from proxy metrics
    // Industry average is 0.5-2% for most accounts
    
    // Use listed/followers ratio as quality signal
    const listRatio = (listed / followers) * 100;
    
    // Estimate based on account characteristics
    let estimatedRate;
    if (listRatio >= 1) estimatedRate = 3.5; // High quality, likely good engagement
    else if (listRatio >= 0.5) estimatedRate = 2.5;
    else if (listRatio >= 0.1) estimatedRate = 1.5;
    else if (listRatio >= 0.01) estimatedRate = 0.8;
    else estimatedRate = 0.3;
    
    // Adjust for follower count (larger accounts typically have lower %)
    if (followers > 100000) estimatedRate *= 0.5;
    else if (followers > 10000) estimatedRate *= 0.7;
    else if (followers < 1000) estimatedRate *= 1.2;
    
    // Estimate avg likes based on followers and estimated rate
    const estimatedAvgLikes = Math.round(followers * (estimatedRate / 100));
    const estimatedAvgRetweets = Math.round(estimatedAvgLikes * 0.15);
    const estimatedAvgReplies = Math.round(estimatedAvgLikes * 0.08);

    return {
      rate: Math.round(estimatedRate * 100) / 100,
      avgLikes: estimatedAvgLikes,
      avgRetweets: estimatedAvgRetweets,
      avgReplies: estimatedAvgReplies,
      isEstimated: true // Flag that these are estimates
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
    // Weighted average - engagement weighted slightly lower since it's estimated
    const weights = {
      ratio: 0.2,
      age: 0.15,
      activity: 0.15,
      engagement: 0.25,
      influence: 0.25
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
