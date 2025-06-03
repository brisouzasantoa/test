// assets/js/geo-redirect.js - VERSÃO DEBUG
console.log("Geo-Redirect: Script carregado!");

const CONFIG = {
  debug: true, // Ativa mensagens no console
  cookieName: "geo_redirected_v2", // Mudei o nome para evitar cache
  cookieExpiryDays: 1,
  minDelay: 5000,  // Reduzi para testes
  maxDelay: 10000, // Reduzi para testes
  countdownDuration: 5,
  geoApiUrls: [
    'https://ipapi.co/json/',
    'https://ip-api.com/json/?fields=countryCode',
    'https://api.ipdata.co?api-key=test' // API free
  ],
  countryMapping: {
    'BR': ['/geo/br/main.html', '/geo/br/home.html'],
    'IN': ['/geo/in/offer.html', '/geo/in/welcome.html'],
    'RU': ['/geo/ru/promo.html'],
    'default': ['/geo/global/default.html']
  },
  excludedPaths: ['/geo/', 'about.html', 'privacy.html']
};

// Debug Helper
function debugLog(message) {
  if (CONFIG.debug) console.log(`[DEBUG] ${message}`);
}

function createOverlay() {
  debugLog("Criando overlay de redirecionamento");
  const overlay = document.createElement('div');
  overlay.id = 'geo-redirect-overlay';
  overlay.style.cssText = `
    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
    background: rgba(0,0,0,0.9); z-index: 9999; color: white;
    display: flex; justify-content: center; align-items: center;
    font-family: Arial, sans-serif;
  `;
  overlay.innerHTML = `
    <div style="text-align: center; padding: 20px; max-width: 500px;">
      <h2 style="color: #FFD700;">Loading content for your region...</h2>
      <p>Redirecting in <span id="geo-countdown">${CONFIG.countdownDuration}</span> seconds</p>
      <div style="margin: 20px auto; width: 50px; height: 50px; border: 5px solid #333; border-top-color: #FFD700; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      <button id="geo-cancel-btn" style="background: #FF9500; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Cancel</button>
    </div>
    <style>@keyframes spin { to { transform: rotate(360deg); } }</style>
  `;
  return overlay;
}

function shouldRedirect() {
  const currentPath = window.location.pathname;
  
  // Verifica paths excluídos
  if (CONFIG.excludedPaths.some(path => currentPath.includes(path))) {
    debugLog(`Redirecionamento ignorado (path excluído): ${currentPath}`);
    return false;
  }
  
  // Verifica cookie
  if (document.cookie.includes(`${CONFIG.cookieName}=true`)) {
    debugLog("Redirecionamento ignorado (cookie existente)");
    return false;
  }
  
  // Verifica bots
  if (/bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent)) {
    debugLog("Redirecionamento ignorado (bot detectado)");
    return false;
  }
  
  debugLog("Redirecionamento deve ocorrer");
  return true;
}

async function redirectByCountry() {
  debugLog("Iniciando redirectByCountry()");
  
  if (!shouldRedirect()) {
    debugLog("Redirecionamento não necessário");
    return;
  }

  const overlay = createOverlay();
  document.body.appendChild(overlay);
  
  // Contagem regressiva VISÍVEL
  let seconds = CONFIG.countdownDuration;
  const countdownEl = document.getElementById('geo-countdown');
  
  const countdown = setInterval(() => {
    seconds--;
    countdownEl.textContent = seconds;
    if (seconds <= 0) clearInterval(countdown);
  }, 1000);

  // Botão de cancelamento
  document.getElementById('geo-cancel-btn').addEventListener('click', () => {
    clearInterval(countdown);
    document.body.removeChild(overlay);
    setRedirectCookie();
    debugLog("Redirecionamento cancelado pelo usuário");
  });

  try {
    debugLog("Iniciando detecção de país...");
    const countryCode = await detectCountry();
    const targetUrls = CONFIG.countryMapping[countryCode] || CONFIG.countryMapping['default'];
    const randomUrl = targetUrls[Math.floor(Math.random() * targetUrls.length)];
    const delay = getRandomDelay();
    
    debugLog(`País detectado: ${countryCode} | URL destino: ${randomUrl} | Delay: ${delay}ms`);
    
    setTimeout(() => {
      debugLog(`Redirecionando para: ${randomUrl}`);
      window.location.href = randomUrl;
    }, delay);

  } catch (error) {
    console.error("Falha na geolocalização:", error);
    const fallbackUrl = CONFIG.countryMapping['default'][0];
    debugLog(`Usando fallback: ${fallbackUrl}`);
    
    setTimeout(() => {
      window.location.href = fallbackUrl;
    }, CONFIG.minDelay);
  }
}

async function detectCountry() {
  debugLog("Tentando APIs de geolocalização...");
  
  for (const apiUrl of CONFIG.geoApiUrls) {
    try {
      debugLog(`Testando API: ${apiUrl}`);
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      
      const data = await response.json();
      debugLog("Resposta da API:", data);
      
      if (data.country || data.countryCode) {
        const code = (data.country || data.countryCode).toUpperCase();
        debugLog(`País detectado: ${code}`);
        return code;
      }
    } catch (error) {
      debugLog(`Falha na API ${apiUrl}: ${error.message}`);
    }
  }
  throw new Error("Todas as APIs falharam");
}

function setRedirectCookie() {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + CONFIG.cookieExpiryDays);
  document.cookie = `${CONFIG.cookieName}=true; expires=${expiryDate.toUTCString()}; path=/`;
  debugLog("Cookie de redirecionamento definido");
}

function getRandomDelay() {
  return Math.floor(Math.random() * (CONFIG.maxDelay - CONFIG.minDelay)) + CONFIG.minDelay;
}

// Inicia quando o DOM estiver pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    debugLog("DOM totalmente carregado - iniciando redirecionamento");
    redirectByCountry();
  });
} else {
  debugLog("DOM já carregado - iniciando imediatamente");
  redirectByCountry();
}
