// ======================================================
// STATUS.JS — Cockpit IFR EBLG PRO+++
// - Vérification périodique des endpoints backend
// - Mise à jour panneau statut (METAR / TAF / FIDS / SONO / ADS-B)
// - Anti-HTML, anti-timeout, anti-erreurs silencieuses
// ======================================================

import { ENDPOINTS } from "./config.js";
import { fetchJSON, updateStatusPanel } from "./helpers.js";

// ------------------------------------------------------
// ENDPOINTS À TESTER
// ------------------------------------------------------
const CHECKS = [
    { key: "METAR", url: ENDPOINTS.metar },
    { key: "TAF", url: ENDPOINTS.taf },
    { key: "FIDS", url: ENDPOINTS.fids },
    { key: "SONO", url: ENDPOINTS.sono },
    { key: "ADSB", url: ENDPOINTS.adsb || "/api/adsb" }
];

// ------------------------------------------------------
// API PUBLIC — appelée par app.js
// ------------------------------------------------------
export async function checkApiStatus() {
    for (const c of CHECKS) {
        await checkOne(c.key, c.url);
    }
}

// ------------------------------------------------------
// TEST D’UN ENDPOINT
// ------------------------------------------------------
async function checkOne(key, url) {
    try {
        const data = await fetchJSON(url, 5000);

        if (!data) {
            updateStatusPanel(key, { error: true });
            return;
        }

        // Vérification minimale selon type
        switch (key) {
            case "METAR":
                if (!data.raw) return updateStatusPanel(key, { error: true });
                break;

            case "TAF":
                if (!data.raw) return updateStatusPanel(key, { error: true });
                break;

            case "FIDS":
                if (!Array.isArray(data.flights))
                    return updateStatusPanel(key, { error: true });
                break;

            case "SONO":
                if (!data.sensors) return updateStatusPanel(key, { error: true });
                break;

            case "ADSB":
                if (!data.ac) return updateStatusPanel(key, { error: true });
                break;
        }

        updateStatusPanel(key, { ok: true });

    } catch (err) {
        console.error(`[STATUS] Erreur ${key}`, err);
        updateStatusPanel(key, { error: true });
    }
}
