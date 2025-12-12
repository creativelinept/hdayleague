// app/lib/events.ts

export type EventMode = "live" | "result";

export type EventData = {
  slug: string;
  title: string;
  date: string;      // formato ISO, ex: "2024-10-12"
  location: string;
  description?: string;
  rrEventId: number;
  mode: EventMode;
};

export const events: EventData[] = [
  {
    slug: "hybrid-day-vigo-2025",
    title: "Vigo 2025",
    date: "2025-12-13",
    location: "Vigo",
    description: "Hybrid Day League",
    rrEventId: 375372,
    mode: "live", // este já terminou
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug);
}
