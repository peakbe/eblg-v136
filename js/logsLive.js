import { import { API_BASE } from "./config.js";

export async function loadLogs() {
    const panel = document.getElementById("logs-panel");
    if (!panel) return;

    try {
        const res = await fetch(`${API_BASE}/fids`);
        const t0 = performance.now();

        const ok = res.ok ? "OK" : "ERR";
        const dt = Math.round(performance.now() - t0);

        const div = document.createElement("div");
        div.className = "log-entry " + (ok === "OK" ? "log-ok" : "log-error");
        div.textContent = `${new Date().toLocaleTimeString()} FIDS → ${ok}`;
        panel.appendChild(div);

    } catch (err) {
        const div = document.createElement("div");
        div.className = "log-entry log-error";
        div.textContent = `${new Date().toLocaleTimeString()} FIDS → ERR`;
        panel.appendChild(div);
    }
}
 } from "./config.js";

const livePanel = document.getElementById("logs-live");
const liveLogs = [];

function addLiveLog(status, message) {
    const entry = {
        status,
        message,
        time: new Date().toLocaleTimeString()
    };

    liveLogs.unshift(entry);
    if (liveLogs.length > 40) liveLogs.pop();

    renderLiveLogs();
}

function renderLiveLogs() {
    livePanel.innerHTML = liveLogs.map(log => `
        <div class="log-live-entry log-live-${log.status}">
            <span class="log-live-time">${log.time}</span>
            ${log.message}
        </div>
    `).join("");
}

async function probe(name, endpoint) {
    try {
        const res = await fetch(`${import { API_BASE } from "./config.js";

export async function loadLogs() {
    const panel = document.getElementById("logs-panel");
    if (!panel) return;

    try {
        const res = await fetch(`${API_BASE}/fids`);
        const t0 = performance.now();

        const ok = res.ok ? "OK" : "ERR";
        const dt = Math.round(performance.now() - t0);

        const div = document.createElement("div");
        div.className = "log-entry " + (ok === "OK" ? "log-ok" : "log-error");
        div.textContent = `${new Date().toLocaleTimeString()} FIDS → ${ok}`;
        panel.appendChild(div);

    } catch (err) {
        const div = document.createElement("div");
        div.className = "log-entry log-error";
        div.textContent = `${new Date().toLocaleTimeString()} FIDS → ERR`;
        panel.appendChild(div);
    }
}
}/${endpoint}`);
        const json = await res.json();

        if (json.fallback) {
            addLiveLog("warn", `${name} → fallback`);
        } else {
            addLiveLog("ok", `${name} → OK`);
        }

    } catch (err) {
        addLiveLog("error", `${name} → erreur`);
    }
}

export function startLiveLogs() {
    // Premier tick immédiat
    probe("METAR", "metar");
    probe("TAF", "taf");
    probe("FIDS", "fids");
    probe("Backend", "sonos");

    // Streaming toutes les 5 secondes
    setInterval(() => {
        probe("METAR", "metar");
        probe("TAF", "taf");
        probe("FIDS", "fids");
        probe("Backend", "sonos");
    }, 5000);
}
