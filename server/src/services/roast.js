const OpenAI = require('openai');

class RoastService {
  constructor() {
    this.client = null;
  }

  getClient() {
    if (!this.client) {
      this.client = new OpenAI({
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: 'https://openrouter.ai/api/v1'
      });
    }
    return this.client;
  }
  
  async generateRoast(analysis) {
    const { user, metrics, scores, tier, engagement, pinnedTweet } = analysis;

    // Build pinned tweet context
    let tweetContext = '';
    if (pinnedTweet) {
      tweetContext = `\n\nPINNED TWEET (what they chose to showcase):\n"${pinnedTweet.text.slice(0, 400)}"\nEngagement: ${pinnedTweet.metrics.likes} likes, ${pinnedTweet.metrics.retweets} RTs`;
    } else {
      tweetContext = '\n\nPINNED TWEET: None (no pinned tweet - not showcasing any work)';
    }

    const prompt = `You are CloutCheck -- the ultimate detector of REAL BUILDERS vs CLOUT CHASERS on Crypto Twitter.

Your ONLY job: Determine if this person is BUILDING REAL VALUE or just CHASING CLOUT.

Profile:
- Username: @${user.username}
- Name: ${user.name}
- Bio: ${user.description || 'Empty bio'}
- Followers: ${metrics.followers.toLocaleString()}
- Following: ${metrics.following.toLocaleString()}
- Tweets: ${metrics.tweets.toLocaleString()}
- Account Age: ${analysis.accountAge.formatted}
- Verified: ${user.verified ? 'Yes' : 'No'}
${tweetContext}

CLOUT CHASER red flags:
- Bio stuffed with buzzwords ("builder", "founder", "web3", "based") but no actual project links
- High tweet count but no evidence of shipping anything
- Follows way more people than follow them (desperate for validation)
- Lots of threads and takes but zero products
- Just retweets alpha and adds "this" or fire emojis
- Reply guy energy -- always in replies, never creating

REAL BUILDER green flags:
- Bio links to actual projects, github, or products they built
- Lower tweet count but focused content
- People follow THEM, they don't chase follows
- Talks about building, shows progress, ships stuff
- Has receipts -- actual work, not just talk

Give your VERDICT in 2-3 sentences:
1. State clearly: Are they BUILDING VALUE or CHASING CLOUT?
2. Explain WHY based on the evidence
3. Be direct and savage -- call them a clout goblin, engagement farmer, reply guy, thread boy, fake founder OR give them respect if they're actually building

No generic roasts. Focus ONLY on the builder vs clout question.`;

    try {
      const response = await this.getClient().chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.9
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating roast:', error);
      return "Couldn't generate a roast right now. Your profile is probably too mid to roast anyway. 🤷";
    }
  }

  async ratePfp(pfpUrl, username) {
    const prompt = `You're a witty profile picture analyst. Analyze this Twitter/X profile picture and give your honest, funny take.

Look at this profile picture and provide:
1. A rating out of 10 (be honest but fair)
2. A clever, witty commentary about what this PFP says about them (2-3 sentences, be funny and observational)
3. What vibe/energy the PFP gives off

Username: @${username}

Be playful and entertaining. Examples:
- Anime PFP: "Probably has strong opinions about subs vs dubs"
- NFT/Ape: "Either made it or lost it all, no in between"
- Professional headshot: "LinkedIn energy in a Twitter world"
- Cat/dog pic: "Their pet is more interesting than them and they know it"
- Cartoon/illustration: "Committed to the brand"

Format your response as:
Rating: X/10
Roast: [your witty take]
Vibe: [the vibe check]`;

    try {
      const response = await this.getClient().chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [
          { 
            role: 'user', 
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: pfpUrl } }
            ]
          }
        ],
        max_tokens: 200,
        temperature: 0.9
      });

      const content = response.choices[0].message.content.trim();
      
      // Parse the response
      const ratingMatch = content.match(/Rating:\s*(\d+(?:\.\d+)?)\s*\/\s*10/i);
      const roastMatch = content.match(/Roast:\s*(.+?)(?=Vibe:|$)/is);
      const vibeMatch = content.match(/Vibe:\s*(.+?)$/is);

      return {
        rating: ratingMatch ? parseFloat(ratingMatch[1]) : 5,
        roast: roastMatch ? roastMatch[1].trim() : content,
        vibe: vibeMatch ? vibeMatch[1].trim() : 'mysterious energy',
        raw: content
      };
    } catch (error) {
      console.error('Error rating PFP:', error);
      
      // Fallback if vision fails - just roast based on URL patterns
      return this.fallbackPfpRating(pfpUrl, username);
    }
  }

  fallbackPfpRating(pfpUrl, username) {
    // Basic rating without vision
    let rating = 5;
    let roast = '';
    let vibe = 'default energy';

    if (pfpUrl?.includes('default_profile')) {
      rating = 2;
      roast = `@${username} is still rocking the default egg/silhouette. Either you're a bot, too lazy to upload a pic, or you think mystery is your brand. Spoiler: it's not.`;
      vibe = 'ghost account energy';
    } else if (!pfpUrl) {
      rating = 1;
      roast = `No profile picture? @${username} is operating in witness protection mode.`;
      vibe = 'incognito mode';
    } else {
      rating = 6;
      roast = `@${username} at least bothered to upload a profile picture. That's more effort than most bots put in. Congrats on the bare minimum!`;
      vibe = 'present but unexamined';
    }

    return { rating, roast, vibe, raw: null };
  }

  async generateLore(pfpDescription) {
    const prompt = `You're a creative writer. Based on this PFP description, write a short backstory/lore for this character. Keep it to 3-4 sentences, make it epic and fun.

PFP Description: ${pfpDescription}

Write the character's lore:`;

    try {
      const response = await this.getClient().chat.completions.create({
        model: 'openai/gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 200,
        temperature: 0.8
      });

      return response.choices[0].message.content.trim();
    } catch (error) {
      console.error('Error generating lore:', error);
      return "A mysterious figure from the digital realm, their origins unknown but their presence unforgettable.";
    }
  }
}

module.exports = new RoastService();
