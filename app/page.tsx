import { redirect } from "next/navigation";
import { events } from "./lib/events";

export default function Home() {
  // A página inicial é sempre o primeiro evento em app/lib/events.tsx
  redirect(`/events/${events[0].slug}`);
}
