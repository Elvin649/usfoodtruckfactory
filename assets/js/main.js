/* ==========================================================================
   US Food Truck Factory — site behaviour
   Vanilla JS, no dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var ready = function (fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  };

  /* ---------------------------------------------------------------- header */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;

    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ------------------------------------------------------------ mobile nav */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var nav = document.getElementById('main-nav');
    if (!toggle || !nav) return;

    var close = function () {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
      nav.classList.remove('is-open');
      document.body.classList.remove('nav-open');
    };

    toggle.addEventListener('click', function () {
      if (toggle.getAttribute('aria-expanded') === 'true') return close();
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close menu');
      nav.classList.add('is-open');
      document.body.classList.add('nav-open');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 900) close();
    });
  }

  /* -------------------------------------------------------------- carousel */
  function initCarousels() {
    document.querySelectorAll('[data-carousel]').forEach(function (root) {
      var track = root.querySelector('[data-carousel-track]');
      var prev = root.querySelector('[data-carousel-prev]');
      var next = root.querySelector('[data-carousel-next]');
      var dotsBox = root.querySelector('[data-carousel-dots]');
      if (!track) return;

      var slides = Array.prototype.slice.call(track.children);
      if (!slides.length) return;

      var index = 0;

      var gap = function () {
        var cs = getComputedStyle(track);
        var g = parseFloat(cs.columnGap || cs.gap);
        return isNaN(g) ? 24 : g;
      };

      var perView = function () {
        var slideW = slides[0].getBoundingClientRect().width;
        if (!slideW) return 1;
        var viewW = track.parentElement.getBoundingClientRect().width;
        return Math.max(1, Math.round((viewW + gap()) / (slideW + gap())));
      };

      var maxIndex = function () {
        return Math.max(0, slides.length - perView());
      };

      var buildDots = function () {
        if (!dotsBox) return;
        dotsBox.innerHTML = '';
        var total = maxIndex() + 1;
        if (total < 2) return;
        for (var i = 0; i < total; i++) {
          var b = document.createElement('button');
          b.type = 'button';
          b.setAttribute('role', 'tab');
          b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
          b.dataset.goto = String(i);
          dotsBox.appendChild(b);
        }
      };

      var render = function () {
        var max = maxIndex();
        if (index > max) index = max;
        if (index < 0) index = 0;

        var step = slides[0].getBoundingClientRect().width + gap();
        track.style.transform = 'translateX(' + (-index * step) + 'px)';

        if (prev) prev.disabled = index === 0;
        if (next) next.disabled = index >= max;

        if (dotsBox) {
          Array.prototype.forEach.call(dotsBox.children, function (dot, i) {
            dot.setAttribute('aria-current', i === index ? 'true' : 'false');
          });
        }
      };

      var go = function (i) { index = i; render(); };

      if (prev) prev.addEventListener('click', function () { go(index - 1); });
      if (next) next.addEventListener('click', function () { go(index + 1); });

      if (dotsBox) {
        dotsBox.addEventListener('click', function (e) {
          var btn = e.target.closest('button[data-goto]');
          if (btn) go(parseInt(btn.dataset.goto, 10));
        });
      }

      root.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); }
      });

      var startX = 0, startY = 0, tracking = false;
      track.addEventListener('touchstart', function (e) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        tracking = true;
      }, { passive: true });

      track.addEventListener('touchend', function (e) {
        if (!tracking) return;
        tracking = false;
        var dx = e.changedTouches[0].clientX - startX;
        var dy = e.changedTouches[0].clientY - startY;
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
          go(dx < 0 ? index + 1 : index - 1);
        }
      }, { passive: true });

      var rebuild = function () { buildDots(); render(); };

      var t;
      window.addEventListener('resize', function () {
        clearTimeout(t);
        t = setTimeout(rebuild, 150);
      });
      window.addEventListener('load', rebuild);

      rebuild();
    });
  }

  /* ------------------------------------------------------ gallery + filter */
  function initGallery() {
    var grid = document.querySelector('[data-gallery]');
    if (!grid) return;

    var items = Array.prototype.slice.call(grid.querySelectorAll('.gallery-item'));
    var bar = document.querySelector('[data-filter-bar]');

    /* -- filter ---------------------------------------------------------- */
    if (bar) {
      bar.addEventListener('click', function (e) {
        var btn = e.target.closest('button[data-filter]');
        if (!btn) return;

        var want = btn.dataset.filter;
        bar.querySelectorAll('button').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b === btn));
        });
        items.forEach(function (item) {
          item.hidden = !(want === 'all' || item.dataset.category === want);
        });
      });
    }

    /* -- lightbox -------------------------------------------------------- */
    var box = document.querySelector('[data-lightbox]');
    if (!box) return;

    box.removeAttribute('hidden');

    var img = box.querySelector('[data-lightbox-img]');
    var caption = box.querySelector('[data-lightbox-caption]');
    var btnClose = box.querySelector('[data-lightbox-close]');
    var btnPrev = box.querySelector('[data-lightbox-prev]');
    var btnNext = box.querySelector('[data-lightbox-next]');

    var current = 0;
    var lastFocus = null;

    var visible = function () {
      return items.filter(function (i) { return !i.hidden; });
    };

    var show = function (i) {
      var list = visible();
      if (!list.length) return;
      current = (i + list.length) % list.length;

      var item = list[current];
      var source = item.querySelector('img');
      var cap = item.querySelector('figcaption');

      /* the grid serves a small thumbnail; data-full points at the original */
      img.src = source.getAttribute('data-full') || source.currentSrc || source.src;
      img.alt = source.alt || '';
      caption.textContent = cap ? cap.textContent.trim() : '';
    };

    var open = function (item) {
      lastFocus = document.activeElement;
      show(visible().indexOf(item));
      box.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      btnClose.focus();
    };

    var close = function () {
      box.classList.remove('is-open');
      document.body.style.overflow = '';
      img.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    grid.addEventListener('click', function (e) {
      var item = e.target.closest('.gallery-item');
      if (item) open(item);
    });

    grid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var item = e.target.closest('.gallery-item');
      if (!item) return;
      e.preventDefault();
      open(item);
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { show(current - 1); });
    btnNext.addEventListener('click', function () { show(current + 1); });

    box.addEventListener('click', function (e) {
      if (e.target === box) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(current - 1);
      if (e.key === 'ArrowRight') show(current + 1);
      if (e.key === 'Tab') {
        /* keep focus inside the dialog */
        var focusable = [btnClose, btnPrev, btnNext];
        var idx = focusable.indexOf(document.activeElement);
        e.preventDefault();
        var nextIdx = e.shiftKey ? idx - 1 : idx + 1;
        focusable[(nextIdx + focusable.length) % focusable.length].focus();
      }
    });
  }

  /* ----------------------------------------------------------------- forms */
  function initForms() {
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    var INBOX = 'info@usfoodtruckfactory.com';

    /* A form posts to data-endpoint once one is configured. While it reads
       "TODO" we compose the message and hand it to the visitor's mail client.
       The form's own action="mailto:…" is the no-JavaScript fallback. */
    function endpointOf(form) {
      var url = (form.getAttribute('data-endpoint') || '').trim();
      return (!url || url === 'TODO') ? null : url;
    }

    document.querySelectorAll('[data-form]').forEach(function (form) {
      var status = form.querySelector('[data-form-status]');

      var setError = function (field, message) {
        var slot = form.querySelector('[data-error-for="' + field.id + '"]');
        if (slot) slot.textContent = message || '';
        if (message) field.setAttribute('aria-invalid', 'true');
        else field.removeAttribute('aria-invalid');
      };

      var validateField = function (field) {
        var value = (field.value || '').trim();
        var label = form.querySelector('label[for="' + field.id + '"]');
        var name = label ? label.textContent.replace('*', '').trim() : 'This field';

        if (field.required && !value) {
          setError(field, name + ' is required.');
          return false;
        }
        if (field.type === 'email' && value && !EMAIL.test(value)) {
          setError(field, 'Enter a valid email address.');
          return false;
        }
        if (field.type === 'tel' && value && value.replace(/\D/g, '').length < 7) {
          setError(field, 'Enter a valid phone number.');
          return false;
        }
        setError(field, '');
        return true;
      };

      var fields = Array.prototype.slice.call(
        form.querySelectorAll('input[id], select[id], textarea[id]')
      ).filter(function (f) { return f.name !== '_gotcha'; });

      fields.forEach(function (field) {
        field.addEventListener('blur', function () { validateField(field); });
        field.addEventListener('input', function () {
          if (field.getAttribute('aria-invalid') === 'true') validateField(field);
        });
      });

      var say = function (message, kind) {
        if (!status) return;
        status.textContent = message;
        status.className = 'form-status is-shown form-status--' + kind;
      };

      var mailtoFallback = function () {
        var lines = [];
        fields.forEach(function (field) {
          var value = (field.value || '').trim();
          if (!value) return;
          var label = form.querySelector('label[for="' + field.id + '"]');
          var name = label ? label.textContent.replace('*', '').trim() : field.name;
          lines.push(name + ': ' + value);
        });

        var subject = 'Website enquiry — ' + (document.title.split('|')[0] || '').trim();
        window.location.href = 'mailto:' + INBOX +
          '?subject=' + encodeURIComponent(subject) +
          '&body=' + encodeURIComponent(lines.join('\n'));

        say('Opening your email app with the message ready to send. ' +
            'If nothing happens, email ' + INBOX + ' directly.', 'ok');
      };

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        /* honeypot — a bot filled the hidden field */
        var trap = form.querySelector('[name="_gotcha"]');
        if (trap && trap.value) {
          say('Thanks — your message has been sent.', 'ok');
          return;
        }

        var firstBad = null;
        fields.forEach(function (field) {
          if (!validateField(field) && !firstBad) firstBad = field;
        });

        if (firstBad) {
          say('Please fix the highlighted fields and try again.', 'err');
          firstBad.focus();
          return;
        }

        var action = endpointOf(form);

        /* No endpoint configured yet — hand off to the visitor's email client. */
        if (!action) {
          mailtoFallback();
          return;
        }

        var button = form.querySelector('button[type="submit"]');
        var originalText = button ? button.textContent : '';
        if (button) { button.disabled = true; button.textContent = 'Sending…'; }
        say('Sending your message…', 'ok');

        fetch(action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        }).then(function (res) {
          if (!res.ok) throw new Error('bad status ' + res.status);
          form.reset();
          fields.forEach(function (f) { setError(f, ''); });
          say('Thanks — your message has been sent. We will be in touch within one business day.', 'ok');
        }).catch(function () {
          /* The endpoint did not answer - a static host with no PHP behind it,
             or the server is down. Rather than dead-ending the visitor, hand
             the message to their mail client exactly as we do when no endpoint
             is configured at all. */
          mailtoFallback();
        }).then(function () {
          if (button) { button.disabled = false; button.textContent = originalText; }
        });
      });
    });
  }

  /* ------------------------------------------------------- prefill from URL */
  function initPrefill() {
    var params = new URLSearchParams(window.location.search);
    if (!params.toString()) return;

    var message = document.querySelector('textarea[name="message"]');
    var topic = document.getElementById('c-topic');

    var unit = params.get('unit');
    var part = params.get('part');
    var subject = params.get('topic');

    if (message && !message.value) {
      if (unit) message.value = 'I am interested in the ' + unit.replace(/-/g, ' ') + ' listing.';
      else if (part) message.value = 'I would like a price on: ' + part.replace(/-/g, ' ') + '.';
      else if (subject === 'financing') message.value = 'I would like to know more about financing.';
    }

    if (topic && subject === 'financing') topic.value = 'Financing';
    if (topic && unit) topic.value = 'A unit for sale';
    if (topic && part) topic.value = 'Parts & equipment';
  }

  /* ---------------------------------------------------------- scroll reveal */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

    items.forEach(function (el, i) {
      /* stagger the reveal animation — NOT the transition, which belongs to
         the component and drives its hover effects */
      el.style.animationDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  }

  /* -------------------------------------------------------------- footer yr */
  function initYear() {
    document.querySelectorAll('[data-year]').forEach(function (el) {
      el.textContent = String(new Date().getFullYear());
    });
  }

  ready(function () {
    initHeader();
    initNav();
    initCarousels();
    initGallery();
    initForms();
    initPrefill();
    initReveal();
    initYear();
  });
})();
