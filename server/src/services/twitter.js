const axios = require('axios');

class TwitterService {
  constructor() {
    // Using nitter instances or direct scraping as fallback
    this.nitterInstances = [
      'https://nitter.privacydev.net',
      'https://nitter.poast.org',
      'https://nitter.mint.lgbt',
      'https://nitter.cz'
    ];
    this.currentInstance = 0;
  }

  async getUser(username) {
    console.log('Fetching user via scraping:', username);
    
    // Try nitter first (cleaner HTML to parse)
    for (let i = 0; i < this.nitterInstances.length; i++) {
      try {
        const instance = this.nitterInstances[(this.currentInstance + i) % this.nitterInstances.length];
        const data = await this.scrapeNitter(username, instance);
        if (data) {
          this.currentInstance = (this.currentInstance + i) % this.nitterInstances.length;
          return data;
        }
      } catch (error) {
        console.log(`Nitter instance failed: ${this.nitterInstances[i]}`, error.message);
        continue;
      }
    }

    // Fallback: try syndication API (public, no auth needed)
    try {
      const data = await this.scrapeSyndication(username);
      if (data) return data;
    } catch (error) {
      console.log('Syndication fallback failed:', error.message);
    }

    throw new Error('Could not fetch user data from any source');
  }

  async scrapeNitter(username, instance) {
    const url = `${instance}/${username}`;
    console.log('Trying nitter:', url);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });

    const html = response.data;

    // Check if user exists
    if (html.includes('User not found') || html.includes('does not exist') || response.status === 404) {
      throw new Error('User not found');
    }

    // Parse profile data from HTML
    const user = this.parseNitterHTML(html, username);
    return user;
  }

  parseNitterHTML(html, username) {
    // Extract profile data using regex (nitter has consistent HTML structure)
    
    // Name
    const nameMatch = html.match(/<a class="profile-card-fullname"[^>]*>([^<]+)<\/a>/);
    const name = nameMatch ? this.decodeHTML(nameMatch[1].trim()) : username;

    // Bio/Description
    const bioMatch = html.match(/<div class="profile-bio"[^>]*>([\s\S]*?)<\/div>/);
    let description = '';
    if (bioMatch) {
      description = bioMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
      description = this.decodeHTML(description);
    }

    // Profile image
    const imgMatch = html.match(/<a class="profile-card-avatar"[^>]*href="([^"]+)"/);
    let profileImage = imgMatch ? imgMatch[1] : null;
    if (profileImage && !profileImage.startsWith('http')) {
      profileImage = null; // Skip relative URLs
    }

    // Stats - followers, following, tweets
    const statsMatch = html.match(/<ul class="profile-statlist">([\s\S]*?)<\/ul>/);
    let followers = 0, following = 0, tweets = 0, likes = 0;

    if (statsMatch) {
      const statsHtml = statsMatch[1];
      
      const tweetsMatch = statsHtml.match(/class="posts-stat"[^>]*>[\s\S]*?class="profile-stat-num"[^>]*>([^<]+)/);
      const followingMatch = statsHtml.match(/class="following-stat"[^>]*>[\s\S]*?class="profile-stat-num"[^>]*>([^<]+)/);
      const followersMatch = statsHtml.match(/class="followers-stat"[^>]*>[\s\S]*?class="profile-stat-num"[^>]*>([^<]+)/);
      const likesMatch = statsHtml.match(/class="likes-stat"[^>]*>[\s\S]*?class="profile-stat-num"[^>]*>([^<]+)/);

      tweets = tweetsMatch ? this.parseNumber(tweetsMatch[1]) : 0;
      following = followingMatch ? this.parseNumber(followingMatch[1]) : 0;
      followers = followersMatch ? this.parseNumber(followersMatch[1]) : 0;
      likes = likesMatch ? this.parseNumber(likesMatch[1]) : 0;
    }

    // Join date
    const joinMatch = html.match(/Joined\s*<\/span>\s*<span[^>]*>([^<]+)/i);
    const joinedRaw = joinMatch ? joinMatch[1].trim() : null;
    const createdAt = joinedRaw ? this.parseJoinDate(joinedRaw) : new Date('2020-01-01').toISOString();

    // Verified status (blue check)
    const verified = html.includes('icon-verified') || html.includes('verified-icon');

    // Location
    const locationMatch = html.match(/<span class="profile-location"[^>]*>[\s\S]*?<span>([^<]+)<\/span>/);
    const location = locationMatch ? this.decodeHTML(locationMatch[1].trim()) : null;

    return {
      id: username, // We don't have the real ID from scraping
      username: username,
      name: name,
      description: description,
      profile_image_url: profileImage,
      verified: verified,
      verified_type: verified ? 'blue' : null,
      created_at: createdAt,
      location: location,
      public_metrics: {
        followers_count: followers,
        following_count: following,
        tweet_count: tweets,
        listed_count: Math.floor(followers / 100), // Estimate
        like_count: likes
      }
    };
  }

  async scrapeSyndication(username) {
    // Twitter's syndication endpoint (used for embeds, often works without auth)
    const url = `https://syndication.twitter.com/srv/timeline-profile/screen-name/${username}`;
    
    console.log('Trying syndication:', url);

    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml'
      }
    });

    // Parse the embedded data
    const html = response.data;
    
    // Look for __NEXT_DATA__ or similar JSON blob
    const dataMatch = html.match(/<script id="__NEXT_DATA__"[^>]*>([^<]+)<\/script>/);
    if (dataMatch) {
      try {
        const data = JSON.parse(dataMatch[1]);
        // Extract user info from the data structure
        // This varies based on Twitter's current implementation
        return this.parseSyndicationData(data, username);
      } catch (e) {
        console.log('Failed to parse syndication data:', e.message);
      }
    }

    return null;
  }

  parseSyndicationData(data, username) {
    // Navigate the nested structure to find user data
    // This is a simplified version - actual structure may vary
    try {
      const props = data.props?.pageProps;
      if (props?.timeline?.entries) {
        // Try to extract from timeline
      }
    } catch (e) {
      console.log('Syndication parse error:', e.message);
    }
    return null;
  }

  parseNumber(str) {
    if (!str) return 0;
    str = str.trim().replace(/,/g, '');
    
    const multipliers = { 'K': 1000, 'M': 1000000, 'B': 1000000000 };
    const match = str.match(/^([\d.]+)\s*([KMB])?$/i);
    
    if (match) {
      const num = parseFloat(match[1]);
      const mult = match[2] ? multipliers[match[2].toUpperCase()] : 1;
      return Math.round(num * mult);
    }
    
    return parseInt(str) || 0;
  }

  parseJoinDate(dateStr) {
    // Parse "January 2020" or "Jan 2020" format
    try {
      const date = new Date(dateStr + ' 1'); // Add day
      if (!isNaN(date.getTime())) {
        return date.toISOString();
      }
    } catch (e) {}
    return new Date('2020-01-01').toISOString();
  }

  decodeHTML(html) {
    return html
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, ' ');
  }

  async getUserTweets(userId, maxResults = 50) {
    // For scraping, we'd need to fetch the profile page and parse tweets
    // Returning empty for now - can implement later
    console.log('Tweet fetching not implemented for scraping yet');
    return [];
  }

  async getFollowers(userId, maxResults = 100) {
    // Follower list scraping is complex and rate-limited
    // Returning empty for now
    console.log('Follower fetching not implemented for scraping');
    return [];
  }
}

module.exports = new TwitterService();
