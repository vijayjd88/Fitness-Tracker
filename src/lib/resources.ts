export interface VideoResource {
  id: string;
  title: string;
  channel?: string;
}

export interface ArticleResource {
  title: string;
  url: string;
  description?: string;
}

const YOUTUBE_THUMB = (id: string) => `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
const YOUTUBE_WATCH = (id: string) => `https://www.youtube.com/watch?v=${id}`;

export const VIDEOS_BY_TYPE: Record<string, VideoResource[]> = {
  Run: [
    { id: "Gc6eL1VnQ", title: "Running form for beginners", channel: "Running" },
    { id: "yA7OMw3Fn_s", title: "5K training plan", channel: "Running" },
    { id: "2z8Q1qGws0k", title: "Treadmill workout", channel: "Fitness" },
  ],
  Yoga: [
    { id: "kqnJQbTfTpE", title: "Yoga for beginners (10 min)", channel: "Yoga with Adriene" },
    { id: "v7SN0F4pqs", title: "Morning yoga stretch", channel: "Yoga" },
    { id: "4Bk3Fznb1q0", title: "Full body yoga", channel: "Yoga" },
  ],
  "Muay Thai": [
    { id: "WLQeeUdOHv", title: "Muay Thai basics", channel: "Fight Tips" },
    { id: "xZJvqjVqVq", title: "Heavy bag workout", channel: "Muay Thai" },
    { id: "4Bk3Fznb1q0", title: "Technique breakdown", channel: "Muay Thai" },
  ],
  Lift: [
    { id: "sS_4uTqFq", title: "Beginner strength routine", channel: "Fitness" },
    { id: "2z8Q1qGws0k", title: "Home dumbbell workout", channel: "Fitness" },
    { id: "yA7OMw3Fn_s", title: "Compound movements", channel: "Strength" },
  ],
  Tennis: [
    { id: "yA7OMw3Fn_s", title: "Tennis fitness", channel: "Tennis" },
    { id: "2z8Q1qGws0k", title: "Footwork drills", channel: "Tennis" },
  ],
  Hike: [
    { id: "Gc6eL1VnQ", title: "Hiking preparation", channel: "Outdoor" },
    { id: "yA7OMw3Fn_s", title: "Trail fitness", channel: "Hiking" },
  ],
  Other: [
    { id: "2z8Q1qGws0k", title: "General fitness", channel: "Fitness" },
  ],
};

export const ARTICLES_BY_TYPE: Record<string, ArticleResource[]> = {
  Run: [
    { title: "How to start running", url: "https://www.nhs.uk/live-well/exercise/running-and-aerobic-exercises/get-running-with-couch-to-5k/", description: "NHS Couch to 5K guide" },
    { title: "Running form tips", url: "https://www.runnersworld.com/beginner/a20801343/how-to-run/", description: "Runner's World basics" },
  ],
  Yoga: [
    { title: "Yoga for beginners", url: "https://www.acefitness.org/resources/everyone/exercise-library/group/yoga/", description: "ACE Fitness yoga guide" },
    { title: "Benefits of yoga", url: "https://www.nhs.uk/live-well/exercise/yoga-for-beginners/", description: "NHS overview" },
  ],
  "Muay Thai": [
    { title: "Muay Thai 101", url: "https://www.evolve-mma.com/blog/what-is-muay-thai/", description: "Introduction to Muay Thai" },
  ],
  Lift: [
    { title: "Strength training basics", url: "https://www.nhs.uk/live-well/exercise/strength-and-flexibility-exercises/how-to-improve-strength-flexibility/", description: "NHS strength guide" },
  ],
  Tennis: [
    { title: "Tennis fitness", url: "https://www.usta.com/en/home/improve/conditioning.html", description: "USTA conditioning" },
  ],
  Hike: [
    { title: "Hiking preparation", url: "https://www.rei.com/learn/expert-advice/hiking-beginners.html", description: "REI beginner tips" },
  ],
  Other: [
    { title: "General fitness guidelines", url: "https://www.who.int/news-room/fact-sheets/detail/physical-activity", description: "WHO physical activity" },
  ],
};

export const GENERAL_ARTICLES: ArticleResource[] = [
  { title: "How much exercise do you need?", url: "https://www.nhs.uk/live-well/exercise/exercise-guidelines/physical-activity-guidelines-for-adults-aged-19-to-64/", description: "NHS guidelines for adults" },
  { title: "Staying motivated to exercise", url: "https://www.mayoclinic.org/healthy-lifestyle/fitness/in-depth/fitness/art-20047624", description: "Mayo Clinic tips" },
  { title: "Warm-up and cool-down", url: "https://www.acefitness.org/resources/everyone/exercise-library/", description: "ACE Fitness exercise library" },
  { title: "Recovery and rest days", url: "https://www.healthline.com/health/exercise-fitness/rest-day", description: "Why rest days matter" },
];

export function getVideoThumbUrl(id: string): string {
  return YOUTUBE_THUMB(id);
}

export function getVideoWatchUrl(id: string): string {
  return YOUTUBE_WATCH(id);
}

export function getTopTypesFromSummary(byType: Record<string, number>, limit = 2): string[] {
  return Object.entries(byType)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([type]) => type);
}
