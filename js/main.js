/* ============================================================
   KAREN DANIELA DÍAZ — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────
     1. DARK / LIGHT MODE
  ───────────────────────────────────────── */
  const themeBtn  = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const body      = document.body;

  const saved = localStorage.getItem('kd-theme') || 'dark';
  if (saved === 'light') {
    body.classList.add('light-mode');
    themeIcon.textContent = '☀️';
  }

  themeBtn.addEventListener('click', () => {
    body.classList.toggle('light-mode');
    const isLight = body.classList.contains('light-mode');
    themeIcon.textContent = isLight ? '☀️' : '🌙';
    localStorage.setItem('kd-theme', isLight ? 'light' : 'dark');
  });


  /* ─────────────────────────────────────────
     2. NAVBAR — scroll shrink + active link
  ───────────────────────────────────────── */
  const navbar   = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    // Shrink on scroll
    navbar.style.height = window.scrollY > 40 ? '52px' : '60px';

    // Active link
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 80) current = sec.id;
    });
    navLinks.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`);
    });
  }, { passive: true });

  // Hamburger
  const hamburger = document.getElementById('hamburger');
  const navMenu   = document.getElementById('nav-menu');
  hamburger?.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });
  navMenu?.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('open'));
  });


  /* ─────────────────────────────────────────
     3. HERO — CANVAS PARTÍCULAS (Red neuronal)
  ───────────────────────────────────────── */
  const canvas = document.getElementById('hero-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PARTICLE_COUNT = 70;
    const MAX_DIST = 130;

    class Particle {
      constructor() { this.reset(); }
      reset() {
        this.x  = Math.random() * W;
        this.y  = Math.random() * H;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r  = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > W) this.vx *= -1;
        if (this.y < 0 || this.y > H) this.vy *= -1;
      }
      draw() {
        const isLight = document.body.classList.contains('light-mode');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = isLight
          ? 'rgba(124,111,255,0.5)'
          : 'rgba(124,111,255,0.7)';
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    // Mouse repulsion
    let mouse = { x: -999, y: -999 };
    canvas.parentElement.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    const drawLines = () => {
      const isLight = document.body.classList.contains('light-mode');
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < MAX_DIST) {
            const alpha = (1 - d / MAX_DIST) * (isLight ? 0.25 : 0.35);
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124,111,255,${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        // Mouse repulsion
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 80) {
          p.vx += (dx / dist) * 0.3;
          p.vy += (dy / dist) * 0.3;
        }
        // Clamp velocity
        const speed = Math.hypot(p.vx, p.vy);
        if (speed > 2) { p.vx = (p.vx / speed) * 2; p.vy = (p.vy / speed) * 2; }

        p.update();
        p.draw();
      });
      drawLines();
      requestAnimationFrame(loop);
    };
    loop();
  }


  /* ─────────────────────────────────────────
     4. TYPEWRITER HERO
  ───────────────────────────────────────── */
  const typedEl = document.getElementById('typed-text');
  if (typedEl) {
    const roles = [
      'Desarrolladora Backend',
      'Python & FastAPI Developer',
      'API & ETL Specialist',
      'Automatización de Datos',
      'Full Stack en formación 🚀'
    ];
    let ri = 0, ci = 0, deleting = false;

    const type = () => {
      const role = roles[ri];
      typedEl.textContent = deleting ? role.slice(0, ci) : role.slice(0, ci);

      if (!deleting && ci < role.length) {
        ci++; setTimeout(type, 65);
      } else if (!deleting && ci === role.length) {
        deleting = true; setTimeout(type, 2000);
      } else if (deleting && ci > 0) {
        ci--; setTimeout(type, 35);
      } else {
        deleting = false;
        ri = (ri + 1) % roles.length;
        setTimeout(type, 400);
      }
    };
    setTimeout(type, 1000);
  }


  /* ─────────────────────────────────────────
     5. CONTADOR ANIMADO (CountUp)
  ───────────────────────────────────────── */
  const countUp = (el, target, suffix = '', duration = 1800) => {
    let start = null;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Hero stats (arrancan al cargar con delay)
  const heroStats = document.querySelectorAll('.hero-stat-num[data-count]');
  heroStats.forEach((el, i) => {
    setTimeout(() => {
      countUp(el, +el.dataset.count, el.dataset.suffix || '');
    }, 1400 + i * 200);
  });


  /* ─────────────────────────────────────────
     6. INTERSECTION OBSERVER — Reveal + barras
  ───────────────────────────────────────── */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('revealed');

      // Skill bars dentro del elemento
      el.querySelectorAll('.skill-fill[data-w]').forEach(bar => {
        setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, 300);
      });

      // CountUp dentro del elemento
      el.querySelectorAll('[data-count]').forEach(counter => {
        countUp(counter, +counter.dataset.count, counter.dataset.suffix || '');
      });

      revealIO.unobserve(el);
    });
  }, { threshold: 0.15 });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));


  /* ─────────────────────────────────────────
     7. SKILL BARS — Observer en la sección
  ───────────────────────────────────────── */
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skillsIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        document.querySelectorAll('.skill-fill[data-w]').forEach((bar, i) => {
          setTimeout(() => { bar.style.width = bar.dataset.w + '%'; }, i * 80);
        });
        skillsIO.unobserve(skillsSection);
      }
    }, { threshold: 0.2 });
    skillsIO.observe(skillsSection);
  }


  /* ─────────────────────────────────────────
     8. FILTRO DE SKILLS
  ───────────────────────────────────────── */
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.dataset.filter;

      document.querySelectorAll('.skill-card').forEach(card => {
        const match = cat === 'all' || card.dataset.cat === cat;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity    = match ? '1' : '0.2';
        card.style.transform  = match ? '' : 'scale(0.92)';
        card.style.pointerEvents = match ? '' : 'none';
      });
    });
  });


  /* ─────────────────────────────────────────
     9. CURSOR PERSONALIZADO
  ───────────────────────────────────────── */
  const dot  = document.querySelector('.cursor-dot');
  const ring = document.querySelector('.cursor-ring');

  if (dot && ring && window.matchMedia('(pointer: fine)').matches) {
    let rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      dot.style.left  = e.clientX - 3 + 'px';
      dot.style.top   = e.clientY - 3 + 'px';
      // Lag en el ring
      rx += (e.clientX - 16 - rx) * 0.12;
      ry += (e.clientY - 16 - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
    });

    // Efecto en hover de links/botones
    document.querySelectorAll('a, button, .skill-card, .proj-flip-wrapper').forEach(el => {
      el.addEventListener('mouseenter', () => {
        ring.style.width  = '48px';
        ring.style.height = '48px';
        ring.style.borderColor = 'rgba(0,212,170,0.6)';
      });
      el.addEventListener('mouseleave', () => {
        ring.style.width  = '32px';
        ring.style.height = '32px';
        ring.style.borderColor = 'rgba(124,111,255,0.5)';
      });
    });

    // Animación fluida del ring
    const animRing = () => {
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    };
    animRing();
  }


  /* ─────────────────────────────────────────
     10. SMOOTH SCROLL con offset de navbar
  ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 70;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });


  /* ─────────────────────────────────────────
     11. TIMELINE — línea animada al entrar
  ───────────────────────────────────────── */
  const timeline = document.querySelector('.timeline');
  if (timeline) {
    const tlIO = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        timeline.style.setProperty('--line-height', '100%');
        tlIO.unobserve(timeline);
      }
    }, { threshold: 0.1 });
    tlIO.observe(timeline);
  }

});