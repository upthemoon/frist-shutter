// ===== First Shutter — animations + gallery + lightbox =====

(function () {
  'use strict';

  // ===== 1. Loading animation =====
  function initLoading() {
    const overlay = document.getElementById('loadingOverlay');
    if (!overlay) return;

    // タイポを 1 文字ずつふわっと表示
    const textEl = overlay.querySelector('.loading-text');
    if (textEl && !textEl.dataset.split) {
      const text = textEl.textContent;
      textEl.dataset.split = '1';
      textEl.innerHTML = '';
      [...text].forEach((char, i) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? ' ' : char;
        span.style.animationDelay = `${i * 0.08}s`;
        textEl.appendChild(span);
      });
    }

    // 全文字表示 + 余韻後にフェードアウト
    setTimeout(() => {
      overlay.classList.add('hide');
    }, 2200);
  }

  // ===== 2. Hero slider (background image cross-fade) =====
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length < 2) return;
    let current = 0;
    setInterval(() => {
      slides[current].classList.remove('active');
      current = (current + 1) % slides.length;
      slides[current].classList.add('active');
    }, 7000);
  }

  // ===== 3. Scroll fade-in (Intersection Observer) =====
  function initFadeIn() {
    const items = document.querySelectorAll('.fade-in');
    if (items.length === 0 || !('IntersectionObserver' in window)) {
      items.forEach((i) => i.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -10% 0px' }
    );
    items.forEach((item) => observer.observe(item));
  }

  // ===== 4. Custom cursor (desktop only) =====
  function initCursor() {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    document.body.appendChild(cursor);
    document.body.classList.add('has-custom-cursor');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // smooth follow (lerp)
    function tick() {
      cursorX += (mouseX - cursorX) * 0.2;
      cursorY += (mouseY - cursorY) * 0.2;
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(tick);
    }
    tick();

    // hover state
    const hoverables = 'a, button, .gallery-item, .filter-tab, input, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverables)) cursor.classList.remove('hover');
    });
  }

  // ===== 5. Stat counter (count-up on scroll) =====
  function initCounter() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0 || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !entry.target.dataset.counted) {
            entry.target.dataset.counted = '1';
            const target = parseInt(entry.target.dataset.target, 10) || 0;
            const suffix = entry.target.dataset.suffix || '';
            const duration = 2000;
            const start = performance.now();

            function update(now) {
              const progress = Math.min((now - start) / duration, 1);
              // ease-out
              const eased = 1 - Math.pow(1 - progress, 3);
              const current = Math.floor(eased * target);
              entry.target.textContent = current.toLocaleString() + suffix;
              if (progress < 1) requestAnimationFrame(update);
            }
            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((c) => observer.observe(c));
  }

  // ===== 6. Portfolio: category filter =====
  function initGalleryFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const items = document.querySelectorAll('#galleryGrid .gallery-item');

    if (tabs.length === 0 || items.length === 0) return;

    tabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;
        tabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        items.forEach((item) => {
          const categories = (item.dataset.category || '').split(/\s+/);
          if (filter === 'all' || categories.includes(filter)) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  // ===== 7. Lightbox (Portfolio image enlarge) =====
  function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    if (!lightbox || !lightboxImg) return;

    document.querySelectorAll('.gallery-item').forEach((item) => {
      if (item.tagName.toLowerCase() === 'a') return;
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img && img.src) {
          lightboxImg.src = img.src;
          lightbox.classList.add('open');
        }
      });
    });

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
        lightbox.classList.remove('open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('open')) {
        lightbox.classList.remove('open');
      }
    });
  }

  // ===== Init =====
  document.addEventListener('DOMContentLoaded', () => {
    initLoading();
    initHeroSlider();
    initFadeIn();
    initCursor();
    initCounter();
    initGalleryFilter();
    initLightbox();
  });
})();
