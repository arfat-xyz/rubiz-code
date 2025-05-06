import { SingleConversationProps, tabProps } from "./interface";

export const tabsArr: tabProps[] = [
  {
    name: "Upload",
    value: "upload",
  },
  {
    name: "Chat",
    value: "chat",
  },
];
export const defaultConversations: SingleConversationProps[] = [
  {
    user: "human",
    query: "hi",
  },
  {
    user: "assistant",
    query: `Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quos impedit
    laboriosam rem incidunt quis amet molestiae vero ratione repudiandae fuga
    maiores neque ab eos consequatur vitae, molestias, eligendi nihil aperiam.`,
  },
  {
    user: "human",
    query: "What's the weather like today?",
  },
  {
    user: "assistant",
    query: `The weather today is partly cloudy with a high of 72°F (22°C) and a low of 58°F (14°C). There's a 20% chance of light rain in the afternoon, so you might want to carry an umbrella just in case. Winds will be coming from the southwest at about 8-12 mph. Overall, it should be a pleasant day for outdoor activities if you catch the sunny intervals between clouds.`,
  },
  {
    user: "human",
    query: "Can you recommend some good books to read?",
  },
  {
    user: "assistant",
    query: `Certainly! Here are some excellent books across different genres:
1. "Project Hail Mary" by Andy Weir - A gripping sci-fi adventure about a lone astronaut saving humanity.
2. "Educated" by Tara Westover - A powerful memoir about self-education and breaking free.
3. "The Midnight Library" by Matt Haig - A thought-provoking novel about life's choices.
4. "Atomic Habits" by James Clear - A practical guide to building good habits.
5. "Klara and the Sun" by Kazuo Ishiguro - A beautiful exploration of AI and humanity.
6. "The Song of Achilles" by Madeline Miller - A stunning retelling of Greek mythology.
7. "Dune" by Frank Herbert - The classic sci-fi epic that inspired the recent movie.
Would you like recommendations for a specific genre or topic?`,
  },
  {
    user: "human",
    query: "How do I make a perfect omelette?",
  },
  {
    user: "assistant",
    query: `Making the perfect omelette requires attention to technique:
1. Use 2-3 fresh eggs and whisk them thoroughly with a pinch of salt.
2. Heat an 8-inch non-stick pan over medium heat with 1 tbsp butter.
3. When butter foams but doesn't brown, pour in eggs.
4. Let sit for 10 seconds, then stir gently with a rubber spatula.
5. When eggs begin to set (about 30 seconds), stop stirring.
6. Tilt pan and use spatula to fold omelette in half.
7. Cook another 10 seconds, then slide onto plate.
Key tips: Don't overbeat eggs, keep heat moderate, and don't overcook - the inside should remain slightly creamy. You can add fillings like cheese, herbs, or sautéed vegetables just before folding.`,
  },
  {
    user: "human",
    query: "Explain quantum computing in simple terms",
  },
  {
    user: "assistant",
    query: `Quantum computing is a type of computing that uses quantum mechanics to process information differently from regular computers. While classical computers use bits (0s and 1s), quantum computers use quantum bits or "qubits" that can be 0, 1, or both at the same time (called superposition). This allows quantum computers to perform many calculations simultaneously. Another key concept is "entanglement" where qubits become interconnected, so changing one affects its partner instantly, no matter how far apart they are. These properties could let quantum computers solve certain complex problems much faster, like simulating molecules for drug discovery or optimizing large systems. However, they're extremely sensitive to interference and currently only work in specialized lab conditions. They won't replace regular computers but may excel at specific tasks.`,
  },
  {
    user: "human",
    query: "What are some tips for improving productivity?",
  },
  {
    user: "assistant",
    query: `Here are 10 research-backed productivity tips:
1. Prioritize tasks using the Eisenhower Matrix (urgent/important)
2. Work in focused 25-50 minute blocks with short breaks (Pomodoro technique)
3. Eliminate distractions by turning off notifications
4. Start with your most challenging task first (eat the frog)
5. Maintain a clean, organized workspace
6. Get adequate sleep (7-9 hours) for optimal cognitive function
7. Stay hydrated and take short movement breaks
8. Batch similar tasks together to maintain focus
9. Learn to say no to non-essential commitments
10. Reflect weekly on what worked and adjust accordingly
Additionally, understanding your personal circadian rhythm can help - some people work best in mornings while others are night owls. The key is consistency and finding what works for your specific brain chemistry and work style.`,
  },
  {
    user: "human",
    query: "Tell me about the history of the internet",
  },
  {
    user: "assistant",
    query: `The internet's development spans several decades:
1960s: ARPANET, funded by the U.S. Department of Defense, becomes the first network to use packet switching (1969).
1970s: TCP/IP protocols are developed, forming the basis of internet communication. Email emerges as an early application.
1980s: DNS (Domain Name System) is created, allowing familiar web addresses. NSFNET connects universities.
1989: Tim Berners-Lee proposes the World Wide Web at CERN, introducing HTML, URLs, and HTTP.
1990s: The web becomes publicly available (1991). Browsers like Mosaic and Netscape popularize the internet. Commercial restrictions are lifted (1995), leading to rapid growth.
2000s: Broadband replaces dial-up. Web 2.0 enables user-generated content (social media, wikis). Mobile internet emerges.
2010s: Cloud computing, streaming, and smartphones dominate. Internet of Things (IoT) connects devices.
Today: Over 5 billion users globally. Ongoing developments include Web3 concepts, faster 5G/6G networks, and AI integration. The internet continues evolving while facing challenges around privacy, security, and digital divides.`,
  },
  {
    user: "human",
    query: "What are the health benefits of regular exercise?",
  },
  {
    user: "assistant",
    query: `Regular exercise provides comprehensive health benefits across multiple systems:
Physical Health:
- Strengthens cardiovascular system, reducing heart disease risk by 30-40%
- Lowers blood pressure and improves cholesterol levels
- Enhances muscle mass and bone density (preventing osteoporosis)
- Boosts immune function and reduces inflammation
- Helps regulate blood sugar, decreasing type 2 diabetes risk
- Aids in weight management by increasing metabolism

Mental Health:
- Releases endorphins that reduce stress and anxiety
- Can be as effective as antidepressants for mild-moderate depression
- Improves sleep quality and duration
- Enhances cognitive function and may delay dementia onset
- Increases self-esteem and body image

Longevity:
- Adds 3-7 years to life expectancy
- Reduces mortality from all causes by 30%
- Maintains mobility and independence in older adults

The WHO recommends 150+ minutes of moderate exercise weekly, but any activity is beneficial. Consistency matters more than intensity.`,
  },
  {
    user: "human",
    query: "How do I start learning programming?",
  },
  {
    user: "assistant",
    query: `Beginning your programming journey can be exciting! Here's a step-by-step approach:

1. Choose a beginner-friendly language:
   - Python: Great for beginners, versatile applications
   - JavaScript: Essential for web development
   - Scratch: Visual programming for absolute beginners

2. Set up your environment:
   - Install a code editor (VS Code, Sublime Text)
   - Learn basic terminal/command line usage

3. Learning resources:
   - Free platforms: freeCodeCamp, Codecademy, Khan Academy
   - Interactive tutorials: Grasshopper, CodeCombat
   - Video courses: Udemy, Coursera

4. Core concepts to master:
   - Variables, data types, operators
   - Control structures (loops, conditionals)
   - Functions and basic algorithms
   - Debugging techniques

5. Practice regularly:
   - Start with small projects (calculator, to-do list)
   - Solve coding challenges (LeetCode Easy, Codewars)
   - Contribute to open source (beginner-friendly issues)

6. Join communities:
   - Stack Overflow for questions
   - GitHub to explore code
   - Local meetups or hackathons

Remember, programming is about problem-solving - focus on concepts rather than syntax. Be patient; even experienced developers constantly learn new things.`,
  },
  {
    user: "human",
    query: "What's the difference between AI and machine learning?",
  },
  {
    user: "assistant",
    query: `Artificial Intelligence (AI) and Machine Learning (ML) are related but distinct concepts:

Artificial Intelligence (AI):
- Broad field of computer science focused on creating systems that can perform tasks requiring human-like intelligence
- Includes reasoning, problem-solving, perception, learning, and language understanding
- Can be rule-based (explicit programming) or learning-based
- Encompasses robotics, computer vision, NLP, expert systems, and more
- Goal: Create systems that can adapt and act intelligently

Machine Learning (ML):
- Subset of AI focused on algorithms that learn patterns from data
- Systems improve automatically through experience without explicit programming
- Three main types:
  1. Supervised learning (labeled training data)
  2. Unsupervised learning (finding patterns in unlabeled data)
  3. Reinforcement learning (learning through rewards/punishments)
- Examples: Recommendation systems, image recognition, spam filters

Key Difference: All ML is AI, but not all AI uses ML. Traditional AI might use hard-coded rules, while ML systems derive their own rules from data. Deep Learning is a further subset of ML using neural networks.`,
  },
  {
    user: "human",
    query: "What should I consider when adopting a pet?",
  },
  {
    user: "assistant",
    query: `Adopting a pet is a long-term commitment requiring careful consideration:

1. Lifestyle Factors:
   - Time availability (pets need daily attention)
   - Living space (apartment vs. house with yard)
   - Activity level (high-energy dogs vs. low-maintenance cats)
   - Travel frequency (need for pet sitters)

2. Financial Responsibility:
   - Initial costs: adoption fees, supplies ($200-$1000+)
   - Ongoing: food, litter, toys ($50-$300/month)
   - Medical: vaccinations, checkups, emergencies ($200-$2000+/year)
   - Pet insurance considerations

3. Pet Characteristics:
   - Species and breed traits (research thoroughly)
   - Age (puppies/kittens vs. adult/senior)
   - Temperament and compatibility with children/other pets
   - Special needs or medical conditions

4. Long-term Commitment:
   - Lifespans: 10-15+ years for most dogs/cats
   - Potential lifestyle changes (moving, having children)
   - End-of-life care considerations

5. Adoption Process:
   - Research shelters/rescues vs. breeders
   - Meet the animal multiple times
   - Ask about behavioral history
   - Prepare your home beforehand

Remember, pets are sentient beings deserving love and stability - only adopt if you can provide a forever home. Consider fostering first to test compatibility.`,
  },
];
