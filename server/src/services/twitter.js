const { TwitterApi } = require('twitter-api-v2');

class TwitterService {
  constructor() {
    this.client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    this.readOnly = this.client.readOnly;
  }

  async getUser(username) {
    try {
      console.log('Fetching user:', username);
      console.log('Bearer token exists:', !!process.env.TWITTER_BEARER_TOKEN);
      console.log('Bearer token length:', process.env.TWITTER_BEARER_TOKEN?.length);
      
      const user = await this.readOnly.v2.userByUsername(username, {
        'user.fields': [
          'created_at',
          'description',
          'entities',
          'location',
          'pinned_tweet_id',
          'profile_image_url',
          'protected',
          'public_metrics',
          'url',
          'verified',
          'verified_type'
        ]
      });
      console.log('User response:', JSON.stringify(user));
      return user.data;
    } catch (error) {
      console.error('Error fetching user:', error.message);
      console.error('Error data:', JSON.stringify(error.data || error));
      throw error;
    }
  }

  async getUserTweets(userId, maxResults = 100) {
    try {
      const tweets = await this.readOnly.v2.userTimeline(userId, {
        max_results: maxResults,
        'tweet.fields': ['created_at', 'public_metrics', 'entities'],
        exclude: ['retweets', 'replies']
      });
      return tweets.data?.data || [];
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  }

  async getFollowers(userId, maxResults = 100) {
    try {
      const followers = await this.readOnly.v2.followers(userId, {
        max_results: Math.min(maxResults, 1000),
        'user.fields': ['public_metrics', 'created_at', 'verified']
      });
      return followers.data?.data || [];
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  }
}

module.exports = new TwitterService();
