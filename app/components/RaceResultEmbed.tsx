"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type RaceResultEmbedProps = {
    eventId: number;
    mode: "live" | "result";
};

export default function RaceResultEmbed({ eventId, mode }: RaceResultEmbedProps) {
    const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
    const fallbackTimer = useRef<number | null>(null);
    const fallbackUrl = `https://my.raceresult.com/${eventId}/?lang=pt`;

    // carregar CSS externo deles de forma controlada
    useEffect(() => {
        const head = document.head;

        const links = [
            "https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700",
            "https://fonts.googleapis.com/css?family=Dosis:400,300,600,700",
            "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
            "https://sinctime.com/Content/css?v=LlI9gbwZ54oyBpwlBVz5SbX256yIjpz7aRyhadyOeqk1",
            // preconnect para acelerar a primeira chamada
            "https://my.raceresult.com",
        ];

        // Carregar CSS com media query para isolar o impacto
        links.forEach((href) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = href;
                // Adicionar ao final do head para que nossos estilos tenham prioridade
                head.appendChild(link);
            }
        });
    }, []);

    // se nada aparecer, marcamos erro para mostrar fallback
    useEffect(() => {
        fallbackTimer.current = window.setTimeout(() => {
            const hasTable = !!document.querySelector(".RRPublish table.MainTable");
            if (!hasTable) {
                setStatus("error");
            }
        }, 12000);

        return () => {
            if (fallbackTimer.current) {
                window.clearTimeout(fallbackTimer.current);
            }
        };
    }, []);

    // Reescrever texto dos splits "R. 03:51" -> "Run 1: 03:51"
    function rewriteRunSplits() {
        const table = document.querySelector(".RRPublish table.MainTable");
        if (!table) return;

        // 1) Obter numeração das colunas de corrida pelo header (#1, #2, ...)
        const headerCells = Array.from(table.querySelectorAll("thead th"));
        const runNumbers: string[] = [];

        headerCells.forEach((th) => {
            const label = th.textContent?.trim();
            if (label && /^#\d+$/.test(label)) {
                runNumbers.push(label.replace("#", ""));
            }
        });

        // 2) Tabela principal (já estava a funcionar)
        runNumbers.forEach((runNumber, index) => {
            const rows = table.querySelectorAll("tbody tr");
            rows.forEach((row) => {
                const cell = row.children[index] as HTMLTableCellElement | undefined;
                if (!cell) return;

                const text = cell.textContent?.trim() || "";
                const match = text.match(/^R\.\s*(\d{2}:\d{2})$/);
                if (match) {
                    const time = match[1];
                    cell.textContent = `Run ${runNumber}: ${time}`;
                }
            });
        });

        // 3) DETALHE / DROPDOWN EM MOBILE (HTML enviado por ti)
        runNumbers.forEach((runNumber) => {
            // Selecionar qualquer <div> que contenha um <div>#1:</div>
            const blocks = Array.from(
                document.querySelectorAll(".RRPublish td div")
            ) as HTMLDivElement[];

            blocks.forEach((wrapper) => {
                const first = wrapper.querySelector("div:nth-child(1)");
                const second = wrapper.querySelector("div:nth-child(2)");

                if (!first || !second) return;

                const label = first.textContent?.trim();
                const value = second.textContent?.trim();

                // Tem de coincidir com "#1:", "#2:", ...
                if (label === `#${runNumber}:`) {
                    const match = value.match(/^R\.\s*(\d{2}:\d{2})$/);
                    if (!match) return;

                    const time = match[1];
                    first.textContent = `Run ${runNumber}:`;
                    second.textContent = time;
                }
            });
        });
    }


    return (
        <div style={{ isolation: 'isolate' }}>
            {status === "error" ? (
                <div className="flex flex-col gap-4 items-center justify-center text-center px-4 py-10 bg-black text-white border border-yellow-500/40 rounded-lg">
                    <p className="text-lg font-semibold">Não foi possível carregar a tabela de resultados aqui.</p>
                    <p className="text-sm text-gray-400">Podes abrir diretamente no site da RaceResult:</p>
                    <a
                        href={fallbackUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center px-6 py-3 bg-[#FFB800] text-black font-bold rounded-full uppercase tracking-wide"
                    >
                        Abrir resultados
                    </a>
                    <iframe
                        title="RaceResult fallback"
                        src={fallbackUrl}
                        loading="lazy"
                        className="w-full"
                        style={{ border: "1px solid #444", borderRadius: 12, minHeight: "70vh" }}
                    />
                </div>
            ) : (
                <>
                    <div id="divRRPublish" className="RRPublish" />
                    {status === "loading" && (
                        <div className="flex items-center justify-center py-10 text-gray-300 text-sm">
                            <div className="animate-spin h-6 w-6 border-2 border-[#FFB800] border-t-transparent rounded-full mr-3"></div>
                            A carregar resultados...
                        </div>
                    )}

                    <Script
                        src="https://my.raceresult.com/RRPublish/load.js.php?lang=pt"
                        strategy="afterInteractive"
                        onLoad={() => {
                            const RRPublish = (window as any).RRPublish;
                            const container = document.getElementById("divRRPublish");

                            if (RRPublish && container) {
                                const rrp = new RRPublish(container, eventId, mode);
                                rrp.ShowTimerLogo = true;
                                rrp.ShowInfoText = false;
                                setStatus("ready");

                                // 1) Esperar a tabela inicial ficar pronta
                                let tries = 0;
                                const maxTries = 20;
                                const interval = window.setInterval(() => {
                                    const table = document.querySelector(".RRPublish table.MainTable");
                                    if (table || tries >= maxTries) {
                                        window.clearInterval(interval);
                                        rewriteRunSplits();
                                    }
                                    tries++;
                                }, 500);

                                // 2) Sempre que a RaceResult alterar o conteúdo (ex: abrir dropdown),
                                // voltamos a aplicar rewriteRunSplits
                                const observer = new MutationObserver(() => {
                                    rewriteRunSplits();
                                });

                                observer.observe(container, {
                                    childList: true,
                                    subtree: true,
                                });
                            } else {
                                setStatus("error");
                            }
                        }}
                        onError={() => setStatus("error")}
                    />
                </>
            )}
        </div>
    );
}
