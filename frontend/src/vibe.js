// Decides whether a message deserves the sparkle treatment.

const GREETING =
  /^\s*(hi+|hey+|hello+|hiya|hola|howdy|namaste|yo|sup|greetings|good\s+(?:morning|afternoon|evening|night)|what'?s\s+up|how\s+are\s+(?:you|u)|thanks?|thank\s+you|ty|bye|goodbye|see\s+ya)\b/i;

const FUN =
  /\b(jokes?|riddles?|play|games?|surprise me|fun fact|trivia|quiz|story|magic|dance|celebrate|party|would you rather|guess)\b/i;

const FUN_WORDS = ["SHOWTIME!", "LET'S PLAY!", "PLOT TWIST!", "ACTION!"];

export function detectVibe(text) {
  if (GREETING.test(text)) return "greeting";
  if (FUN.test(text)) return "fun";
  return null;
}

export function splashWord(vibe, text) {
  if (vibe !== "greeting") return FUN_WORDS[Math.floor(Math.random() * FUN_WORDS.length)];
  const word = (text.match(GREETING)?.[1] || "hello").replace(/\s+/g, " ").toUpperCase();
  if (word.startsWith("HOW")) return "HEY THERE!";
  if (word.startsWith("THANK") || word === "TY") return "ANYTIME!";
  if (word.includes("BYE") || word.startsWith("SEE")) return "SEE YA!";
  return word + "!";
}
