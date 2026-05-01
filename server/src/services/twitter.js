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

  async getUserTweets(userId, maxResults = 5) {
    console.log('Fetching tweets for user ID:', userId);
    
    try {
      const guestToken = await this.getGuestToken();
      
      // GraphQL query IDs (Twitter rotates these, try multiple)
      const queryIds = [
        'V7H0Ap3_Hh2FyS75OCDO3Q',
        'Tg82Ez_kxVaJf7OPbUdbCg', 
        'H8OOoI-5ZE4NxgRr8lfyWg',
        'eS7LO5Jy3xgmd3dbL044EA',
        'XicnWRbyQ3WgVY__VataBQ'
      ];
      
      const variables = JSON.stringify({
        userId: userId,
        count: 20,
        includePromotedContent: false,
        withQuickPromoteEligibilityTweetFields: false,
        withVoice: false,
        withV2Timeline: true
      });
      
      const features = JSON.stringify({
        rweb_tipjar_consumption_enabled: true,
        responsive_web_graphql_exclude_directive_enabled: true,
        verified_phone_label_enabled: false,
        creator_subscriptions_tweet_preview_api_enabled: true,
        responsive_web_graphql_timeline_navigation_enabled: true,
        responsive_web_graphql_skip_user_profile_image_extensions_enabled: false,
        communities_web_enable_tweet_community_results_fetch: true,
        c9s_tweet_anatomy_moderator_badge_enabled: true,
        articles_preview_enabled: true,
        responsive_web_edit_tweet_api_enabled: true,
        graphql_is_translatable_rweb_tweet_is_translatable_enabled: true,
        view_counts_everywhere_api_enabled: true,
        longform_notetweets_consumption_enabled: true,
        responsive_web_twitter_article_tweet_consumption_enabled: true,
        tweet_awards_web_tipping_enabled: false,
        creator_subscriptions_quote_tweet_preview_enabled: false,
        freedom_of_speech_not_reach_fetch_enabled: true,
        standardized_nudges_misinfo: true,
        tweet_with_visibility_results_prefer_gql_limited_actions_policy_enabled: true,
        rweb_video_timestamps_enabled: true,
        longform_notetweets_rich_text_read_enabled: true,
        longform_notetweets_inline_media_enabled: true,
        responsive_web_enhance_cards_enabled: false
      });

      // Try each query ID until one works
      for (const queryId of queryIds) {
        try {
          const url = `https://twitter.com/i/api/graphql/${queryId}/UserTweets?variables=${encodeURIComponent(variables)}&features=${encodeURIComponent(features)}`;
          
          console.log(`Trying query ID: ${queryId}`);
          
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

          const timeline = response.data?.data?.user?.result?.timeline_v2?.timeline?.instructions || [];
          
          if (timeline.length === 0) {
            console.log(`Query ${queryId} returned empty timeline, trying next...`);
            continue;
          }
          
          const tweets = [];
          let pinnedTweet = null;

          for (const instruction of timeline) {
            // Check for pinned tweet
            if (instruction.type === 'TimelinePinEntry') {
              const pinned = instruction.entry?.content?.itemContent?.tweet_results?.result;
              if (pinned?.legacy) {
                pinnedTweet = this.parseTweet(pinned);
                console.log('Found pinned tweet');
              }
            }
            
            // Get regular tweets
            if (instruction.type === 'TimelineAddEntries') {
              for (const entry of instruction.entries || []) {
                const tweetContent = entry?.content?.itemContent?.tweet_results?.result;
                if (tweetContent?.legacy && tweets.length < maxResults) {
                  // Skip retweets for analysis purposes
                  if (!tweetContent.legacy.retweeted_status_result) {
                    tweets.push(this.parseTweet(tweetContent));
                  }
                }
              }
            }
          }

          console.log(`Got ${tweets.length} tweets, pinned: ${pinnedTweet ? 'yes' : 'no'}`);
          
          return { tweets, pinnedTweet };
          
        } catch (err) {
          console.log(`Query ${queryId} failed: ${err.message}`);
          continue;
        }
      }
      
      // All query IDs failed
      console.log('All GraphQL query IDs failed');
      return { tweets: [], pinnedTweet: null };

    } catch (error) {
      console.error('Error fetching tweets:', error.message);
      return { tweets: [], pinnedTweet: null };
    }
  }

  parseTweet(tweetData) {
    const legacy = tweetData.legacy || {};
    return {
      id: legacy.id_str,
      text: legacy.full_text || legacy.text || '',
      created_at: legacy.created_at,
      metrics: {
        likes: legacy.favorite_count || 0,
        retweets: legacy.retweet_count || 0,
        replies: legacy.reply_count || 0,
        quotes: legacy.quote_count || 0,
        views: tweetData.views?.count ? parseInt(tweetData.views.count) : null
      },
      is_retweet: !!legacy.retweeted_status_result,
      is_reply: !!legacy.in_reply_to_status_id_str,
      is_quote: !!legacy.quoted_status_id_str
    };
  }

  async getFollowers(userId, maxResults = 100) {
    // Follower list requires auth
    console.log('Follower list not available via guest token');
    return [];
  }
}

module.exports = new TwitterService();
