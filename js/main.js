/* ============================================================
   MAIN.JS — Interactions communes à toutes les pages
   ============================================================ */

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