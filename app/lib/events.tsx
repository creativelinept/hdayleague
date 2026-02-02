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
    slug: "hybrid-day-aveiro-2026",
    title: "Aveiro 2026",
    date: "2026-01-31",
    location: "Aveiro",
    description: "Hybrid Day League",
    rrEventId: 381322,
    mode: "result", // este já terminou
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug);
}
