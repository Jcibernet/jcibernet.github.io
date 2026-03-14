(function () {
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

    // Language: restore from localStorage or default to 'en'
    var langToggle = document.getElementById('langToggle');
    var currentLang = localStorage.getItem('lang') || 'en';

    function applyLang(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        document.documentElement.lang = lang;
        document.querySelectorAll('.lang-en').forEach(function (el) {
            el.hidden = lang !== 'en';
        });
        document.querySelectorAll('.lang-es').forEach(function (el) {
            el.hidden = lang !== 'es';
        });
    }

    // Apply saved language on load
    applyLang(currentLang);

    langToggle.addEventListener('click', function () {
        applyLang(currentLang === 'en' ? 'es' : 'en');
    });

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
