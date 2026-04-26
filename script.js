/* =====================================================
   RESO — Script
   Scroll system, nav state, interactions
   ===================================================== */

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// AOS init
AOS.init({
  duration: prefersReducedMotion ? 0 : 800,
  once: true,
  offset: 80,
  easing: 'ease-out-cubic',
  disable: prefersReducedMotion
});

// NAVBAR SCROLL STATE + ACTIVE LINKS
(function () {
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!navbar || !sections.length || !navLinks.length) return;

  function updateNavState() {
    const scrollPosition = window.scrollY;

    // navbar shrink
    navbar.classList.toggle('scrolled', scrollPosition > 60);

    // active link highlight
    let current = sections[0].getAttribute('id');

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      if (scrollPosition >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', isActive);
    });
  }

  updateNavState();
  window.addEventListener('scroll', updateNavState, { passive: true });
})();

// SMOOTH SCROLL
(function () {
  const anchors = document.querySelectorAll('a[href^="#"]');

  anchors.forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();

      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    });
  });
})();

// SUBTLE HERO PARALLAX
(function () {
  const hero = document.querySelector('.hero-section');
  if (!hero || prefersReducedMotion) return;

  function updateHeroParallax() {
    const offset = Math.min(window.scrollY * 0.12, 80);
    hero.style.setProperty('--hero-shift', `${offset}px`);
  }

  updateHeroParallax();
  window.addEventListener('scroll', updateHeroParallax, { passive: true });
})();

// CUSTOM CURSOR
(function () {
  if (prefersReducedMotion || window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.classList.add('custom-cursor');
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.classList.add('is-visible');
  });

  document.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-visible');
  });

  document.querySelectorAll('a, button, .origin-card, .feature-card').forEach(item => {
    item.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    item.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateCursor);
  }

  animateCursor();
})();
