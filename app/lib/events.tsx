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
    slug: "hybrid-day-valencia",
    title: "Valencia 2026",
    date: "2026-05-09",
    location: "Valencia",
    description: "Hybrid Day Valencia",
    rrEventId: 397732,
    mode: "live", // este ainda não terminou
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug);
}
