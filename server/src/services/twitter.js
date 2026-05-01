const axios = require('axios');

class TwitterService {
  constructor() {
    // Twitter's public bearer token (used by web client)
    this.bearerToken = 'AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA';
    this.guestToken = null;
    this.guestTokenExpiry = 0;
  }

  async getGuestToken() {
    // Reuse guest token if still valid (they last ~1 hour)
    if (this.guestToken && Date.now() < this.guestTokenExpiry) {
      return this.guestToken;
    }

    console.log('Fetching new guest token...');
    const response = await axios.post(
      'https://api.twitter.com/1.1/guest/activate.json',
      {},
      {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`
        },
        timeout: 10000
      }
    );

    this.guestToken = response.data.guest_token;
    this.guestTokenExpiry = Date.now() + (30 * 60 * 1000); // 30 min expiry
    console.log('Got guest token:', this.guestToken);
    return this.guestToken;
  }

  async getUser(username) {
    console.log('Fetching user:', username);
    
    try {
      const guestToken = await this.getGuestToken();
      
      // Use Twitter's GraphQL endpoint
      const variables = JSON.stringify({ screen_name: username });
      const features = JSON.stringify({
        hidden_profile_subscriptions_enabled: true,
        rweb_tipjar_consumption_enabled: true,
        responsive_web_graphql_exclude_directive_enabled: true,
        verified_phone_label_enabled: false,
        subscriptions_verification_info_is_identity_verified_enabled: true,
        subscriptions_verification_info_verified_since_enabled: true,
        highlights_tweets_tab_ui_enabled: true,
        responsive_web_twitter_article_notes_tab_enabled: true,
        subscriptions_feature_can_gift_premium: true,
        creator_subscriptions_tweet_preview_api_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
        responsive_web_graphql_timeline_navigation_enabled: true
      });

      const url = `https://twitter.com/i/api/graphql/G3KGOASz96M-Qu0nwmGXNg/UserByScreenName?variables=${encodeURIComponent(variables)}&features=${encodeURIComponent(features)}`;

      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${this.bearerToken}`,
          'x-guest-token': guestToken,
          'x-twitter-active-user': 'yes',
          'x-twitter-client-language': 'en',
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      const userData = response.data?.data?.user?.result;
      
      if (!userData || userData.__typename === 'UserUnavailable') {
        throw new Error('User not found or unavailable');
      }

      const legacy = userData.legacy || {};
      
      return {
        id: userData.rest_id,
        username: legacy.screen_name || username,
        name: legacy.name || username,
        description: legacy.description || '',
        profile_image_url: legacy.profile_image_url_https?.replace('_normal', '_400x400'),
        verified: userData.is_blue_verified || legacy.verified,
        verified_type: userData.is_blue_verified ? 'blue' : (legacy.verified ? 'legacy' : null),
        created_at: legacy.created_at ? new Date(legacy.created_at).toISOString() : null,
        location: legacy.location || null,
        public_metrics: {
          followers_count: legacy.followers_count || 0,
          following_count: legacy.friends_count || 0,
          tweet_count: legacy.statuses_count || 0,
          listed_count: legacy.listed_count || 0,
          like_count: legacy.favourites_count || 0
        }
      };

    } catch (error) {
      console.error('Error fetching user:', error.message);
      
      // Check for specific error types
      if (error.response?.status === 404 || error.message.includes('not found')) {
        throw new Error('User not found');
      }
      
      throw error;
    }
  }

  async getUserTweets(userId, maxResults = 50) {
    // Tweet fetching via GraphQL would require additional endpoints
    // For now, return empty - engagement will be estimated from profile metrics
    console.log('Tweet fetching via GraphQL not implemented yet');
    return [];
  }

  async getFollowers(userId, maxResults = 100) {
    // Follower list requires auth
    console.log('Follower list not available via guest token');
    return [];
  }
}

module.exports = new TwitterService();
