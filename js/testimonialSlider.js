window.addEventListener('partialsLoaded', function () {

  (function () {
    // ---------- TESTIMONIAL DATA (stored in JS) ----------

    const testimonialsData = [
      {
        quote: "You are a dedicated developer with a passion  for coding and tech. His enthusiasm is contagious, and his strong work ethics ensures great results. He is a team player who brings energy and ideas to every project, making him a valueable asset to any team.",
        name: "Fusi",
        role: "Marketing Management",
        image: "../../images/imgs/img-1.jpg",
        color: "#D4537E",
        rating: 5
      },
      {
        quote: "He is a highly skilled programmer with  a keen eye for detail and passion for delivering top-notch solutioms.",
        name: "Bongs",
        role: "Trucker Driver",
        image: "../../images/imgs/img-1.jpg",
        color: "#D4537E",
        rating: 5
      },
      {
        quote: "He writes clean, effecient code and is a valuable as asset to any developement team.",
        name: "Justice",
        role: "Java Developer",
        image: "../../images/imgs/img-1.jpg",
        color: "#D4537E",
        rating: 5
      }
    ];

    // Helper: generate avatar initials (first letter of first name and last name)
    function getInitials(fullName) {
      const nameParts = fullName.trim().split(' ');
      if (nameParts.length === 1) return nameParts[0].substring(0, 2).toUpperCase();
      const firstInitial = nameParts[0].charAt(0);
      const lastInitial = nameParts[nameParts.length - 1].charAt(0);
      return (firstInitial + lastInitial).toUpperCase();
    }

    // Helper: generate star SVG group based on rating (1-5)
    function generateStars(rating) {
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
          starsHtml += `<svg class="ts-star" viewBox="0 0 16 16" aria-hidden="true"><polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,12 3.5,15 5,9.5 1,6 6,6"/></svg>`;
        } else {
          starsHtml += `<svg class="ts-star ts-star-empty" viewBox="0 0 16 16" aria-hidden="true" fill="#e2e8f0"><polygon points="8,1 10,6 15,6 11,9.5 12.5,15 8,12 3.5,15 5,9.5 1,6 6,6"/></svg>`;
        }
      }
      return starsHtml;
    }

    // Generate all slides HTML from data array
    function buildSlidesHTML() {
      return testimonialsData.map(item => {
        const initials = getInitials(item.name);
        const starsHtml = generateStars(item.rating);

        const avatarHtml = item.image
          ? `<img class="ts-avatar ts-avatar-img" src="${item.image}" alt="${escapeHtml(item.name)}">`
          : `<div class="ts-avatar" style="background: ${item.color};">${initials}</div>`;

        return `
      <div class="ts-slide" data-color="${item.color}" data-index="${testimonialsData.indexOf(item)}">
        <span class="ts-quote-mark" style="color: ${item.color};">"</span>
        <p class="ts-quote">${escapeHtml(item.quote)}</p>
        <hr class="ts-divider" style="background: ${item.color};">
        <div class="ts-author">
          ${avatarHtml}
          <div>
            <p class="ts-name">${escapeHtml(item.name)}</p>
            <p class="ts-role">${escapeHtml(item.role)}</p>
          </div>
          <div class="ts-stars" aria-label="${item.rating} out of 5 stars">
            ${starsHtml}
          </div>
        </div>
      </div>
    `;
      }).join('');
    }

    // simple XSS protection
    function escapeHtml(str) {
      return str.replace(/[&<>]/g, function (m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
      }).replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, function (c) {
        return c;
      });
    }

    // DOM elements
    const track = document.getElementById('track');
    const dotsContainer = document.getElementById('dots');
    const prevBtn = document.getElementById('prev');
    const nextBtn = document.getElementById('next');
    const container = document.querySelector('.ts-track-container');

    let currentIndex = 0;
    let autoInterval = null;
    let isTransitioning = false;
    let pendingVisibleTimeout = null;
    let transitionEndHandler = null;
    let slides = [];

    // ---------- SLIDER LOGIC (fully dynamic) ----------
    function updateDotsActive() {
      const dots = document.querySelectorAll('.ts-dot');
      dots.forEach((dot, i) => {
        if (i === currentIndex) dot.classList.add('active');
        else dot.classList.remove('active');
      });
    }

    function buildDotsFromSlides() {
      dotsContainer.innerHTML = '';
      slides.forEach((_, idx) => {
        const dot = document.createElement('button');
        dot.className = 'ts-dot' + (idx === currentIndex ? ' active' : '');
        dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
        dot.setAttribute('data-index', idx);
        dot.addEventListener('click', (e) => {
          e.stopPropagation();
          if (!isTransitioning) goToSlide(idx);
        });
        dotsContainer.appendChild(dot);
      });
    }

    function hideAllVisibility() {
      slides.forEach(slide => slide.classList.remove('visible'));
    }

    function clearPendingTimeout() {
      if (pendingVisibleTimeout) {
        clearTimeout(pendingVisibleTimeout);
        pendingVisibleTimeout = null;
      }
    }

    function resetAutoTimer() {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(() => {
        if (!isTransitioning && slides.length) {
          goToSlide(currentIndex + 1);
        }
      }, 4500);
    }

    function goToSlide(targetIndex) {
      if (isTransitioning || !slides.length) return;
      let newIndex = (targetIndex + slides.length) % slides.length;
      if (newIndex === currentIndex) return;

      isTransitioning = true;
      clearPendingTimeout();

      // fade out current slide
      if (slides[currentIndex]) slides[currentIndex].classList.remove('visible');

      const oldIndex = currentIndex;
      currentIndex = newIndex;

      // re-trigger quote mark animation on incoming slide
      const quoteMark = slides[currentIndex]?.querySelector('.ts-quote-mark');

      if (quoteMark) {
        quoteMark.style.animation = 'none';
        quoteMark.offsetHeight; 
        quoteMark.style.animation = '';
      }

      // apply track transform
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      updateDotsActive();

      // schedule fade-in for new slide after minor delay for smoothness
      pendingVisibleTimeout = setTimeout(() => {
        if (slides[currentIndex]) slides[currentIndex].classList.add('visible');
        pendingVisibleTimeout = null;
      }, 45);

      // clean up previous transitionend listener
      if (transitionEndHandler) {
        track.removeEventListener('transitionend', transitionEndHandler);
      }
      transitionEndHandler = () => {
        if (isTransitioning) {
          isTransitioning = false;
          if (slides[currentIndex] && !slides[currentIndex].classList.contains('visible')) {
            slides[currentIndex].classList.add('visible');
          }
          clearPendingTimeout();
        }
        track.removeEventListener('transitionend', transitionEndHandler);
        transitionEndHandler = null;
      };
      track.addEventListener('transitionend', transitionEndHandler);

      // safety fallback
      setTimeout(() => {
        if (isTransitioning) {
          isTransitioning = false;
          if (transitionEndHandler) {
            track.removeEventListener('transitionend', transitionEndHandler);
            transitionEndHandler = null;
          }
          clearPendingTimeout();
          if (slides[currentIndex] && !slides[currentIndex].classList.contains('visible')) {
            slides[currentIndex].classList.add('visible');
          }
        }
      }, 680);

      resetAutoTimer();
    }

    // Initialize after building dynamic slides
    function initSlider() {
      if (!track) return;
      // inject slides into track
      track.innerHTML = buildSlidesHTML();
      slides = Array.from(track.children);
      if (!slides.length) return;

      // initial visible setup
      slides.forEach((slide, idx) => {
        if (idx === 0) slide.classList.add('visible');
        else slide.classList.remove('visible');
      });
      track.style.transform = 'translateX(0%)';
      currentIndex = 0;
      isTransitioning = false;

      buildDotsFromSlides();
      updateDotsActive();

      // attach event listeners for prev/next
      prevBtn.onclick = () => { if (!isTransitioning) goToSlide(currentIndex - 1); };
      nextBtn.onclick = () => { if (!isTransitioning) goToSlide(currentIndex + 1); };

      // keyboard navigation
      window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          if (!isTransitioning) goToSlide(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          if (!isTransitioning) goToSlide(currentIndex + 1);
        }
      });

      // swipe support
      let touchStartX = 0;
      if (container) {
        container.addEventListener('touchstart', (e) => {
          touchStartX = e.touches[0].clientX;
        }, { passive: true });
        container.addEventListener('touchend', (e) => {
          if (isTransitioning) return;
          const deltaX = e.changedTouches[0].clientX - touchStartX;
          if (Math.abs(deltaX) > 40) {
            if (deltaX > 0) goToSlide(currentIndex - 1);
            else goToSlide(currentIndex + 1);
          }
          touchStartX = 0;
        });
      }

      // hover / focus pause auto
      const sliderCard = document.querySelector('.ts-track-container');
      if (sliderCard) {
        sliderCard.addEventListener('mouseenter', () => {
          if (autoInterval) clearInterval(autoInterval);
        });
        sliderCard.addEventListener('mouseleave', () => {
          if (autoInterval) clearInterval(autoInterval);
          autoInterval = setInterval(() => {
            if (!isTransitioning) goToSlide(currentIndex + 1);
          }, 4500);
        });
        const focusBtns = [prevBtn, nextBtn, ...document.querySelectorAll('.ts-dot')];
        focusBtns.forEach(btn => {
          if (btn) {
            btn.addEventListener('focus', () => {
              if (autoInterval) clearInterval(autoInterval);
            });
            btn.addEventListener('blur', () => {
              if (autoInterval) clearInterval(autoInterval);
              autoInterval = setInterval(() => {
                if (!isTransitioning) goToSlide(currentIndex + 1);
              }, 4500);
            });
          }
        });
      }

      resetAutoTimer();
    }

    // Edge case: if window resizes, keep transformation correct
    window.addEventListener('resize', () => {
      if (!isTransitioning && slides.length) {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
      }
    });

    // start everything
    initSlider();
  })();
});