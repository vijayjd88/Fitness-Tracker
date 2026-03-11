export interface MotivationalQuote {
  text: string;
  author: string;
}

export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
    author: "Bruce Lee",
  },
  {
    text: "Empty your mind, be formless. Shapeless, like water.",
    author: "Bruce Lee",
  },
  {
    text: "The key to immortality is first living a life worth remembering.",
    author: "Bruce Lee",
  },
  {
    text: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    author: "Bruce Lee",
  },
  {
    text: "I don’t count my sit-ups. I only start counting when it starts hurting.",
    author: "Muhammad Ali",
  },
  {
    text: "Success isn’t always about greatness. It’s about consistency.",
    author: "Dwayne Johnson",
  },
  {
    text: "The only bad workout is the one that didn’t happen.",
    author: "Unknown",
  },
  {
    text: "It’s not the size of the dog in the fight, it’s the size of the fight in the dog.",
    author: "Mark Twain",
  },
  {
    text: "I’m not the best in the world at what I do, but I’m the best at what I do.",
    author: "Conor McGregor",
  },
  {
    text: "There’s no talent here, this is hard work.",
    author: "Conor McGregor",
  },
  {
    text: "Excellence is not a destination; it’s a continuous journey.",
    author: "Georges St-Pierre",
  },
  {
    text: "I’m not the most talented, but I’m a hard worker.",
    author: "Georges St-Pierre",
  },
  {
    text: "The only person you should try to be better than is who you were yesterday.",
    author: "Unknown",
  },
  {
    text: "It’s not about having time. It’s about making time.",
    author: "Unknown",
  },
  {
    text: "Discipline is choosing between what you want now and what you want most.",
    author: "Unknown",
  },
  {
    text: "I don’t compete with anyone. I just make sure that the next time I step on the mat, I’m better than the last time.",
    author: "Jon Jones",
  },
  {
    text: "The only way to define your limits is by going beyond them.",
    author: "Jon Jones",
  },
];

export function getRandomQuote(): MotivationalQuote {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}
