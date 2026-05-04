(function () {
    // Footer year (auto-updates)
    var yr = document.getElementById('footerYear');
    if (yr) yr.textContent = new Date().getFullYear();

    // Smooth scroll for CTA buttons
    document.querySelectorAll('a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // ----- Language detection -----
    // Priority:
    //   1) User's explicit choice (localStorage key 'lang')
    //   2) IP geolocation (Spanish-speaking countries -> 'es')
    //   3) Browser's Accept-Language header
    //   4) Default 'en'
    var langToggle = document.getElementById('langToggle');
    var SPANISH_COUNTRIES = [
        'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ',
        'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE'
    ];
    var currentLang = 'en';

    function applyLang(lang, persist) {
        currentLang = lang;
        if (persist) {
            localStorage.setItem('lang', lang);
        }
        document.documentElement.lang = lang;
        document.querySelectorAll('.lang-en').forEach(function (el) {
            el.hidden = lang !== 'en';
        });
        document.querySelectorAll('.lang-es').forEach(function (el) {
            el.hidden = lang !== 'es';
        });
    }

    function detectFromBrowser() {
        var langs = (navigator.languages && navigator.languages.length)
            ? navigator.languages
            : [navigator.language || navigator.userLanguage || 'en'];
        for (var i = 0; i < langs.length; i++) {
            if (/^es\b/i.test(langs[i])) return 'es';
            if (/^en\b/i.test(langs[i])) return 'en';
        }
        return 'en';
    }

    function detectFromIP() {
        // Free, no-key, CORS-enabled GeoIP service. Times out fast.
        return new Promise(function (resolve) {
            var done = false;
            var t = setTimeout(function () {
                if (!done) { done = true; resolve(null); }
            }, 1500);
            fetch('https://ipapi.co/json/', { cache: 'force-cache' })
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (data) {
                    if (done) return;
                    done = true;
                    clearTimeout(t);
                    if (!data || !data.country_code) return resolve(null);
                    resolve(SPANISH_COUNTRIES.indexOf(data.country_code) !== -1 ? 'es' : 'en');
                })
                .catch(function () {
                    if (done) return;
                    done = true;
                    clearTimeout(t);
                    resolve(null);
                });
        });
    }

    var savedLang = localStorage.getItem('lang');
    if (savedLang === 'en' || savedLang === 'es') {
        // User already chose: respect it.
        applyLang(savedLang, false);
    } else {
        // First visit: instant browser-based guess, then refine with IP.
        applyLang(detectFromBrowser(), false);
        detectFromIP().then(function (ipLang) {
            if (ipLang && !localStorage.getItem('lang')) {
                applyLang(ipLang, false);
            }
        });
    }

    langToggle.addEventListener('click', function () {
        // Clicking the toggle is an explicit user choice -> persist it.
        applyLang(currentLang === 'en' ? 'es' : 'en', true);
    });

    // Marquee: clone items for seamless infinite loop
    var track = document.querySelector('.marquee-track');
    if (track) {
        var items = track.innerHTML;
        track.innerHTML = items + items;
    }

    // Featured grid: clone items for seamless infinite loop
    var featuredGrid = document.querySelector('.featured-grid');
    if (featuredGrid) {
        var items = featuredGrid.innerHTML;
        featuredGrid.innerHTML = items + items;
    }

    // Form: validate
    var form = document.getElementById('contactForm');
    form.addEventListener('submit', function (e) {
        var name = document.getElementById('name').value.trim();
        var email = document.getElementById('email').value.trim();
        var challenge = document.getElementById('challenge').value.trim();

        if (!name || !email || !challenge) {
            e.preventDefault();
            var msg = currentLang === 'en'
                ? 'Please fill in all required fields.'
                : 'Por favor completa todos los campos requeridos.';
            alert(msg);
        }
    });
})();
