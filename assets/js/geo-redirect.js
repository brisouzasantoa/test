// Versão 100% testável - cole TODO este código
const CONFIG = {
    debug: true,
    cookieName: "geo_redirected_TEST",
    cookieExpiryDays: 1,
    minDelay: 3000,
    maxDelay: 6000,
    countdownDuration: 3,
    geoApiUrls: [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/?fields=countryCode'
    ],
    countryMapping: {
        'BR': ['/test/geo/br/main.html'],
        'default': ['/test/geo/global/default.html']
    },
    excludedPaths: ['/test/geo/']
};

console.log("[GeoRedirect] Config loaded!", CONFIG);

function shouldRedirect() {
    const path = window.location.pathname;
    if (CONFIG.excludedPaths.some(p => path.includes(p))) {
        console.log("[GeoRedirect] Skip (excluded path)");
        return false;
    }
    if (document.cookie.includes(`${CONFIG.cookieName}=true`)) {
        console.log("[GeoRedirect] Skip (cookie exists)");
        return false;
    }
    return true;
}

function setCookie() {
    const expires = new Date();
    expires.setDate(expires.getDate() + CONFIG.cookieExpiryDays);
    document.cookie = `${CONFIG.cookieName}=true; expires=${expires.toUTCString()}; path=/`;
}

async function getCountry() {
    for (const apiUrl of CONFIG.geoApiUrls) {
        try {
            console.log("[GeoRedirect] Trying API:", apiUrl);
            const res = await fetch(apiUrl);
            const data = await res.json();
            const country = data.country || data.countryCode;
            if (country) {
                console.log("[GeoRedirect] Country detected:", country);
                return country.toUpperCase();
            }
        } catch (err) {
            console.warn("[GeoRedirect] API failed:", apiUrl, err);
        }
    }
    throw new Error("All APIs failed");
}

function redirect(url) {
    console.log("[GeoRedirect] Redirecting to:", url);
    window.location.href = url;
}

function startCountdown(url, seconds) {
    console.log(`[GeoRedirect] Starting countdown (${seconds}s) to ${url}`);
    const overlay = document.createElement('div');
    overlay.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
        background:rgba(0,0,0,0.9);color:white;display:flex;
        justify-content:center;align-items:center;z-index:9999">
            <div>
                <h2>Loading content for your region...</h2>
                <p>Redirecting in <span id="countdown">${seconds}</span> seconds</p>
                <button id="cancelBtn" style="padding:10px 20px;background:#FF9500;
                color:white;border:none;border-radius:5px;cursor:pointer">
                    Cancel
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    let remaining = seconds;
    const interval = setInterval(() => {
        remaining--;
        document.getElementById('countdown').textContent = remaining;
        if (remaining <= 0) {
            clearInterval(interval);
            redirect(url);
        }
    }, 1000);

    document.getElementById('cancelBtn').addEventListener('click', () => {
        clearInterval(interval);
        document.body.removeChild(overlay);
        setCookie();
    });
}

(async function init() {
    if (!shouldRedirect()) return;
    
    try {
        const country = await getCountry();
        const urls = CONFIG.countryMapping[country] || CONFIG.countryMapping['default'];
        const targetUrl = urls[0]; // Pega a primeira URL disponível
        const delay = Math.random() * (CONFIG.maxDelay - CONFIG.minDelay) + CONFIG.minDelay;
        
        setTimeout(() => {
            startCountdown(targetUrl, CONFIG.countdownDuration);
        }, delay - (CONFIG.countdownDuration * 1000));
        
    } catch (err) {
        console.error("[GeoRedirect] Error:", err);
        startCountdown(CONFIG.countryMapping['default'][0], 3);
    }
})();
