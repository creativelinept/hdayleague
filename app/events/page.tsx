// app/events/page.tsx

import Link from "next/link";
import { events } from "../lib/events";

export default function EventsPage() {
    return (
        <main className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-3xl font-bold mb-6">Resultados dos Eventos</h1>
            <p className="mb-6">
                Consulta aqui os resultados oficiais dos eventos Hybrid Day, em live e
                após a prova.
            </p>

            <ul className="space-y-4">
                {events.map((event) => (
                    <li
                        key={event.slug}
                        className="border rounded-lg p-4 hover:shadow-sm transition"
                    >
                        <h2 className="text-xl font-semibold">
                            <Link href={`/events/${event.slug}`}>{event.title}</Link>
                        </h2>
                        <p className="text-sm text-gray-600">
                            {Array.isArray(event.date)
                                ? event.date.map(d => new Date(d).toLocaleDateString("pt-PT")).join(" • ")
                                : new Date(event.date).toLocaleDateString("pt-PT")
                            } — {event.location}
                        </p>
                        {event.description && (
                            <p className="mt-2 text-sm text-gray-700">{event.description}</p>
                        )}
                        <p className="mt-2 text-xs uppercase text-gray-500">
                            Estado: {event.mode === "live" ? "Live" : "Resultados finais"}
                        </p>
                        <Link
                            className="mt-3 inline-block text-sm underline"
                            href={`/events/${event.slug}`}
                        >
                            Ver resultados
                        </Link>
                    </li>
                ))}
            </ul>
        </main>
    );
}
