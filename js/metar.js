// ======================================================
// METAR — VERSION PRO+ (HARMONISÉE AVEC RUNWAYS PRO+)
// Chargement sécurisé, logs propres, UI robuste.
// ======================================================

import { ENDPOINTS } from "./config.js";
import { fetchJSON, updateStatusPanel } from "./helpers.js";
import { updateRunwayPanel, getRunwayFromWind, drawRunway, drawCorridor } from "./runways.js";

// ------------------------------------------------------
// Logging PRO+
// ------------------------------------------------------
const IS_DEV = location.hostname.includes("localhost") || location.hostname.includes("127.0.0.1");
const log = (...a) => IS_DEV && console.log("[METAR]", ...a);
const logErr = (...a) => console.error("[METAR ERROR]", ...a);

// ------------------------------------------------------
// Chargement sécurisé
// ------------------------------------------------------
export async function safeLoadMetar() {
    try {
        await loadMetar();
        log("METAR chargé");
    } catch (err) {
        logErr("Erreur METAR :", err);
    }
}

// ------------------------------------------------------
// Chargement brut
// ------------------------------------------------------
export async function loadMetar() {
    const data = await fetchJSON(ENDPOINTS.metar);
    updateMetarUI(data);
    updateStatusPanel("METAR", data);
}

// ------------------------------------------------------
// Mise à jour UI + piste
// ------------------------------------------------------
export function updateMetarUI(data) {
    const el = document.getElementById("metar");
    if (!el) return;

    // Vérification structure CheckWX
    if (!data || !data.data || !data.data[0] || !data.data[0].raw_text) {
        el.innerText = "METAR indisponible";

        drawRunway("22", window.runwayLayer);      // fallback piste 22
        drawCorridor("22", window.corridorLayer);
        updateRunwayPanel("22", 0, 0, 0);

        return;
    }

    const metar = data.data[0];

    // Affichage texte
    el.innerText = metar.raw_text;

    // Extraction vent
    const windDir = metar.wind?.degrees ?? null;
    const windSpeed = metar.wind?.speed_kts ?? null;

    // Détermination piste active (gérée dans runways.js)
    const runway = getRunwayFromWind(windDir);

    // Mise à jour panneau piste
    updateRunwayPanel(runway, windDir, windSpeed);

    // Dessin piste + corridor
    drawRunway(runway, window.runwayLayer);
    drawCorridor(runway, window.corridorLayer);
}
