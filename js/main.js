// =====================================================
//  portfolio.js — Alejandro Naranjo Marín
//  Parallax · Loader · Nav · Reveals · Contadores
//  Menú móvil · Formulario · Smooth scroll
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initParallax();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initForm();
  initSmoothScroll();
});

// ══════════════════════════════════════════════════
//  LOADER
// ══════════════════════════════════════════════════
function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  if (!loader) return;

  document.body.style.overflow = 'hidden';

  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 16 + 4;
    if (width >= 100) {
      width = 100;
      if (fill) fill.style.width = '100%';
      clearInterval(interval);
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 380);
    } else {
      if (fill) fill.style.width = width + '%';
    }
  }, 55);
}

// ══════════════════════════════════════════════════
//  PARALLAX
// ══════════════════════════════════════════════════
function initParallax() {
  // No en móvil
  if (window.matchMedia('(max-width: 900px)').matches) return;

  const layers = Array.from(document.querySelectorAll('.parallax-bg')).map(bg => ({
    bg,
    section: bg.closest('.parallax-section'),
  })).filter(l => l.section);

  if (!layers.length) return;

  function update() {
    const scrollY = window.scrollY;
    layers.forEach(({ bg, section }) => {
      const rect   = section.getBoundingClientRect();
      const top    = rect.top + scrollY;
      const height = section.offsetHeight;

      if (rect.bottom < -120 || rect.top > window.innerHeight + 120) return;

      const progress = (scrollY - top + window.innerHeight) / (height + window.innerHeight);
      const offset   = (progress - 0.5) * -14;
      bg.style.transform = `translateY(${offset}%)`;
    });
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { update(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  update();
}

// ══════════════════════════════════════════════════
//  NAV
// ══════════════════════════════════════════════════
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;
  const update = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ══════════════════════════════════════════════════
//  MENÚ MÓVIL
// ══════════════════════════════════════════════════
function initMobileMenu() {
  const toggle   = document.getElementById('navToggle');
  const menu     = document.getElementById('mobileMenu');
  const closeBtn = document.getElementById('mobileClose');
  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
    const spans = toggle.querySelectorAll('span');
    spans[0].style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
    spans[1].style.cssText = 'opacity:0;transform:translateX(-8px)';
    spans[2].style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
  }

  function closeMenu() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
    toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  }

  toggle.addEventListener('click', () =>
    menu.classList.contains('open') ? closeMenu() : openMenu()
  );

  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
}

window.closeMobile = () => {
  const menu   = document.getElementById('mobileMenu');
  const toggle = document.getElementById('navToggle');
  if (menu) menu.classList.remove('open');
  document.body.style.overflow = '';
  if (toggle) toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
};

// ══════════════════════════════════════════════════
//  SCROLL REVEAL con stagger
// ══════════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const parent   = entry.target.parentElement;
      const siblings = parent
        ? Array.from(parent.querySelectorAll('.reveal-up, .reveal-left, .reveal-right'))
        : [];
      const idx   = siblings.indexOf(entry.target);
      const delay = idx >= 0 ? idx * 90 : 0;

      setTimeout(() => entry.target.classList.add('visible'), delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right')
    .forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════
//  CONTADORES
// ══════════════════════════════════════════════════
function initCounters() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      if (!target) return;

      const dur  = 1600;
      const step = 16;
      const inc  = target / (dur / step);
      let cur    = 0;

      const timer = setInterval(() => {
        cur += inc;
        if (cur >= target) { cur = target; clearInterval(timer); }
        el.textContent = Math.floor(cur);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.6 });

  document.querySelectorAll('.trust-num, .stat-num').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════
//  FORMULARIO
// ══════════════════════════════════════════════════
function initForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  if (!form || !submitBtn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    let valid = true;
    form.querySelectorAll('[required]').forEach(input => {
      if (!input.value.trim()) {
        valid = false;
        input.style.borderColor = '#ff4d6d';
        input.addEventListener('input', () => { input.style.borderColor = ''; }, { once: true });
      }
    });
    if (!valid) return;

    const original = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
           style="animation:spinBtn .8s linear infinite;flex-shrink:0">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" opacity=".2"/>
        <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
      Enviando...`;
    submitBtn.disabled      = true;
    submitBtn.style.opacity = '.8';

    // Reemplaza este setTimeout con tu lógica real (EmailJS, fetch, etc.)
    setTimeout(() => {
      submitBtn.innerHTML         = '✓ ¡Listo! Te respondo pronto 🎉';
      submitBtn.style.opacity     = '1';
      submitBtn.style.background  = '#00c96b';
      form.reset();

      setTimeout(() => {
        submitBtn.innerHTML        = original;
        submitBtn.style.background = '';
        submitBtn.disabled         = false;
      }, 4000);
    }, 1600);
  });
}

// ══════════════════════════════════════════════════
//  SMOOTH SCROLL
// ══════════════════════════════════════════════════
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navH = document.getElementById('nav')?.offsetHeight || 64;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

// Keyframe spinner inyectado
const style = document.createElement('style');
style.textContent = `@keyframes spinBtn { to { transform: rotate(360deg); } }`;
document.head.appendChild(style);