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
    const { user, metrics, scores, tier, engagement } = analysis;

    const prompt = `You're CloutCheck's BRUTAL analyst. Your job is to determine if this person is ACTUALLY BUILDING something real or just CHASING CLOUT on Crypto Twitter (CT). Be savage, toxic, and ruthless. No mercy.

Profile:
- Username: @${user.username}
- Name: ${user.name}
- Bio: ${user.description || 'No bio (too boring to even describe themselves)'}
- Followers: ${metrics.followers.toLocaleString()}
- Following: ${metrics.following.toLocaleString()}
- Tweets: ${metrics.tweets.toLocaleString()}  
- Quality Tier: ${tier}
- Engagement Rate: ${engagement.rate}%
- Account Age: ${analysis.accountAge.formatted}
- Verified: ${user.verified ? 'Yes (paid for it lmao)' : 'No (cant even afford $8)'}

Analyze if they're a REAL BUILDER or a CLOUT CHASER:
- Too many tweets with low engagement = desperate clout farmer
- Following way more than followers = validation seeker
- Bio full of buzzwords (web3, builder, founder, etc) but no actual project links = fake builder
- High tweet count but low quality = posting for the algorithm
- Actually ships products/code = real builder

Give your BRUTAL verdict: Are they building or just chasing clout on CT? Keep it to 2-3 savage sentences. Call them out specifically - clout goblin, engagement farmer, reply guy, fake founder, or actually legit.`;

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
    const prompt = `You're a SAVAGE roast judge with ZERO chill. Rate this Twitter/X profile picture and absolutely DESTROY them.

Look at this profile picture and give:
1. A rating out of 10 (be harsh)
2. A BRUTAL roast about the PFP (2-3 sentences of pure destruction)
3. What vibe/energy the PFP gives off (be toxic about it)

Username: @${username}
PFP URL: ${pfpUrl}

No mercy. Anime pfp? Roast them for being maidenless. NFT? They're broke now. Default egg? They don't exist. Professional headshot? LinkedIn reject. Cat/dog pic? Too scared to show their face. GO OFF.

Format your response as:
Rating: X/10
Roast: [your brutal roast]
Vibe: [the toxic vibe check]`;

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
