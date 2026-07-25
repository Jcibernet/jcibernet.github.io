(function () {
    'use strict';

    // Privacy-preserving language redirect. Browser preference stays local:
    // no visitor IP or locale data is sent to a geolocation service.

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

    // Only redirect from the English root, never after an explicit choice.
    var browserLang = (navigator.languages && navigator.languages[0]) ||
        navigator.language || '';
    if (isRoot && !prefLang && browserLang.toLowerCase().indexOf('es') === 0) {
        window.location.replace('/es/');
    }

    // -----------------------------------------------------------------
    // Page enhancements (run on DOM ready)
    // -----------------------------------------------------------------
    function ready(fn) {
        if (document.readyState !== 'loading') return fn();
        document.addEventListener('DOMContentLoaded', fn);
    }

    // Explicit rendering keeps Turnstile responsive: flexible on regular
    // screens and compact where the fixed 300px widget would overflow.
    window.onTurnstileLoad = function () {
        var container = document.getElementById('turnstileWidget');
        if (!container || !window.turnstile) return;

        var compact = window.matchMedia &&
            window.matchMedia('(max-width: 480px)').matches;
        window.turnstile.render(container, {
            sitekey: container.getAttribute('data-sitekey'),
            theme: 'dark',
            size: compact ? 'compact' : 'flexible',
            language: (document.documentElement.lang || 'en').slice(0, 2)
        });
    };

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

        // Marquee + featured: clone items for seamless infinite loop.
        // Wrapped in rAF to avoid forced reflow on first paint (clones happen
        // off the critical rendering path, after the browser is idle).
        function cloneChildren(el) {
            if (!el) return;
            var clone = el.cloneNode(true);
            // Append clones (DOM range op, single reflow) to double the track
            while (clone.firstChild) el.appendChild(clone.firstChild);
        }
        requestAnimationFrame(function () {
            cloneChildren(document.querySelector('.marquee-track'));
            cloneChildren(document.querySelector('.featured-grid'));
        });

        // Contact form: layered client-side anti-abuse for the static site.
        // Formspree still performs the authoritative server-side filtering.
        var form = document.getElementById('contactForm');
        if (form) {
            var lang = (document.documentElement.lang || 'en').toLowerCase().slice(0, 2);
            var messages = lang === 'es' ? {
                name: 'Ingresá un nombre de al menos 2 caracteres.',
                details: 'Contame un poco más: el mensaje debe tener al menos 20 caracteres.',
                tooFast: 'Esperá unos segundos antes de enviar el mensaje.',
                repeated: 'El mensaje ya fue enviado. Esperá un minuto antes de volver a intentar.',
                links: 'Para evitar spam, el mensaje puede incluir como máximo dos enlaces.',
                blocked: 'No se pudo enviar el mensaje. Revisá los campos e intentá de nuevo.',
                captcha: 'Completá la verificación de seguridad antes de enviar.',
                sending: 'Enviando mensaje…'
            } : {
                name: 'Enter a name with at least 2 characters.',
                details: 'Please add some detail: the message must be at least 20 characters.',
                tooFast: 'Please wait a few seconds before sending the message.',
                repeated: 'That message was already sent. Please wait a minute before trying again.',
                links: 'To prevent spam, the message can include at most two links.',
                blocked: 'The message could not be sent. Check the fields and try again.',
                captcha: 'Complete the security verification before sending.',
                sending: 'Sending message…'
            };
            var status = document.getElementById('formStatus');
            var submit = form.querySelector('[type="submit"]');
            var trap = form.elements._gotcha;
            var name = form.elements.name;
            var challenge = form.elements.challenge;
            var turnstileWidget = document.getElementById('turnstileWidget');
            var loadedAt = Date.now();
            var interacted = false;
            var storageKey = 'contact-form-last-submit';

            function endpoint() {
                return ['https:', '', 'formspree.io', 'f', 'xwvrnkzy'].join('/');
            }

            function armForm() {
                if (!form.hasAttribute('action')) form.setAttribute('action', endpoint());
            }

            function recordInteraction(e) {
                if (!e.isTrusted) return;
                interacted = true;
                armForm();
            }

            function showError(e, message, field) {
                e.preventDefault();
                status.textContent = message;
                if (field) field.focus();
            }

            form.addEventListener('pointerdown', recordInteraction, { passive: true });
            form.addEventListener('keydown', recordInteraction);
            form.addEventListener('focusin', recordInteraction);
            form.addEventListener('input', function () {
                status.textContent = '';
            });

            form.addEventListener('submit', function (e) {
                var now = Date.now();
                var lastSubmit = 0;
                var links = challenge.value.match(/(?:https?:\/\/|www\.)\S+/gi) || [];
                var turnstileResponse = form.querySelector('[name="cf-turnstile-response"]');

                try {
                    lastSubmit = Number(window.localStorage.getItem(storageKey)) || 0;
                } catch (_) { /* storage may be disabled */ }

                if (trap.value) {
                    showError(e, messages.blocked);
                } else if (!interacted || now - loadedAt < 3000) {
                    showError(e, messages.tooFast);
                } else if (now - lastSubmit < 60000) {
                    showError(e, messages.repeated);
                } else if (name.value.trim().length < 2) {
                    showError(e, messages.name, name);
                } else if (challenge.value.trim().length < 20) {
                    showError(e, messages.details, challenge);
                } else if (links.length > 2) {
                    showError(e, messages.links, challenge);
                } else if (!turnstileResponse || !turnstileResponse.value) {
                    showError(e, messages.captcha);
                    turnstileWidget.scrollIntoView({ behavior: 'smooth', block: 'center' });
                } else {
                    armForm();
                    try {
                        window.localStorage.setItem(storageKey, String(now));
                    } catch (_) { /* storage may be disabled */ }
                    submit.disabled = true;
                    status.textContent = messages.sending;
                }
            });
        }
    });
})();
