import { AppState } from './types';

const now = '2026-03-01T13:00:00.000Z';

export const SEED_STATE: AppState = {
  settings: {
    claudeApiKey: '',
    niche: 'Capital allocation, AI infrastructure investing, real estate, crypto — targeting young operators and aspiring capital allocators',
    targetAudience: 'Ambitious 18-30 year olds interested in real asset accumulation, AI/tech investing, crypto, and building generational wealth through unconventional paths',
    brandVoice: 'Direct, data-driven, contrarian. No fluff. Speak like an operator who has skin in the game — because you do. Mix hard numbers with philosophical takes. Think Marcus Aurelius meets a Bloomberg terminal. Use "Land and Math" as a recurring thesis anchor.',
  },
  competitors: [
    {
      id: 'comp_1',
      handle: '@sweatystartup',
      platform: 'x',
      niche: 'Blue-collar business acquisition, real estate, small business investing',
      notes: 'Nick Huber — 500K+ followers. Posts daily threads on boring businesses, self-storage, and service companies. Heavy on contrarian takes about college and traditional career paths. Strong engagement through controversial opinions.',
      topContent: [
        { description: 'Thread: "I bought a laundromat for $200K and it prints $8K/month"', engagement: '12.4K likes, 2.1K retweets', date: '2026-01' },
        { description: 'Thread: "College is the worst investment in America. Here\'s the math."', engagement: '28K likes, 5.2K retweets', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_2',
      handle: '@coabornsanchez',
      platform: 'both',
      niche: 'Buying businesses, contrarian investing, "boring" cash flow',
      notes: 'Codie Sanchez — 1M+ across platforms. Masters the "buy boring businesses" narrative. Uses TikTok for short punchy hooks and X for deep threads. Very polished production.',
      topContent: [
        { description: 'TikTok: "This vending machine route makes $4K/month passive"', engagement: '2.8M views', date: '2026-01' },
        { description: 'X Thread: "I bought a car wash. Here\'s month 6 numbers."', engagement: '18K likes', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_3',
      handle: '@moseskagan',
      platform: 'x',
      niche: 'Real estate investing, multifamily, value-add deals',
      notes: 'Moses Kagan — Deep RE operator. Posts detailed deal breakdowns with real numbers. Smaller following but extremely high-quality engaged audience of actual operators.',
      topContent: [
        { description: 'Thread: "We just closed a 14-unit in LA. Here\'s the full underwriting."', engagement: '3.2K likes, 890 retweets', date: '2026-01' },
        { description: 'Post: "The only 3 metrics that matter in multifamily"', engagement: '5.1K likes', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_4',
      handle: '@ahormozi',
      platform: 'both',
      niche: 'Business scaling, offers, lead generation, entrepreneurship',
      notes: 'Alex Hormozi — 5M+ across platforms. King of "value-first" content. Every post teaches something specific. His TikTok strategy of gym-background talking-head videos redefined the format for business creators.',
      topContent: [
        { description: 'TikTok: "The $100M framework for pricing your offer"', engagement: '8.4M views', date: '2026-02' },
        { description: 'X Thread: "I spent $0 on ads and made $4.2M last month. Here\'s the playbook."', engagement: '42K likes, 8.9K retweets', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_5',
      handle: '@balabornsaji',
      platform: 'x',
      niche: 'Tech futurism, network states, crypto, AI macro',
      notes: 'Balaji Srinivasan — Former a16z partner, Coinbase CTO. Posts long-form macro takes on AI, crypto, and geopolitics. Very high IQ content that resonates with tech-savvy audiences.',
      topContent: [
        { description: 'Thread: "The AI economy will create 3 classes of people"', engagement: '15K likes, 4.2K retweets', date: '2026-01' },
        { description: 'Post: "Land is the only non-replicable asset in an AI world"', engagement: '8.7K likes', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_6',
      handle: '@APompliano',
      platform: 'both',
      niche: 'Bitcoin, macro economics, investing, entrepreneurship',
      notes: 'Anthony "Pomp" Pompliano — 1.5M+ followers. Bridges traditional finance and crypto world. Daily newsletter, podcast, and social content. Very consistent posting cadence.',
      topContent: [
        { description: 'TikTok: "Why Bitcoin hits $200K this cycle — the math"', engagement: '3.1M views', date: '2026-02' },
        { description: 'X Thread: "The Fed just broke something. Here\'s what happens next."', engagement: '22K likes, 5.8K retweets', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_7',
      handle: '@wolfofbitcoins',
      platform: 'tiktok',
      niche: 'Crypto trading, lifestyle, young wealth',
      notes: 'Wolf of Bitcoins — TikTok-native crypto creator. Appeals to younger demo with lifestyle + education mix. Fast cuts, Dubai/luxury backdrops. Good format study for TikTok strategy.',
      topContent: [
        { description: '"I turned $500 into $50K in 30 days — here\'s how"', engagement: '5.2M views', date: '2026-01' },
        { description: '"Day in my life as a 22yo crypto trader in Dubai"', engagement: '3.8M views', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
    {
      id: 'comp_8',
      handle: '@MrFamilyOffice',
      platform: 'tiktok',
      niche: 'Family office investing, generational wealth, alternative assets',
      notes: 'MrFamilyOffice — Niche TikTok creator focused on ultra-HNW strategies. Explains family office concepts in accessible way. Good positioning study — differentiate by being the young operator actually building one.',
      topContent: [
        { description: '"What is a family office and why do billionaires use them?"', engagement: '2.1M views', date: '2026-01' },
        { description: '"3 assets every family office holds that you don\'t"', engagement: '1.7M views', date: '2026-02' },
      ],
      analysis: '',
      addedAt: now,
    },
  ],
  research: [
    {
      id: 'res_1',
      topic: 'Content positioning gaps: Young capital allocator vs existing finance creators',
      platform: 'both',
      result: `## Gap Analysis: Leonardo Demetriou vs. Existing Finance Creators

### Gap 1: The Young Operator With Real Numbers
Most finance creators on X and TikTok either (a) are 35+ sharing retrospective wisdom, or (b) are young creators faking results. A genuine 20-year-old who turned $200 into $1M with receipts is unique. Nobody in this space is documenting the real-time journey of a young capital allocator with verifiable positions.

- **Content Opportunity:** "Portfolio Transparency" series — monthly breakdowns of actual positions, entries, exits, and P&L. This builds unmatched trust.

### Gap 2: Physical Assets + Digital Assets Convergence
Almost zero creators bridge the gap between crypto/AI investing AND physical real estate/land. Balaji talks about land theoretically. Moses Kagan does RE operationally. Pomp does crypto. Nobody combines all three as a unified thesis.

- **Content Opportunity:** "Land and Math" thesis content — why only land and computation survive the AI era. Position as the ONLY creator operating across both worlds simultaneously.

### Gap 3: Cyprus/Mediterranean Real Estate
Zero English-language TikTok or X creators covering Cyprus real estate investing, especially from a young operator perspective. The Mediterranean property market is massive and completely underserved in content.

- **Content Opportunity:** Build-log content from the Cyprus compound. Drone footage, deal breakdowns, self-sustaining property design. This is blue ocean content.

### Gap 4: Family Portfolio Management at Scale
Codie and Nick talk about buying small businesses. Nobody talks about managing a multi-million family RE portfolio and the systems/tech (Kronos) needed to do it. This is aspirational AND educational.

- **Content Opportunity:** "Running a Multi-Million Portfolio at 20" — systems, tools, decisions, delegation. Show the operator side that nobody else can.

### Gap 5: AI-First Capital Allocation
Hormozi talks about business. Balaji talks about AI macro. Nobody is showing how to actually USE AI tools for capital allocation decisions in real-time — running Monte Carlo simulations, building custom analysis tools, using Claude/GPT for deal evaluation.

- **Content Opportunity:** Screen-share content showing real AI-assisted investment analysis. "I used AI to analyze 50 RE deals in 10 minutes — here's what it found."`,
      createdAt: '2026-03-01T12:00:00.000Z',
    },
    {
      id: 'res_2',
      topic: 'Trending content formats and strategies for finance/investing creators March 2026',
      platform: 'both',
      result: `## Trending Content Formats — March 2026

### TikTok Trends
- **"Day in My Life" operator editions** — Performing well for finance creators who show real work, not just lifestyle. The key is mixing luxury with grind (e.g., boxing at 5AM then portfolio review at 7AM).
- **Split-screen reaction/breakdown** — Reacting to other creators' financial takes with your own numbers/data. High engagement format.
- **"Things I'd tell my 18-year-old self"** — Evergreen format, but works best when specific and contrarian.
- **3-part mini-series** — TikTok algorithm heavily favors creators who post series. "Part 1/3: How I allocate $1.2M at 20" drives follows.
- **Screen recording walkthroughs** — Showing your actual portfolio, spreadsheets, or AI tools in action. Authenticity signal.

### X / Twitter Trends
- **"Unpopular opinion" threads** — Contrarian takes with data to back them up. High reply/retweet ratio.
- **Single-chart tweets** — One powerful chart + one sentence take. These get massive organic reach.
- **"Here's what I learned" reflections** — Monthly/quarterly reflection posts summarizing wins, losses, and lessons.
- **Build-in-public updates** — The Kronos development journey shared transparently. Tech + finance crossover audience.
- **Long-form threads with numbered frameworks** — "7 rules I follow for every land deal" — structured, actionable, save-worthy.

### Hashtag Strategy
**TikTok:** #investing #realestate #crypto #wealthbuilding #financialfreedom #dayinmylife #youngentrepreneur #dubai #ai #portfolio

**X:** No hashtags — focus on strong hooks and quote-tweet engagement. The algo rewards replies and conversations.

### Algorithm Tips
- **TikTok:** Post 1-2x daily, optimal times 7-9AM and 6-8PM GST. First 3 seconds determine everything — lead with the most shocking number or claim.
- **X:** Post 3-5x daily minimum. Engage in replies for 30 min after each post. Quote-tweet competitors' takes with your own angle. Thread length sweet spot is 5-8 tweets.

### Content Gaps to Exploit
- Nobody doing "AI + Real Estate" crossover content
- Zero young creators showing real family office operations
- Mediterranean/Cyprus real estate content in English is completely empty
- "Land and Math" as a branded thesis is ownable
- The intersection of physical assets + crypto + AI is wide open`,
      createdAt: '2026-03-01T12:30:00.000Z',
    },
  ],
  cards: [
    {
      id: 'card_01', title: '$200 to $1M: The Full Playbook', description: 'Complete breakdown of the crypto journey — entries, exits, psychology, risk management. The anchor content piece.',
      platform: 'both', contentType: 'thread', priority: 'high', stage: 'draft', notes: 'Film B-roll of trading setup. Brother to edit. Lead with the $200 starting screenshot.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_02', title: 'The Land and Math Thesis', description: 'Core philosophical content: only two real assets survive the AI era — land (finite, physical) and math (computation, AI). Everything else gets compressed.',
      platform: 'x', contentType: 'thread', priority: 'high', stage: 'idea', notes: 'This becomes the branded thesis. Reference Balaji on land scarcity + AI acceleration.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_03', title: 'Why I Own 30 Acres in Cyprus at 20', description: 'TikTok story format — show the land, explain the vision for the self-sustaining compound, reveal the long-term play.',
      platform: 'tiktok', contentType: 'script', priority: 'high', stage: 'idea', notes: 'Need drone footage of the plots. Brother films on next Cyprus trip. Hook: "I bought 30 acres in the Mediterranean at 20. Here\'s why."',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_04', title: 'My $1.2M Portfolio Breakdown — March 2026', description: 'Full transparency post showing current allocations: NVDA, TSM, ASML, BTC, land. Monthly series.',
      platform: 'both', contentType: 'thread', priority: 'high', stage: 'research', notes: 'Screenshot actual portfolio. Blur account numbers. Show % allocations and thesis for each position.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_05', title: 'I Built an AI to Manage Our Family Property Portfolio', description: 'Kronos reveal — what it does, why it exists, the problem it solves for multi-property families.',
      platform: 'both', contentType: 'concept', priority: 'high', stage: 'idea', notes: 'Screen recording of Kronos dashboard. Build-in-public angle. Don\'t reveal too much — tease the product.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_06', title: '5 Things I\'d Tell My 18-Year-Old Self About Money', description: 'Evergreen TikTok format with specific contrarian lessons. Short, punchy, personal.',
      platform: 'tiktok', contentType: 'script', priority: 'medium', stage: 'draft', notes: 'Film in Dubai apartment. Casual setup. 1. Skip uni 2. Buy BTC not shoes 3. Land > stocks long-term 4. Build tools, don\'t just trade 5. Your family portfolio is your MBA',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_07', title: 'The AI Infrastructure Bet: NVDA, TSM, ASML', description: 'Thread explaining the "picks and shovels" thesis for AI investing — why semiconductor infrastructure is the safest AI play.',
      platform: 'x', contentType: 'thread', priority: 'medium', stage: 'idea', notes: 'Include actual position sizes and entry points. Reference supply chain data and earnings.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_08', title: 'Day in My Life: 20-Year-Old Capital Allocator in Dubai', description: 'Lifestyle + operator mix. Boxing at dawn, portfolio review, family calls, Kronos dev, content creation.',
      platform: 'tiktok', contentType: 'script', priority: 'medium', stage: 'idea', notes: 'Film over 2-3 days, best moments compiled. Show the discipline, not just the lifestyle. Brother handles all filming/editing.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_09', title: 'Bitcoin vs. Real Estate: I Own Both — Here\'s the Math', description: 'Comparison content that bridges both audiences. Show actual returns, volatility, time horizons from personal portfolio.',
      platform: 'both', contentType: 'thread', priority: 'medium', stage: 'idea', notes: 'Use real numbers from portfolio. BTC entry vs Cyprus land entry. Make the case for owning both.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_10', title: 'How We Manage a Multi-Million UK Property Portfolio', description: 'Behind-the-scenes of family RE operations. Systems, delegation, common mistakes, what software we use (leading into Kronos).',
      platform: 'x', contentType: 'thread', priority: 'high', stage: 'idea', notes: 'Sensitive content — clear with family first. Focus on systems/processes not specific properties.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_11', title: 'React to: "You Need $1M to Start Investing in Real Estate"', description: 'Split-screen TikTok reacting to a popular RE myth. Counter with Cyprus land deals.',
      platform: 'tiktok', contentType: 'script', priority: 'low', stage: 'idea', notes: 'Find the right clip to react to. Keep it respectful but firm with counter-data.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_12', title: 'The Operator\'s Terminal — What I\'m Building', description: 'Brand positioning content. Introduce the "Operator\'s Terminal" concept — the intersection of capital, technology, and land.',
      platform: 'x', contentType: 'post', priority: 'high', stage: 'idea', notes: 'This is the brand anchor post. Pin to profile. Should feel like a manifesto.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_13', title: 'Why I\'m Betting on Physical Land in the AI Era', description: 'Contrarian take: everyone is going digital, but physical land becomes MORE valuable as AI commoditizes everything else.',
      platform: 'both', contentType: 'thread', priority: 'medium', stage: 'idea', notes: 'Tie back to Land and Math thesis. Use Cyprus compound as proof point.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_14', title: '3 Stocks I\'m Holding Through the AI Bubble', description: 'Quick TikTok format. Show the 3 semiconductor positions and why they survive regardless of which AI company wins.',
      platform: 'tiktok', contentType: 'script', priority: 'medium', stage: 'idea', notes: 'Keep it under 60 seconds. Use graphics/overlays for stock tickers and key numbers.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_15', title: 'Building a Self-Sustaining Compound: Month 1', description: 'Start of a long-running series documenting the Cyprus compound build. Solar, water, agriculture, living quarters.',
      platform: 'tiktok', contentType: 'concept', priority: 'medium', stage: 'research', notes: 'Need to plan what to film on next Cyprus visit. This becomes a recurring series — the ultimate build-in-public content.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_16', title: 'The Monte Carlo Method: How I Model Every Investment', description: 'Educational content showing how to use probability-based thinking for investment decisions. Screen-share format.',
      platform: 'x', contentType: 'thread', priority: 'low', stage: 'idea', notes: 'Record screen of actual Monte Carlo simulation. Can use Python/spreadsheet. Show how AI accelerates this.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_17', title: 'I Analyze 50 Properties in 10 Minutes Using AI', description: 'Demo content showing AI-powered RE analysis. Hook-driven TikTok showing the speed and power of AI tools for deal flow.',
      platform: 'tiktok', contentType: 'script', priority: 'medium', stage: 'idea', notes: 'Screen record using Claude or custom tool. Fast cuts. Show input -> output in real-time.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_18', title: 'Unpopular Opinion: University Is a Liability, Not an Asset', description: 'Contrarian thread with personal story and data. Chose to skip uni and allocate capital instead.',
      platform: 'x', contentType: 'thread', priority: 'low', stage: 'idea', notes: 'Be respectful but data-driven. Show opportunity cost math. This will generate engagement through disagreement.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_19', title: 'Weekly Market Briefing — The Operator\'s View', description: 'Recurring weekly content: macro take, portfolio moves, market observations. Short, dense, actionable.',
      platform: 'x', contentType: 'post', priority: 'medium', stage: 'idea', notes: 'Template this. Every Sunday evening. 5-7 bullet points max. Becomes a "must-read" ritual for followers.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_20', title: 'What Boxing Teaches You About Risk Management', description: 'Bridge lifestyle and investing. Boxing 5x/week parallels — reading opponents (markets), managing energy (capital), taking calculated shots.',
      platform: 'tiktok', contentType: 'script', priority: 'low', stage: 'idea', notes: 'Film in the gym. Intercut boxing footage with market charts/portfolio shots. Metaphor-driven.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_21', title: 'How to Evaluate a Land Deal in 5 Minutes', description: 'Educational quick-format content. Framework for evaluating raw land: location, zoning, utilities, comparable sales, development potential.',
      platform: 'both', contentType: 'concept', priority: 'medium', stage: 'idea', notes: 'Use Cyprus examples. Simple checklist format. Actionable for audience who wants to start buying land.',
      createdAt: now, updatedAt: now,
    },
    {
      id: 'card_22', title: 'My Brother and I Built a Content Studio — Here\'s Our Setup', description: 'Behind-the-scenes of the content operation. Equipment, workflow, who does what. Humanizes the brand and builds connection.',
      platform: 'tiktok', contentType: 'script', priority: 'low', stage: 'idea', notes: 'Film the studio/workspace. Show the process. Brother co-stars. Light, fun tone compared to usual finance content.',
      createdAt: now, updatedAt: now,
    },
  ],
  brain: [
    { id: 'brain_01', category: 'identity', title: 'Background', content: '20 years old, based in Dubai. Turned $200 into $1M in crypto at 19 (2024) with no leverage. Currently managing a ~$1.2M liquid portfolio focused on AI infrastructure (NVDA, TSM, ASML) + BTC.', createdAt: now, updatedAt: now },
    { id: 'brain_02', category: 'identity', title: 'Real Estate', content: '22 plots / 30+ acres of land in Cyprus — building a self-sustaining compound. Family has a multi-million GBP UK real estate portfolio across multiple properties.', createdAt: now, updatedAt: now },
    { id: 'brain_03', category: 'identity', title: 'Building', content: 'Building "Kronos" — an AI-powered real estate portfolio management SaaS. Brother handles video production for content. Positioning as "The Operator\'s Terminal."', createdAt: now, updatedAt: now },
    { id: 'brain_04', category: 'identity', title: 'Core Thesis', content: '"Land and Math" — only two real assets survive the AI era: physical land (finite, non-replicable) and computation/math (AI, software). Everything else gets compressed.', createdAt: now, updatedAt: now },
    { id: 'brain_05', category: 'identity', title: 'Lifestyle', content: 'Boxing 5x/week at dawn. Disciplined daily routine: train, portfolio review, build, create content. No university — chose capital allocation over traditional education.', createdAt: now, updatedAt: now },
    { id: 'brain_06', category: 'content_dna', title: 'Best Formats', content: 'Data-backed threads with real portfolio numbers perform best on X. Day-in-my-life and "how I did X at age Y" formats work best on TikTok. Contrarian takes generate the most engagement.', createdAt: now, updatedAt: now },
    { id: 'brain_07', category: 'content_dna', title: 'Content Pillars', content: '1) Portfolio transparency & allocation breakdowns 2) Cyprus land/compound build logs 3) AI infrastructure investing thesis 4) Contrarian takes on education/career 5) Operator lifestyle (boxing, discipline, Dubai)', createdAt: now, updatedAt: now },
    { id: 'brain_08', category: 'content_dna', title: 'Voice Rules', content: 'Never be preachy. Lead with numbers, not opinions. Be the youngest person in the room who has done the thing. No flexing without teaching. Marcus Aurelius tone meets Bloomberg data.', createdAt: now, updatedAt: now },
    { id: 'brain_09', category: 'audience', title: 'Core Audience', content: 'Ambitious 18-30 year olds who want to build wealth unconventionally. They\'re skeptical of traditional paths (university, 9-5) and hungry for real operator knowledge with receipts.', createdAt: now, updatedAt: now },
    { id: 'brain_10', category: 'audience', title: 'What Resonates', content: 'Real numbers and transparency. The audience responds strongest to actual portfolio screenshots, deal breakdowns with math, and contrarian takes backed by personal experience. They hate vague "hustle" content.', createdAt: now, updatedAt: now },
    { id: 'brain_11', category: 'lessons', title: 'Hook Lesson', content: 'The most engaging hooks start with a specific number or age. "$200 to $1M" outperforms "How I made money in crypto." Always lead with the most shocking data point.', createdAt: now, updatedAt: now },
    { id: 'brain_12', category: 'lessons', title: 'Platform Lesson', content: 'X rewards consistency and thread depth — post 3-5x daily, engage in replies. TikTok rewards pattern interrupts in first 3 seconds and series content (Part 1/3 drives follows).', createdAt: now, updatedAt: now },
    { id: 'brain_13', category: 'goals', title: '30-Day Goal', content: 'Launch content presence on both TikTok and X. Post first 10 pieces of content. Establish the "Land and Math" thesis as the core brand narrative.', createdAt: now, updatedAt: now },
    { id: 'brain_14', category: 'goals', title: '90-Day Goal', content: 'Reach 10K followers on X, 50K on TikTok. Have 3 viral pieces (100K+ views). Establish weekly posting cadence: 5x/day X, 1-2x/day TikTok. Start Kronos build-in-public series.', createdAt: now, updatedAt: now },
  ],
  chat: [],
};
