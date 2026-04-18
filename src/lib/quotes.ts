import quotes from "@/content/the_force.json";

export function getTodaysQuote(): string {
  const epoch = new Date("2025-01-01").getTime();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayIndex = Math.floor((today.getTime() - epoch) / 86_400_000);
  return quotes[dayIndex % quotes.length];
}

export function getRandomQuote(): string {
  return quotes[Math.floor(Math.random() * quotes.length)];
}

const FAV_KEY = "favouriteQuote";

export function getFavouriteQuote(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(FAV_KEY);
}

export function setFavouriteQuote(quote: string): void {
  localStorage.setItem(FAV_KEY, quote);
}
