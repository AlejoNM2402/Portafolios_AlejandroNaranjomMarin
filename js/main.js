// =====================================================
//  portfolio.js — Portafolio Dev
//  Cursor · Loader · Nav · Reveals · Contadores
//  Barras de skills · Menú móvil · Formulario
// =====================================================

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCursor();
  initNav();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initSkillBars();
  initForm();
  initNavHighlight();
});

// ══════════════════════════════════════════════════
//  LOADER
// ══════════════════════════════════════════════════
function initLoader() {
  const loader     = document.getElementById('loader');
  const loaderText = document.getElementById('loaderText');
  if (!loader) return;

  let count = 0;
  const interval = setInterval(() => {
    count += Math.floor(Math.random() * 12) + 4;
    if (count >= 100) {
      count = 100;
      clearInterval(interval);
      loaderText.textContent = '100';

      setTimeout(() => {
        loader.classList.add('hidden');
        // Desbloquear scroll después del loader
        document.body.style.overflow = '';
        // Disparar animaciones del hero
        triggerHeroAnimations();
      }, 400);
    }
    loaderText.textContent = String(count).padStart(2, '0');
  }, 60);

  // Bloquear scroll mientras carga
  document.body.style.overflow = 'hidden';
}

function triggerHeroAnimations() {
  // Las animaciones del hero ya están en CSS con animation-delay
  // Aquí podemos añadir clase a elementos que lo necesiten
  document.querySelectorAll('[data-delay]').forEach(el => {
    el.style.animationPlayState = 'running';
  });
}

// ══════════════════════════════════════════════════
//  CURSOR PERSONALIZADO
// ══════════════════════════════════════════════════
function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top  = mouseY + 'px';
  });

  // Follower con lag suave
  function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    follower.style.left = followerX + 'px';
    follower.style.top  = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  // Hover en elementos interactivos
  const hoverEls = document.querySelectorAll('a, button, input, textarea, .project-card, .contact-item, .skill-cat');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

// ══════════════════════════════════════════════════
//  NAV — fondo al hacer scroll
// ══════════════════════════════════════════════════
function initNav() {
  const nav = document.getElementById('nav');
  if (!nav) return;

  const update = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', update, { passive: true });
  update();
}

// ══════════════════════════════════════════════════
//  HIGHLIGHT ACTIVO EN NAV
// ══════════════════════════════════════════════════
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id], .hero[id]');
  const links    = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      links.forEach(l => {
        l.style.color = l.getAttribute('href') === `#${id}` ? 'var(--green)' : '';
      });
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

// ══════════════════════════════════════════════════
//  MENÚ MÓVIL
// ══════════════════════════════════════════════════
function initMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const menu   = document.getElementById('mobileMenu');
  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    document.body.style.overflow = isOpen ? 'hidden' : '';

    // Animar hamburguesa → X
    const spans = toggle.querySelectorAll('span');
    if (isOpen) {
      spans[0].style.cssText = 'transform: rotate(45deg) translate(4px, 4px)';
      spans[1].style.cssText = 'transform: rotate(-45deg) translate(4px, -4px)';
    } else {
      spans[0].style.cssText = '';
      spans[1].style.cssText = '';
    }
  });
}

window.closeMobile = () => {
  const menu   = document.getElementById('mobileMenu');
  const toggle = document.getElementById('navToggle');
  if (!menu) return;
  menu.classList.remove('open');
  document.body.style.overflow = '';
  if (toggle) {
    toggle.querySelectorAll('span').forEach(s => s.style.cssText = '');
  }
};

// ══════════════════════════════════════════════════
//  SCROLL REVEAL
// ══════════════════════════════════════════════════
function initScrollReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (!entry.isIntersecting) return;
      // Stagger si hay varios en el mismo contenedor
      const siblings = entry.target.parentElement?.querySelectorAll('.reveal') || [];
      let delay = 0;
      siblings.forEach((sib, idx) => {
        if (sib === entry.target) delay = idx * 80;
      });
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════
//  CONTADORES ANIMADOS
// ══════════════════════════════════════════════════
function initCounters() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target);
      if (!target) return;

      const dur  = 1600;
      const step = 16;
      const inc  = target / (dur / step);
      let current = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════
//  BARRAS DE HABILIDADES
// ══════════════════════════════════════════════════
function initSkillBars() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Animar todas las barras dentro de la sección visible
      entry.target.querySelectorAll('.skill-fill').forEach((bar, i) => {
        const width = bar.dataset.width || '0';
        setTimeout(() => {
          bar.style.width = width + '%';
        }, i * 120);
      });
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-cat').forEach(el => observer.observe(el));
}

// ══════════════════════════════════════════════════
//  FORMULARIO
// ══════════════════════════════════════════════════
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');

    // Estado de envío
    btn.textContent = 'Enviando...';
    btn.style.opacity = '.7';
    btn.disabled = true;

    // Simulación (reemplaza con tu lógica real)
    setTimeout(() => {
      btn.innerHTML = '✓ Mensaje enviado';
      btn.style.opacity = '1';
      btn.style.background = '#00c96b';

      // Reset después de 3s
      setTimeout(() => {
        form.reset();
        btn.innerHTML = `Enviar mensaje <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 8l12-6-6 12-2-4-4-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }, 1400);
  });
}

// ══════════════════════════════════════════════════
//  SMOOTH SCROLL para links internos
// ══════════════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});