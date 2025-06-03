// assets/js/geo-redirect.js
const GEO_API = 'https://api.ipdata.co?api-key=teste'; // Obtenha uma key real!
const FALLBACK_URL = '/geo/global/offer.html';
const COUNTDOWN_SECONDS = 15;

const COUNTRY_PAGES = {
    'BR': ['/geo/br/main.html', '/geo/br/home.html'],
    'IN': ['/geo/in/home.html'],
    'RU': ['/geo/ru/main.html'],
    'US': ['/geo/en/welcome.html']
};

document.addEventListener('DOMContentLoaded', () => {
    if (!shouldRedirect()) return;
    showCountdown();
    redirectByCountry();
});

function shouldRedirect() {
    const blockedPages = ['/geo/', 'about.html', 'privacy-policy.html'];
    return !blockedPages.some(page => window.location.pathname.includes(page)) &&
           !document.cookie.includes("was_redirected=true");
}

// ... (restante do código igual ao seu original)
