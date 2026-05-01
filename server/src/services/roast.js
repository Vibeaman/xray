const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

class RoastService {
  
  async generateRoast(analysis) {
    const { user, metrics, scores, tier, engagement } = analysis;

    const prompt = `You're a witty comedian roasting someone's Twitter/X profile. Be funny but not mean-spirited. Keep it to 2-3 sentences max.

Profile:
- Username: @${user.username}
- Name: ${user.name}
- Bio: ${user.description || 'No bio'}
- Followers: ${metrics.followers.toLocaleString()}
- Following: ${metrics.following.toLocaleString()}
- Tweets: ${metrics.tweets.toLocaleString()}
- Quality Tier: ${tier}
- Engagement Rate: ${engagement.rate}%
- Account Age: ${analysis.accountAge.formatted}
- Verified: ${user.verified ? 'Yes' : 'No'}

Generate a funny roast about this profile. Reference specific stats if they're funny (like if following > followers, or low engagement, or too many tweets, etc).`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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

  async generateLore(pfpDescription) {
    const prompt = `You're a creative writer. Based on this PFP description, write a short backstory/lore for this character. Keep it to 3-4 sentences, make it epic and fun.

PFP Description: ${pfpDescription}

Write the character's lore:`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
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
