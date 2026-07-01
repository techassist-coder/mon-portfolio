/* ============================================================
   MAIN.JS — Interactions de la page
   Chargé en bas du <body> pour ne pas bloquer l'affichage
   du HTML et du CSS pendant le téléchargement du script.
   ============================================================ */

/* --- Menu mobile hamburger ---

   On récupère les éléments du DOM une seule fois
   et on les stocke dans des variables (plus performant
   que d'appeler document.querySelector à chaque clic).
*/
const toggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (toggle && navLinks) {

    toggle.addEventListener('click', () => {

        /* La classe is-open contrôle la visibilité du menu
           via CSS (translateX). On évite de modifier le style
           directement en JS — c'est le CSS qui fait le rendu. */
        const isOpen = navLinks.classList.toggle('is-open');

        /* aria-expanded informe les technologies d'assistance
           (lecteurs d'écran) que le menu est ouvert ou fermé. */
        toggle.setAttribute('aria-expanded', isOpen);
    });

    /* Ferme le menu si on clique sur un lien de navigation —
       évite que le menu reste ouvert après avoir changé de section. */
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            toggle.setAttribute('aria-expanded', false);
        });
    });
}

/* --- Ombre de navigation au scroll ---

   On ajoute une ombre à la nav quand la page a scrollé,
   pour renforcer la séparation visuelle avec le contenu.
   requestAnimationFrame optimise la performance en
   synchronisant avec le cycle de rendu du navigateur. */
const navWrapper = document.querySelector('.nav-wrapper');

if (navWrapper) {
    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 20) {
                    navWrapper.style.boxShadow = '0 4px 32px rgba(0,0,0,0.4)';
                } else {
                    navWrapper.style.boxShadow = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    });
}
