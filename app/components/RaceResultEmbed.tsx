"use client";

import Script from "next/script";
import { useEffect } from "react";

type RaceResultEmbedProps = {
    eventId: number;
    mode: "live" | "result";
};

export default function RaceResultEmbed({ eventId, mode }: RaceResultEmbedProps) {
    // carregar CSS externo deles
    useEffect(() => {
        const head = document.head;

        const links = [
            "https://fonts.googleapis.com/css?family=Open+Sans:400,300,600,700",
            "https://fonts.googleapis.com/css?family=Dosis:400,300,600,700",
            "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
            "https://sinctime.com/Content/css?v=LlI9gbwZ54oyBpwlBVz5SbX256yIjpz7aRyhadyOeqk1",
        ];


        links.forEach((href) => {
            if (!document.querySelector(`link[href="${href}"]`)) {
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = href;
                head.appendChild(link);
            }
        });
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
        <>
            <div id="divRRPublish" className="RRPublish" />

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
                    }
                }}
            />
        </>
    );
}
