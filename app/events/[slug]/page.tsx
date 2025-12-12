import { notFound } from "next/navigation";
import Image from "next/image";
import RaceResultEmbed from "../../components/RaceResultEmbed";
import { getEventBySlug } from "../../lib/events";

export default async function EventSinglePage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const event = getEventBySlug(slug);

    if (!event) {
        return notFound();
    }

    // Handle single or multiple dates
    const dates = Array.isArray(event.date) ? event.date : [event.date];
    const formattedDates = dates.map(d => new Date(d).toLocaleDateString("pt-PT"));

    return (
        <main className="w-full">
            {/* Hero Section - HYROX Style */}
            <header
                className="w-full bg-black text-white relative overflow-hidden"
                style={{ backgroundColor: '#000000', color: '#ffffff' }}
            >
                {/* Content Container - Centered with top spacing */}
                <div className="relative w-full flex flex-col items-center justify-center px-4 sm:px-6 pt-12 pb-16 md:pt-16 md:pb-24">
                    {/* Logo */}
                    <div className="flex justify-center items-center mb-10">
                        <Image
                            src="/images/hybrid-day-logo.png"
                            alt="HYBRID-DAY"
                            width={200}
                            height={60}
                            className="h-14 md:h-20 w-auto"
                            priority
                        />
                    </div>

                    {/* Event Title */}
                    <div className="w-full max-w-5xl text-center space-y-6">
                        <h1
                            className="text-5xl md:text-7xl font-black tracking-tight uppercase text-white"
                            style={{ color: '#ffffff' }}
                        >
                            {event.title}
                        </h1>

                        {/* Event Info Bar */}
                        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 text-sm md:text-base">
                            {/* Dates - supports 1-3 dates */}
                            <div className="flex items-center gap-2">
                                <span className="text-[#FFB800] font-bold text-lg">📅</span>
                                <span className="font-medium">
                                    {formattedDates.length === 1
                                        ? formattedDates[0]
                                        : formattedDates.join(" • ")
                                    }
                                </span>
                            </div>

                            <div className="hidden md:block w-px h-6 bg-gray-700"></div>

                            {/* Location */}
                            <div className="flex items-center gap-2">
                                <span className="text-[#FFB800] font-bold text-lg">📍</span>
                                <span className="font-medium">{event.location}</span>
                            </div>

                            {/* Live Indicator */}
                            {event.mode === "live" && (
                                <>
                                    <div className="hidden md:block w-px h-6 bg-gray-700"></div>
                                    <div className="flex items-center gap-2">
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                                        </span>
                                        <span className="font-bold text-red-500 uppercase text-xs md:text-sm">
                                            Live
                                        </span>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {event.description && (
                            <p className="text-gray-400 text-lg md:text-xl max-w-3xl mx-auto font-medium">
                                {event.description}
                            </p>
                        )}

                        {/* Results Badge */}
                        <div className="pt-4 flex justify-center">
                            <div className="bg-[#FFB800] text-black px-8 py-3 rounded-full font-bold text-sm md:text-base uppercase tracking-wide">
                                {event.mode === "live" ? "Resultados em Tempo Real" : "Resultados Finais"}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Border Accent */}
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFB800] to-transparent"></div>
            </header>

            {/* Secção da tabela ocupa a largura toda - UNTOUCHED */}
            <section className="w-full">
                <RaceResultEmbed eventId={event.rrEventId} mode={event.mode} />
            </section>
        </main>
    );
}
