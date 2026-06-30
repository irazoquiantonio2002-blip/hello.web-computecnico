/* ==========================================================================
   COMPUTÉCNICA REPARACIONES — main.js
   Motor de animaciones premium con Anime.js + JS nativo
   ========================================================================== */

(function () {
    'use strict';

    /* ------------------------------------------------------------------
       1. LOADER — controla la pantalla de carga inicial
       ------------------------------------------------------------------ */
    function initLoader() {
        var loader = document.getElementById('page-loader');
        if (!loader) return;

        var dismiss = function () {
            loader.classList.add('out');
            setTimeout(function () {
                loader.style.display = 'none';
                runHeroEntrance();
            }, 700);
        };

        // Esperar al menos 2s para que se vea el loader, luego esperar carga
        var minWait = new Promise(function (res) { setTimeout(res, 2000); });
        var pageLoad = new Promise(function (res) {
            if (document.readyState === 'complete') res();
            else window.addEventListener('load', res);
        });

        Promise.all([minWait, pageLoad]).then(dismiss);
    }

    /* ------------------------------------------------------------------
       2. HERO ENTRANCE — animaciones de entrada con Anime.js
       ------------------------------------------------------------------ */
    function runHeroEntrance() {
        var badge    = document.getElementById('js-hero-badge');
        var titleEl  = document.getElementById('js-hero-title');
        var sub      = document.getElementById('js-hero-sub');
        var ctas     = document.getElementById('js-hero-ctas');
        var visual   = document.getElementById('js-hero-visual');
        var stats    = document.getElementById('js-hero-stats');
        var trust    = document.getElementById('js-hero-trust');
        var chip1    = document.getElementById('js-chip1');
        var chip2    = document.getElementById('js-chip2');
        var chip3    = document.getElementById('js-chip3');
        var chip4    = document.getElementById('js-chip4');

        var tl = anime.timeline({ easing: 'easeOutExpo' });

        // Badge de confianza
        tl.add({
            targets: badge,
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            begin: function () { if (badge) badge.classList.add('in'); }
        }, 0);

        // Líneas del título
        if (titleEl) {
            var lines = titleEl.querySelectorAll('.hero-title-line, .hero-title-accent');
            tl.add({
                targets: lines,
                opacity: [0, 1],
                translateY: [44, 0],
                duration: 800,
                delay: anime.stagger(150),
                begin: function () { lines.forEach(function (l) { l.classList.add('in'); }); }
            }, 150);
        }

        // Subtítulo
        tl.add({
            targets: sub,
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            begin: function () { if (sub) sub.classList.add('in'); }
        }, 500);

        // Botones CTA
        tl.add({
            targets: ctas,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            begin: function () { if (ctas) ctas.classList.add('in'); }
        }, 700);

        // Visual (imagen)
        tl.add({
            targets: visual,
            opacity: [0, 1],
            translateY: [36, 0],
            scale: [0.96, 1],
            duration: 900,
            easing: 'easeOutBack',
            begin: function () { if (visual) visual.classList.add('in'); }
        }, 400);

        // Chips flotantes en cascada
        var chips = [chip1, chip2, chip3, chip4].filter(Boolean);
        tl.add({
            targets: chips,
            opacity: [0, 1],
            duration: 600,
            delay: anime.stagger(180, { start: 0 }),
            begin: function () { chips.forEach(function (c) { c.classList.add('in'); }); }
        }, 900);

        // Stats con conteo
        tl.add({
            targets: stats,
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            begin: function () {
                if (stats) {
                    stats.classList.add('in');
                    animateCounters();
                }
            }
        }, 1100);

        // Trust items
        tl.add({
            targets: trust,
            opacity: [0, 1],
            translateY: [16, 0],
            duration: 600,
            begin: function () { if (trust) trust.classList.add('in'); }
        }, 1300);
    }

    /* ------------------------------------------------------------------
       3. CONTADORES ANIMADOS
       ------------------------------------------------------------------ */
    function animateCounters() {
        var nums = document.querySelectorAll('.hstat-num[data-count]');
        nums.forEach(function (el) {
            var target   = parseInt(el.getAttribute('data-count'), 10);
            var duration = 1800;
            anime({
                targets: el,
                innerHTML: [0, target],
                duration: duration,
                easing: 'easeOutExpo',
                round: 1
            });
        });
    }

    /* ------------------------------------------------------------------
       4b. CHISPAS ELÉCTRICAS — efecto lightning/spark en el hero
       ------------------------------------------------------------------ */
    function initSparks() {
        var canvas = document.getElementById('sparks-canvas');
        if (!canvas) return;
        var ctx = canvas.getContext('2d');
        var W, H;

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        /* --- Partículas de chispa --- */
        var sparkPool = [];

        function createSpark() {
            var x  = Math.random() * W;
            var y  = Math.random() * H;
            var angle = Math.random() * Math.PI * 2;
            var speed = Math.random() * 3.5 + 1;
            // Color: blanco / azul eléctrico / naranja
            var palette = [
                'rgba(255,255,255,',
                'rgba(130,200,255,',
                'rgba(255,200,80,',
                'rgba(240,94,22,'
            ];
            var col = palette[Math.floor(Math.random() * palette.length)];

            return {
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                decay: Math.random() * 0.03 + 0.018,
                size: Math.random() * 2.2 + 0.5,
                color: col,
                tail: [],
                tailLen: Math.floor(Math.random() * 5 + 3)
            };
        }

        /* --- Rayos (lightning bolt) --- */
        var lightnings = [];
        var nextLightning = 0;

        function spawnLightning() {
            var x1 = Math.random() * W;
            var y1 = Math.random() * H * 0.5;
            var segs = [];
            var cx = x1, cy = y1;
            var segCount = Math.floor(Math.random() * 8 + 5);

            for (var i = 0; i < segCount; i++) {
                var nx = cx + (Math.random() - 0.5) * 80;
                var ny = cy + Math.random() * 60 + 20;
                segs.push({ x1: cx, y1: cy, x2: nx, y2: ny });
                cx = nx; cy = ny;
            }

            lightnings.push({
                segs: segs,
                life: 1,
                decay: 0.08 + Math.random() * 0.06,
                width: Math.random() * 1.5 + 0.5
            });

            // Expulsar chispas en el punto de origen
            for (var j = 0; j < 12; j++) {
                var sp = createSpark();
                sp.x = x1; sp.y = y1;
                sp.size = Math.random() * 3 + 1;
                sp.decay = 0.04 + Math.random() * 0.04;
                sparkPool.push(sp);
            }
        }

        /* --- Loop de dibujo --- */
        var lastTime = 0;
        function draw(ts) {
            requestAnimationFrame(draw);
            ctx.clearRect(0, 0, W, H);

            /* Spawner de chispas aleatorias */
            if (sparkPool.length < 80 && Math.random() < 0.35) {
                sparkPool.push(createSpark());
            }

            /* Spawner de rayos cada ~2-4 s */
            if (ts - nextLightning > 0) {
                nextLightning = ts + 1800 + Math.random() * 2200;
                spawnLightning();
            }

            /* Dibujar chispas */
            for (var i = sparkPool.length - 1; i >= 0; i--) {
                var s = sparkPool[i];

                // Guardar cola
                s.tail.push({ x: s.x, y: s.y });
                if (s.tail.length > s.tailLen) s.tail.shift();

                // Dibujar cola
                if (s.tail.length > 1) {
                    ctx.beginPath();
                    ctx.moveTo(s.tail[0].x, s.tail[0].y);
                    for (var t = 1; t < s.tail.length; t++) {
                        ctx.lineTo(s.tail[t].x, s.tail[t].y);
                    }
                    ctx.strokeStyle = s.color + (s.life * 0.25) + ')';
                    ctx.lineWidth   = s.size * 0.4;
                    ctx.stroke();
                }

                // Dibujar punto brillante
                var grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.size * 3);
                grd.addColorStop(0, s.color + s.life + ')');
                grd.addColorStop(1, s.color + '0)');
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.size * 3, 0, Math.PI * 2);
                ctx.fillStyle = grd;
                ctx.fill();

                // Física
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.04;   // gravedad leve
                s.vx *= 0.97;
                s.life -= s.decay;

                if (s.life <= 0) sparkPool.splice(i, 1);
            }

            /* Dibujar rayos */
            for (var li = lightnings.length - 1; li >= 0; li--) {
                var bolt = lightnings[li];
                ctx.save();
                ctx.globalAlpha = bolt.life;

                // Halo exterior suave
                ctx.shadowBlur  = 20;
                ctx.shadowColor = 'rgba(130,200,255,0.9)';
                ctx.strokeStyle = 'rgba(200,230,255,' + (bolt.life * 0.6) + ')';
                ctx.lineWidth   = bolt.width * 4;
                ctx.lineCap     = 'round';
                ctx.beginPath();
                bolt.segs.forEach(function (seg, idx) {
                    if (idx === 0) ctx.moveTo(seg.x1, seg.y1);
                    ctx.lineTo(seg.x2, seg.y2);
                });
                ctx.stroke();

                // Núcleo brillante
                ctx.shadowBlur  = 8;
                ctx.shadowColor = '#fff';
                ctx.strokeStyle = 'rgba(255,255,255,' + bolt.life + ')';
                ctx.lineWidth   = bolt.width;
                ctx.beginPath();
                bolt.segs.forEach(function (seg, idx) {
                    if (idx === 0) ctx.moveTo(seg.x1, seg.y1);
                    ctx.lineTo(seg.x2, seg.y2);
                });
                ctx.stroke();
                ctx.restore();

                bolt.life -= bolt.decay;
                if (bolt.life <= 0) lightnings.splice(li, 1);
            }
        }

        requestAnimationFrame(draw);
    }

    /* ------------------------------------------------------------------
       4. PARTÍCULAS EN CANVAS
       ------------------------------------------------------------------ */
    function initParticles() {
        var canvas = document.getElementById('hero-canvas');
        if (!canvas) return;

        var ctx = canvas.getContext('2d');
        var W, H, particles = [];

        function resize() {
            W = canvas.width  = canvas.offsetWidth;
            H = canvas.height = canvas.offsetHeight;
        }
        resize();
        window.addEventListener('resize', resize, { passive: true });

        var count = window.innerWidth < 600 ? 28 : 55;
        for (var i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * W,
                y: Math.random() * H,
                r: Math.random() * 1.8 + 0.4,
                vx: (Math.random() - .5) * .35,
                vy: -(Math.random() * .45 + .15),
                o: Math.random() * .35 + .08,
                fd: Math.random() > .5 ? 1 : -1
            });
        }

        function draw() {
            ctx.clearRect(0, 0, W, H);
            particles.forEach(function (p) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,255,255,' + p.o + ')';
                ctx.fill();

                p.x += p.vx;
                p.y += p.vy;
                p.o += p.fd * .0015;
                if (p.o > .45 || p.o < .06) p.fd *= -1;

                if (p.y < -8) { p.y = H + 8; p.x = Math.random() * W; }
                if (p.x < -8) p.x = W + 8;
                if (p.x > W + 8) p.x = -8;
            });
            requestAnimationFrame(draw);
        }
        draw();
    }

    /* ------------------------------------------------------------------
       5. PARALLAX DE MOUSE en el hero
       ------------------------------------------------------------------ */
    function initMouseParallax() {
        var hero   = document.querySelector('.hero');
        var img    = document.getElementById('js-hero-img');
        var orb1   = document.querySelector('.orb-1');
        var orb2   = document.querySelector('.orb-2');
        var orb3   = document.querySelector('.orb-3');
        if (!hero) return;

        var mx = 0, my = 0, cx = 0, cy = 0;

        hero.addEventListener('mousemove', function (e) {
            var r = hero.getBoundingClientRect();
            mx = ((e.clientX - r.left) / r.width  - .5) * 2;
            my = ((e.clientY - r.top)  / r.height - .5) * 2;
        }, { passive: true });

        hero.addEventListener('mouseleave', function () { mx = 0; my = 0; });

        function lerp(a, b, t) { return a + (b - a) * t; }

        function tick() {
            cx = lerp(cx, mx, .055);
            cy = lerp(cy, my, .055);

            if (img) img.style.transform = [
                'translate(' + (cx * 10) + 'px,' + (cy * 7) + 'px)',
                'rotateY(' + (cx * 2.5) + 'deg)',
                'rotateX(' + (-cy * 1.5) + 'deg)'
            ].join(' ');

            if (orb1) orb1.style.transform = 'translate(' + (-cx * 22) + 'px,' + (-cy * 18) + 'px)';
            if (orb2) orb2.style.transform = 'translate(' + ( cx * 15) + 'px,' + ( cy * 12) + 'px)';
            if (orb3) orb3.style.transform = 'translate(' + (-cx *  8) + 'px,' + ( cy * 10) + 'px)';

            requestAnimationFrame(tick);
        }
        tick();
    }

    /* ------------------------------------------------------------------
       6. SCROLL REVEAL — secciones inferiores con Anime.js
       ------------------------------------------------------------------ */
    function initScrollReveal() {
        var items = document.querySelectorAll('.reveal');
        if (!items.length) return;

        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                var el    = entry.target;
                var delay = parseInt(el.getAttribute('data-delay') || '0', 10);

                anime({
                    targets: el,
                    opacity: [0, 1],
                    translateY: [32, 0],
                    duration: 750,
                    delay: delay,
                    easing: 'easeOutExpo',
                    begin: function () { el.classList.add('visible'); }
                });

                observer.unobserve(el);
            });
        }, { threshold: 0.12 });

        items.forEach(function (el) { observer.observe(el); });
    }

    /* ------------------------------------------------------------------
       7. HEADER — sombra al hacer scroll
       ------------------------------------------------------------------ */
    function initHeaderScroll() {
        var header = document.getElementById('main-header');
        if (!header) return;
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) header.classList.add('scrolled');
            else header.classList.remove('scrolled');
        }, { passive: true });
    }

    /* ------------------------------------------------------------------
       8. MENÚ MÓVIL
       ------------------------------------------------------------------ */
    function initMobileMenu() {
        var toggle = document.getElementById('nav-toggle');
        var links  = document.getElementById('nav-links');
        if (!toggle || !links) return;

        toggle.addEventListener('click', function () {
            var open = links.classList.toggle('open');
            toggle.classList.toggle('open', open);
            toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        });

        // Cerrar al hacer click en un enlace
        links.querySelectorAll('a').forEach(function (a) {
            a.addEventListener('click', function () {
                links.classList.remove('open');
                toggle.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    /* ------------------------------------------------------------------
       9. EFECTO RIPPLE en botones
       ------------------------------------------------------------------ */
    function initRipple() {
        document.querySelectorAll('.btn-ripple').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var rect = btn.getBoundingClientRect();
                var size = Math.max(rect.width, rect.height);
                var el   = document.createElement('span');
                el.classList.add('ripple-el');
                el.style.cssText = [
                    'width:'  + size + 'px',
                    'height:' + size + 'px',
                    'left:'   + (e.clientX - rect.left  - size / 2) + 'px',
                    'top:'    + (e.clientY - rect.top   - size / 2) + 'px'
                ].join(';');
                btn.appendChild(el);
                setTimeout(function () { el.remove(); }, 700);
            });
        });
    }

    /* ------------------------------------------------------------------
       10. HOVER 3D en tarjetas de servicio
       ------------------------------------------------------------------ */
    function initCardTilt() {
        document.querySelectorAll('.service-card, .benefit-card').forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = (e.clientX - rect.left) / rect.width  - .5;
                var y = (e.clientY - rect.top)  / rect.height - .5;
                card.style.transform = [
                    'translateY(-10px)',
                    'rotateX(' + (-y * 6) + 'deg)',
                    'rotateY(' + ( x * 6) + 'deg)'
                ].join(' ');
                card.style.transition = 'transform .1s ease';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transition = 'transform .4s var(--ease-out), box-shadow .4s ease';
                card.style.transform  = '';
            });
        });
    }

    /* ------------------------------------------------------------------
       11. FORMULARIO — redirige al WhatsApp
       ------------------------------------------------------------------ */
    function initContactForm() {
        var form = document.getElementById('contact-form');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var nombre   = (form.querySelector('#cf-name')    || {}).value  || '';
            var telefono = (form.querySelector('#cf-phone')   || {}).value  || '';
            var servicio = (form.querySelector('#cf-service') || {}).value  || '';
            var mensaje  = (form.querySelector('#cf-msg')     || {}).value  || '';

            var text = [
                'Hola, soy *' + nombre + '*.',
                servicio  ? 'Necesito: *' + servicio + '*.' : '',
                mensaje   ? 'Detalle: ' + mensaje : '',
                telefono  ? 'Mi teléfono: ' + telefono : ''
            ].filter(Boolean).join('\n');

            var url = 'https://wa.me/526141694189?text=' + encodeURIComponent(text);
            window.open(url, '_blank', 'noopener');
        });
    }

    /* ------------------------------------------------------------------
       12. ANIMACIÓN FLOTANTE DEL BOTÓN DE WHATSAPP
       ------------------------------------------------------------------ */
    function initWaFloat() {
        var btn = document.getElementById('wa-float');
        if (!btn || typeof anime === 'undefined') return;

        // Aparece desde abajo después de 2.5s
        anime({
            targets: btn,
            opacity: [0, 1],
            translateY: [40, 0],
            duration: 700,
            delay: 2500,
            easing: 'easeOutBack'
        });
    }

    /* ------------------------------------------------------------------
       ARRANQUE PRINCIPAL
       ------------------------------------------------------------------ */
    document.addEventListener('DOMContentLoaded', function () {
        initHeaderScroll();
        initMobileMenu();
        initRipple();
        initScrollReveal();
        initCardTilt();
        initContactForm();
        initParticles();
        initSparks();
        initMouseParallax();
        initWaFloat();
    });

    // El loader se inicia inmediatamente (no espera DOMContentLoaded)
    initLoader();

})();
