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
    slug: "hybrid-day-santa-maria-da-feira",
    title: "Santa Maria da Feira 2026",
    date: "2026-04-11",
    location: "Santa Maria da Feira",
    description: "Hybrid Day Santa Maria da Feira",
    rrEventId: 392339,
    mode: "live", // este ainda não terminou
  },
];

export function getEventBySlug(slug: string): EventData | undefined {
  return events.find((e) => e.slug === slug);
}
