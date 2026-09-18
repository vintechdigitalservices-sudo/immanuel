/* ============================================================
   Emmanuel Chukwemeka — Portfolio
   ============================================================ */
(function () {
  'use strict';

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', function () {
      links.classList.toggle('is-open');
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('is-open'); });
    });
  }

  /* ---------- Nav background on scroll ---------- */
  var nav = document.querySelector('.nav');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      nav.style.background = 'rgba(2,8,23,.9)';
    } else {
      nav.style.background = 'rgba(2,8,23,.65)';
    }
  }, { passive: true });

  /* ---------- Scroll reveal + triggers ---------- */
  var reveals = document.querySelectorAll('.reveal');
  var skills = document.querySelectorAll('.skill');
  var stats = document.querySelectorAll('.stat-card__num');

  function animateCount(el) {
    var target = parseInt(el.getAttribute('data-count'), 10) || 0;
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1600;
    var start = performance.now();

    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function fillSkill(el) {
    var level = el.getAttribute('data-level');
    var bar = el.querySelector('.skill__fill');
    if (bar) bar.style.width = level + '%';
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;

        if (el.classList.contains('reveal')) el.classList.add('is-visible');
        if (el.classList.contains('skill')) fillSkill(el);
        if (el.classList.contains('stat-card__num')) animateCount(el);

        io.unobserve(el);
      });
    }, { threshold: 0.18, rootMargin: '0px 0px -60px 0px' });

    reveals.forEach(function (el) { io.observe(el); });
    skills.forEach(function (el) { io.observe(el); });
    stats.forEach(function (el) { io.observe(el); });
  } else {
    // Fallback: show everything
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
    skills.forEach(fillSkill);
    stats.forEach(function (el) {
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix') || '');
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var note = document.getElementById('formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      note.textContent = '✓ Message ready — connect this form to your backend or Formspree.';
      note.style.color = '#4ade80';
      form.reset();
      setTimeout(function () { note.textContent = ''; }, 6000);
    });
  }

  /* ---------- Animated grid + nodes background ---------- */
  var canvas = document.getElementById('bg-grid');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w, h, cols, rows;
  var spacing = 64;
  var nodes = [];
  var mouse = { x: -9999, y: -9999 };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildNodes();
  }

  function buildNodes() {
    nodes = [];
    cols = Math.ceil(w / spacing) + 1;
    rows = Math.ceil(h / spacing) + 1;
    var count = Math.min(28, Math.max(12, Math.round((w * h) / 55000)));
    for (var i = 0; i < count; i++) {
      nodes.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 1.8 + 0.8
      });
    }
  }

  function drawGrid() {
    ctx.save();
    ctx.strokeStyle = 'rgba(96,165,250,0.055)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var x = 0; x <= w; x += spacing) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (var y = 0; y <= h; y += spacing) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();
    ctx.restore();
  }

  function drawNodes() {
    ctx.save();
    for (var i = 0; i < nodes.length; i++) {
      var a = nodes[i];
      if (!reduceMotion) {
        a.x += a.vx;
        a.y += a.vy;
        if (a.x < 0 || a.x > w) a.vx *= -1;
        if (a.y < 0 || a.y > h) a.vy *= -1;
      }

      // Connections
      for (var j = i + 1; j < nodes.length; j++) {
        var b = nodes[j];
        var dx = a.x - b.x, dy = a.y - b.y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 180) {
          ctx.strokeStyle = 'rgba(96,165,250,' + (0.14 * (1 - dist / 180)) + ')';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Mouse link
      var mdx = a.x - mouse.x, mdy = a.y - mouse.y;
      var mdist = Math.sqrt(mdx * mdx + mdy * mdy);
      if (mdist < 200) {
        ctx.strokeStyle = 'rgba(96,165,250,' + (0.28 * (1 - mdist / 200)) + ')';
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
      }

      // Node glow
      ctx.beginPath();
      ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(96,165,250,0.7)';
      ctx.shadowColor = 'rgba(96,165,250,0.9)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    ctx.restore();
  }

  var rafId;
  function loop() {
    ctx.clearRect(0, 0, w, h);
    drawGrid();
    drawNodes();
    rafId = requestAnimationFrame(loop);
  }

  window.addEventListener('resize', function () {
    cancelAnimationFrame(rafId);
    resize();
    loop();
  });

  window.addEventListener('mousemove', function (e) {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });
  window.addEventListener('mouseleave', function () {
    mouse.x = -9999; mouse.y = -9999;
  });

  resize();
  loop();
})();