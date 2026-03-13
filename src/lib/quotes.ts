export interface MotivationalQuote {
  text: string;
  author: string;
}

/** All quotes from sportspersons — iconic, high-impact, motivational. */
export const MOTIVATIONAL_QUOTES: MotivationalQuote[] = [
  {
    text: "I fear not the man who has practiced 10,000 kicks once, but I fear the man who has practiced one kick 10,000 times.",
    author: "Bruce Lee",
  },
  {
    text: "Empty your mind, be formless. Shapeless, like water. Now you put water into a cup, it becomes the cup. You put water into a bottle, it becomes the bottle. Be water, my friend.",
    author: "Bruce Lee",
  },
  {
    text: "Knowing is not enough; we must apply. Willing is not enough; we must do.",
    author: "Bruce Lee",
  },
  {
    text: "The key to immortality is first living a life worth remembering.",
    author: "Bruce Lee",
  },
  {
    text: "I don't count my sit-ups. I only start counting when it starts hurting.",
    author: "Muhammad Ali",
  },
  {
    text: "Impossible is just a big word thrown around by small men who find it easier to live in the world they've been given than to explore the power they have to change it.",
    author: "Muhammad Ali",
  },
  {
    text: "Don't count the days. Make the days count.",
    author: "Muhammad Ali",
  },
  {
    text: "Champions aren't made in the gyms. Champions are made from something they have deep inside them — a desire, a dream, a vision.",
    author: "Muhammad Ali",
  },
  {
    text: "I've failed over and over and over again in my life. And that is why I succeed.",
    author: "Michael Jordan",
  },
  {
    text: "Some people want it to happen, some wish it would happen, others make it happen.",
    author: "Michael Jordan",
  },
  {
    text: "The moment you give up is the moment you let someone else win.",
    author: "Kobe Bryant",
  },
  {
    text: "I can't relate to lazy people. We don't speak the same language. I don't understand you. I don't want to understand you.",
    author: "Kobe Bryant",
  },
  {
    text: "Success isn't always about greatness. It's about consistency. Consistent hard work leads to success. Greatness will come.",
    author: "Dwayne Johnson",
  },
  {
    text: "Blood, sweat, and respect. First two you give, last one you earn.",
    author: "Dwayne Johnson",
  },
  {
    text: "The only bad workout is the one that didn't happen.",
    author: "Unknown",
  },
  {
    text: "I'm not the best in the world at what I do, but I'm the best at what I do.",
    author: "Conor McGregor",
  },
  {
    text: "There's no talent here, this is hard work. This is an obsession. Talent does not exist.",
    author: "Conor McGregor",
  },
  {
    text: "Excellence is not a destination; it's a continuous journey.",
    author: "Georges St-Pierre",
  },
  {
    text: "I'm not the most talented, but I'm a hard worker. I'll never give up.",
    author: "Georges St-Pierre",
  },
  {
    text: "I don't compete with anyone. I just make sure that the next time I step on the mat, I'm better than the last time.",
    author: "Jon Jones",
  },
  {
    text: "The only way to define your limits is by going beyond them.",
    author: "Jon Jones",
  },
  {
    text: "The pain you feel today will be the strength you feel tomorrow.",
    author: "Unknown",
  },
  {
    text: "You miss 100% of the shots you don't take.",
    author: "Wayne Gretzky",
  },
  {
    text: "I hated every minute of training, but I said, don't quit. Suffer now and live the rest of your life as a champion.",
    author: "Muhammad Ali",
  },
  {
    text: "Obstacles don't have to stop you. If you run into a wall, don't turn around and give up. Figure out how to climb it, go through it, or work around it.",
    author: "Michael Jordan",
  },
  {
    text: "The fight is won or lost far away from witnesses — it is won behind the lines, in the gym, and out there on the road, long before I dance under those lights.",
    author: "Muhammad Ali",
  },
  {
    text: "I've always believed that if you put in the work, the results will come.",
    author: "Michael Jordan",
  },
  {
    text: "The only one who can tell you 'you can't' is you. And you don't have to listen.",
    author: "Usain Bolt",
  },
  {
    text: "I don't run away from a challenge because I am afraid. I run toward it because the only way to escape the fear is to trample it beneath your feet.",
    author: "Nadia Comăneci",
  },
  {
    text: "Pressure is nothing more than the shadow of great opportunity.",
    author: "Michael Johnson",
  },
];

export function getRandomQuote(): MotivationalQuote {
  return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
}

/** Pick a stable quote per path so each tab has its own quote. */
export function getQuoteForPath(pathname: string): MotivationalQuote {
  const pathIndex = pathname.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const index = Math.abs(pathIndex) % MOTIVATIONAL_QUOTES.length;
  return MOTIVATIONAL_QUOTES[index];
}
