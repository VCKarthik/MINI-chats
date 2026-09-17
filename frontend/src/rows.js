// The "title rows" on the home page. Clicking a card asks its prompt.

export const PALETTE = [
  ["#e50914", "#2b0104"],
  ["#6a11cb", "#1b2a6b"],
  ["#f7971e", "#8a1606"],
  ["#0f9b8e", "#08302d"],
  ["#ee0979", "#35083f"],
  ["#355c7d", "#0d1726"],
  ["#c94b4b", "#3d0f42"],
  ["#1d976c", "#0a3327"],
];

export const ROWS = [
  {
    title: "Say Hello ✨",
    items: [
      { title: "Hi mini!", blurb: "Start with a wave", prompt: "Hi mini!", badge: "NEW" },
      { title: "Good Morning", blurb: "Rise and shine", prompt: "Good morning!" },
      { title: "How Are You?", blurb: "Check in on your AI", prompt: "How are you today?" },
      { title: "Thank You", blurb: "Spread some love", prompt: "Thank you for the help!" },
      { title: "What's Up", blurb: "Casual vibes only", prompt: "What's up?" },
    ],
  },
  {
    title: "Trending Now",
    items: [
      { title: "Black Holes", blurb: "Explained like you're five", prompt: "Explain black holes like I'm 5", badge: "TOP 10" },
      { title: "The Internet", blurb: "How does it actually work?", prompt: "How does the internet work? Keep it simple." },
      { title: "Quantum Computing", blurb: "Qubits without the headache", prompt: "What is quantum computing, in plain English?" },
      { title: "Why Is The Sky Blue", blurb: "A classic, finally answered", prompt: "Why is the sky blue?" },
      { title: "LangChain 101", blurb: "What it is and why it matters", prompt: "What is LangChain and when should I use it?" },
      { title: "How Vaccines Work", blurb: "Your immune system's training montage", prompt: "How do vaccines work?" },
    ],
  },
  {
    title: "Fun & Games",
    items: [
      { title: "Tell Me A Joke", blurb: "Guaranteed groan", prompt: "Tell me a joke", badge: "TOP 10" },
      { title: "20 Questions", blurb: "Can mini guess it?", prompt: "Let's play 20 questions. I'm thinking of something." },
      { title: "Fun Fact", blurb: "Something you didn't know", prompt: "Surprise me with a fun fact" },
      { title: "Riddle Me This", blurb: "Test your brain", prompt: "Give me a riddle" },
      { title: "Would You Rather", blurb: "Impossible choices", prompt: "Let's play would you rather" },
      { title: "Short Story", blurb: "A tiny tale, just for you", prompt: "Tell me a short story with a twist ending" },
    ],
  },
  {
    title: "Get Things Done",
    items: [
      { title: "Write An Email", blurb: "Professional and polished", prompt: "Help me write a professional email asking for a meeting" },
      { title: "Trip Planner", blurb: "3 days, zero stress", prompt: "Plan a 3-day trip to Goa" },
      { title: "Workout Plan", blurb: "A week of movement", prompt: "Make me a simple weekly workout plan" },
      { title: "React Interview", blurb: "Practice a real question", prompt: "Give me a React interview question and then evaluate my answer" },
      { title: "Explain Code", blurb: "Paste it, understand it", prompt: "I'll paste some code, explain what it does step by step." },
    ],
  },
];

export const SURPRISES = ROWS.find((r) => r.title === "Fun & Games").items.map((i) => i.prompt);
