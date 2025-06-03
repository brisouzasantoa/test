// Versão simplificada e compatível com seu quiz
console.log("GeoRedirect: Script carregado!");

const CONFIG = {
    debug: true,
    countryMapping: {
        'BR': ['/test/geo/br/home.html'], // URL corrigida para seu repositório
        'default': ['/test/geo/global/default.html']
    }
};

function redirectToGeoPage() {
    // Simulação de detecção de país (substitua pela sua API real)
    const country = 'BR'; // Para teste, force BR. Depois use APIs de geolocalização
    
    const targetUrl = CONFIG.countryMapping[country]?.[0] || CONFIG.countryMapping['default'][0];
    console.log(`Redirecionando para: ${targetUrl}`);
    
    // Redireciona após 3s (para testes)
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 3000);
}

// Inicia apenas se não estiver no index.html (para evitar loops)
if (!window.location.pathname.includes('index.html')) {
    redirectToGeoPage();
}
