// ======================================================
// ADS-B CACHE PRO+++
// - Cache 10 secondes
// - Fallback si AirLabs tombe
// - Protection anti-burst
// ======================================================

let adsbCache = null;
let adsbCacheTime = 0;

export function getCachedAdsb() {
    const now = Date.now();
    if (adsbCache && now - adsbCacheTime < 10_000) {
        return adsbCache;
    }
    return null;
}

export function setCachedAdsb(data) {
    adsbCache = data;
    adsbCacheTime = Date.now();
}

function distKm(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
