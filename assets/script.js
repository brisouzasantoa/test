// Gera nome aleatório para notificações
function getRandomUsername() {
    const prefixes = ["Crypto", "Bitcoin", "Doge", "Trader", "Investor", "Miner", "HODL", "Blockchain"];
    const suffixes = ["King", "Master", "Pro", "Expert", "Guru", "Whale", "Hunter", "Lover"];
    return "@" + prefixes[Math.floor(Math.random() * prefixes.length)] +
           suffixes[Math.floor(Math.random() * suffixes.length)] +
           Math.floor(Math.random() * 100);
}

// Mostra notificação personalizada
function showPlatformNotification(platform, currency) {
    const username = getRandomUsername();
    let amount;
    if (currency === "BTC") {
        amount = (Math.random() * 0.005 + 0.0001).toFixed(8).replace(/\.?0+$/, "");
    } else if (currency === "DOGE") {
        amount = (Math.random() * 100 + 10).toFixed(2);
    } else if (currency === "RUB") {
        amount = Math.floor(Math.random() * 5000 + 1000);
    } else { // USD
        amount = (Math.random() * 15 + 1).toFixed(2);
    }
    showNotification({
        icon: "💸",
        badge: "WITHDRAWAL",
        message: `<strong>${username}</strong> earned <span style='color:#FFD700'>\$${amount} USD</span> on ${platform}!`,
        duration: 6000
    });
}

// Sistema de notificação
function showNotification(notif) {
    const containers = [document.getElementById('notificationContainerTop'), document.getElementById('notificationContainerBottom')];
    const container = containers[Math.floor(Math.random() * containers.length)];
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="notification-icon">${notif.icon}</div>
        <div class="notification-content">
            <span class="notification-badge">${notif.badge}</span>
            <p>${notif.message}</p>
        </div>
    `;
    container.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('active');
    }, 10);

    setTimeout(() => {
        notification.classList.add('exiting');
        setTimeout(() => {
            notification.remove();
        }, 400);
    }, notif.duration);
}

// Notificação rotativa
const notifications = [
    { icon: "💸", badge: "WITHDRAWAL", platform: "FaucetPay", currency: "DOGE", amount: (Math.random() * 5 + 0.5).toFixed(3) },
    { icon: "🔥", badge: "RECORD", platform: "FireFaucet", currency: "RUB", amount: Math.floor(Math.random() * 5000 + 1000) },
    { icon: "🎰", badge: "BONUS", platform: "Cointiply", currency: "BTC", amount: (Math.random() * 0.001 + 0.0005).toFixed(8).replace(/\.?0+$/, "") },
    { icon: "📈", badge: "PAYMENT", platform: "SeoFast", currency: "RUB", amount: Math.floor(Math.random() * 3000 + 500) },
    { icon: "📧", badge: "EMAIL", platform: "Wmmail", currency: "USD", amount: (Math.random() * 10 + 1).toFixed(2) },
    { icon: "👍", badge: "SOCIAL", platform: "SocialTools", currency: "BTC", amount: (Math.random() * 0.002 + 0.0003).toFixed(8).replace(/\.?0+$/, "") },
    { icon: "⚡", badge: "TASK", platform: "SeoSprint", currency: "RUB", amount: Math.floor(Math.random() * 2000 + 300) },
    { icon: "🌎", badge: "GLOBAL", platform: "ProfitCentr", currency: "BTC", amount: (Math.random() * 0.003 + 0.0007).toFixed(8).replace(/\.?0+$/, "") },
    { icon: "🌐", badge: "BROWSING", platform: "Web-IP", currency: "DOGE", amount: (Math.random() * 100 + 20).toFixed(2) },
    { icon: "🤖", badge: "AUTOMATIC", platform: "IpGold", currency: "USD", amount: (Math.random() * 15 + 2).toFixed(2) },
    { icon: "🎁", badge: "PRIZE", platform: "FreeBitco.in", currency: "BTC", amount: (Math.random() * 0.005 + 0.001).toFixed(8).replace(/\.?0+$/, "") },
    { icon: "💰", badge: "CLICK", platform: "ADBTC", currency: "BTC", amount: (Math.random() * 0.0005 + 0.0001).toFixed(8).replace(/\.?0+$/, "") }
];

let currentNotif = 0;

function rotateNotifications() {
    const notif = notifications[currentNotif];
    const username = getRandomUsername();
    showNotification({
        icon: notif.icon,
        badge: notif.badge,
        message: `<strong>${username}</strong> withdrew <span style='color:#FFD700'>${notif.amount} ${notif.currency}</span> via ${notif.platform}!`,
        duration: 7000
    });
    currentNotif = (currentNotif + 1) % notifications.length;
    setTimeout(rotateNotifications, 10000);
}

// Inicia animações ao carregar a página
window.addEventListener('load', () => {
    rotateNotifications();
    showNotification({
        icon: "👋",
        badge: "WELCOME",
        message: "Enjoy our <strong>recommended platforms</strong> to earn crypto!",
        duration: 5000
    });

    typeWriter();

    // Mostrar notificação lateral
    const side = document.getElementById("sideNotification");
    if (side) {
        setTimeout(() => {
            side.classList.add("show");
        }, 1000);
    }
});

// Animação do título
function typeWriter() {
    const title = document.querySelector('h1');
    const originalText = title.innerText;
    title.innerText = '';
    let i = 0;
    const typing = setInterval(() => {
        if (i < originalText.length) {
            title.innerText += originalText.charAt(i);
            i++;
        } else {
            clearInterval(typing);
        }
    }, 50);
}

// Cookie Consent
const cookieBanner = document.getElementById("cookieConsent");
if (!localStorage.getItem("cookiesAccepted")) {
    cookieBanner.style.display = "flex";
}
function acceptCookies() {
    localStorage.setItem("cookiesAccepted", "true");
    cookieBanner.style.display = "none";
}

// Notificações exclusivas para CPA Offers
function showCPAWithdrawal(platform, currency) {
    const username = getRandomCPAUsername();
    let amount;
    if (currency === "USD") {
        amount = (Math.random() * 50 + 0.1).toFixed(2);
    } else {
        amount = Math.floor(Math.random() * 1000 + 50);
    }
    showCPANotification({
        icon: "💸",
        badge: "WITHDRAWAL",
        message: `<strong>${username}</strong> earned <span style='color:#FFD700'>\$${amount} USD</span> on ${platform}!`,
        duration: 6000
    });
}

// Nome único para CPA Offers
function getRandomCPAUsername() {
    const prefixes = ["RewardsPro", "CashKing", "MobileMogul", "LeadHunter"];
    const suffixes = ["Player", "Expert", "Master", "Gamer"];
    return prefixes[Math.floor(Math.random() * prefixes.length)] +
           suffixes[Math.floor(Math.random() * suffixes.length)];
}

// Função para carregar rodapé dinamicamente
function loadFooter() {
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById("footer-placeholder").innerHTML = data;
            // Verifica se o cookie banner deve ser exibido
            const cookieBanner = document.getElementById("cookieConsent");
            if (!localStorage.getItem("cookiesAccepted") && cookieBanner) {
                cookieBanner.style.display = "flex";
            }
        })
        .catch(err => console.error("Footer load failed:", err));
}

// Função para aceitar cookies
function acceptCookies() {
    localStorage.setItem("cookiesAccepted", "true");
    const cookieBanner = document.getElementById("cookieConsent");
    if (cookieBanner) {
        cookieBanner.style.display = "none";
    }
}
