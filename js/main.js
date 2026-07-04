/* ============================================================
   MAIN.JS — Interactions communes à toutes les pages
   ============================================================ */

/* --- Version du site
   Source unique : ne changer que cette valeur, le footer de
   chaque page se met à jour tout seul au chargement. --- */
const SITE_VERSION = 'v1.2';

document.querySelectorAll('.footer-version').forEach(el => {
    el.textContent = SITE_VERSION;
});

/* --- Menu mobile --- */
const toggle   = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
    });
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', false);
        });
    });
}

/* --- Ombre nav au scroll --- */
const navWrapper = document.querySelector('.nav-wrapper');
if (navWrapper) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navWrapper.style.boxShadow = window.scrollY > 20
                    ? '0 4px 32px rgba(0,0,0,0.5)'
                    : 'none';
                ticking = false;
            });
            ticking = true;
        }
    });
}

/* --- Étincelles animées dans le hero
   Génération continue de petits points magenta qui filent d'un point
   de départ vers un point d'arrivée aléatoire (mais proche, pour une
   trajectoire cohérente), en laissant une légère traînée derrière eux.
   Plafonnée à 10 simultanées pour rester léger. --- */
const sparkleContainer = document.querySelector('.hero .sparkles');

if (sparkleContainer && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const MAX_SPARKLES   = 10;
    const SPAWN_INTERVAL = 350; /* ms entre chaque tentative d'apparition */

    setInterval(() => {
        if (sparkleContainer.children.length >= MAX_SPARKLES) return;

        const sparkle = document.createElement('span');
        sparkle.className = 'sparkle';

        const angle    = Math.random() * Math.PI * 2; /* direction de vol */
        const distance = 30 + Math.random() * 50;     /* 30px à 80px parcourus */
        const dx  = Math.cos(angle) * distance;
        const dy  = Math.sin(angle) * distance;
        const rot = (angle * 180 / Math.PI) + 90;     /* aligne la traînée sur la trajectoire */

        const length   = 8 + Math.random() * 6; /* 8px à 14px de long */
        const duration = 1 + Math.random() * 2;  /* 1s à 3s */

        sparkle.style.left    = `${Math.random() * 100}%`;
        sparkle.style.top     = `${Math.random() * 100}%`;
        sparkle.style.height  = `${length}px`;
        sparkle.style.setProperty('--dx', `${dx}px`);
        sparkle.style.setProperty('--dy', `${dy}px`);
        sparkle.style.setProperty('--rot', `${rot}deg`);
        sparkle.style.animationDuration = `${duration}s`;

        sparkle.addEventListener('animationend', () => sparkle.remove());
        sparkleContainer.appendChild(sparkle);
    }, SPAWN_INTERVAL);
}

/* --- Formulaire de contact (Netlify Forms)
   Netlify gère l'envoi côté serveur.
   On intercepte la soumission en JS pour :
   1. Masquer le formulaire
   2. Afficher un message de confirmation
   Sans ce JS, Netlify redirigerait vers sa page de succès
   par défaut — moins élégant. --- */
const form    = document.querySelector('.form');
const success = document.getElementById('formSuccess');

if (form && success) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault(); /* empêche le rechargement de page par défaut */

        const data = new FormData(form);

        try {
            /* fetch envoie les données à Netlify en arrière-plan
               sans quitter la page. */
            await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(data).toString()
            });

            /* Succès : masque le formulaire, affiche la confirmation */
            form.style.display    = 'none';
            success.classList.add('is-visible');

        } catch (err) {
            /* En cas d'erreur réseau : laisse le formulaire visible
               et affiche une alerte simple */
            alert('Une erreur est survenue. Merci de réessayer ou de m\'écrire directement à contact@deskeo-tech.fr');
        }
    });
}