(function () {
    'use strict';

    // -----------------------------------------------------------------
    // Geo-redirect (only on EN root "/", and only if user has no cookie)
    // -----------------------------------------------------------------
    // Lightweight fallback in lieu of a Cloudflare Worker. Runs ASAP, before
    // most of the DOM is parsed (script is loaded near the bottom but does a
    // synchronous decision; if redirect happens, the rest of the page is
    // discarded by the navigation).
    var SPANISH_COUNTRIES = [
        'AR','BO','CL','CO','CR','CU','DO','EC','ES','GQ',
        'GT','HN','MX','NI','PA','PE','PR','PY','SV','UY','VE'
    ];

    function readCookie(name) {
        var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]+)'));
        return m ? decodeURIComponent(m[1]) : null;
    }
    function setCookie(name, value, days) {
        var d = new Date();
        d.setTime(d.getTime() + (days * 86400000));
        document.cookie = name + '=' + encodeURIComponent(value) +
            '; path=/; expires=' + d.toUTCString() + '; SameSite=Lax';
    }

    var path = window.location.pathname;
    var isRoot = (path === '/' || path === '/index.html');
    var isEs   = path.indexOf('/es/') === 0 || path === '/es';
    var prefLang = readCookie('pref_lang');

    // Persist explicit clicks on the language toggle as a cookie.
    document.addEventListener('click', function (e) {
        var a = e.target.closest && e.target.closest('a[data-set-lang]');
        if (a) {
            var lang = a.getAttribute('data-set-lang');
            if (lang === 'en' || lang === 'es') {
                setCookie('pref_lang', lang, 365);
            }
        }
    }, true);

    // Only redirect from the English root, never from /es/
    if (isRoot && !prefLang) {
        // 1.5s timeout: if geolocation fails or is slow, just stay on EN.
        var done = false;
        var timer = setTimeout(function () { done = true; }, 1500);

        try {
            fetch('https://ipapi.co/json/', { cache: 'force-cache' })
                .then(function (r) { return r.ok ? r.json() : null; })
                .then(function (data) {
                    if (done || !data || !data.country_code) return;
                    clearTimeout(timer);
                    if (SPANISH_COUNTRIES.indexOf(data.country_code) !== -1) {
                        // No need to set cookie: next visit will already be on /es/
                        // and the toggle there will set pref_lang if user goes back.
                        window.location.replace('/es/');
                    }
                })
                .catch(function () { /* silently ignore */ });
        } catch (_) { /* old browsers: stay on EN */ }
    }

    // -----------------------------------------------------------------
    // Page enhancements (run on DOM ready)
    // -----------------------------------------------------------------
    function ready(fn) {
        if (document.readyState !== 'loading') return fn();
        document.addEventListener('DOMContentLoaded', fn);
    }

    ready(function () {
        // Footer year (auto-updates)
        var yr = document.getElementById('footerYear');
        if (yr) yr.textContent = new Date().getFullYear();

        // Smooth scroll for in-page anchors
        document.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.addEventListener('click', function (e) {
                var target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Marquee: clone items for seamless infinite loop
        var track = document.querySelector('.marquee-track');
        if (track) track.innerHTML += track.innerHTML;

        // Featured grid: clone items for seamless infinite loop
        var featuredGrid = document.querySelector('.featured-grid');
        if (featuredGrid) featuredGrid.innerHTML += featuredGrid.innerHTML;

        // Contact form: minimal client-side validation
        var form = document.getElementById('contactForm');
        if (form) {
            var lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
            var msg = lang === 'es'
                ? 'Por favor completá todos los campos requeridos.'
                : 'Please fill in all required fields.';
            form.addEventListener('submit', function (e) {
                var name = document.getElementById('name');
                var email = document.getElementById('email');
                var challenge = document.getElementById('challenge');
                if (!name.value.trim() || !email.value.trim() || !challenge.value.trim()) {
                    e.preventDefault();
                    alert(msg);
                }
            });
        }
    });
})();
