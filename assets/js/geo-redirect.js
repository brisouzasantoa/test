// Versão 2.0 - Integrado com gateways
const COUNTRY_GATEWAYS = {
    'BR': {
        gateways: ['/test/geo/br/home.html'],
        params: {
            src: ['organic_search','social_media'],
            ref: ['google','direct']
        }
    },
    'IN': {
        gateways: ['/test/geo/in/offer.html'],
        params: { ... } 
    }
};

function getRandomGateway(country) {
    const config = COUNTRY_GATEWAYS[country] || COUNTRY_GATEWAYS['default'];
    const gateway = config.gateways[Math.floor(Math.random() * config.gateways.length)];
    
    const params = new URLSearchParams();
    Object.entries(config.params).forEach(([key, values]) => {
        params.set(key, values[Math.floor(Math.random() * values.length)]);
    });
    
    return `${gateway}?${params.toString()}`;
}

// Use esta função no redirecionamento
function safeRedirect() {
    const country = detectUserCountry(); // Sua função existente
    setTimeout(() => {
        window.location.href = getRandomGateway(country);
    }, Math.random() * 3000 + 2000);
}
