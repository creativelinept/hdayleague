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
    slug: "hybrid-day-madrid-2026",
    title: "Madrid 2026",
    date: "2026-02-15",
    location: "Madrid",
    description: "Hybrid Day Madrid",
    rrEventId: 383186,
    mode: "result", // este já terminou
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug);
}
