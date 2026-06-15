window.addEventListener('partialsLoaded', function () {

  const experiences = [
    {
      title: "Junior Full-Stack Developer",
      dateStart: "Oct 2025",
      dateEnd: "Present",
      company: "Proto Care (Pty) Ltd",
      location: "Cape Town, RSA",
      mobileLimit: 2,
      bullets: [
        "Redesigned notifications & alerts system, reducing missed form submissions.",
        "Built scheduled notification service with exponential backoff retries.",
        "Developed secure mental health platform for patient assessment forms.",
        "Built hormonal balance monitoring module tracking six health categories.",
        "Implemented body measurements backend with auto-calculated health metrics."
      ],
      tags: ["C#", "Blazor", "PostgreSQL", "Swagger", "Postman", "JavaScript"],
      detailedExplanation: "As a Junior Full-Stack Developer at Proto Care, I built and maintained several full-stack features including a scheduled notification service, mental health, hormonal balance, and body measurements on the backend. This role strengthened my skills in API design, full-stack development, and delivering health-focused features end to end."
    },
    {
      title: "IT Technician",
      dateStart: "Sept 2018",
      dateEnd: "Jan 2019",
      company: "Olehile Investment Pty (Ltd)",
      location: "Pretoria, RSA",
      mobileLimit: 2,
      bullets: [
        "Installed and maintained Office 365 in hospital environments.",
        "Configured POS devices."
      ],
      tags: ["Office 365", "POS Devices", "Help Desk"],
      detailedExplanation: "I learned how to deploy Office 365 at a public hospital and handled POS hardware troubleshooting and network configuration, keeping transaction failures to a minimum. This role taught me how to debug issues systematically and manage IT operations efficiently in a healthcare environment."
    }
  ];

  const CHEVRON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`;

  /* ── shared state ── */
  let slides = [];
  let current = 0;
  let sliderWrap = null;

  function updateWrapperHeight() {
    if (sliderWrap && slides[current]) {
      sliderWrap.style.height = slides[current].offsetHeight + 'px';
    }
  }

  function updateLayout() {
    const layout = document.querySelector('.exp-layout');
    if (!layout || !slides[current]) return;
    const cardHeight = slides[current].offsetHeight;
    layout.classList.toggle('compact', cardHeight < 350);
  }

  function esc(str) {
    if (!str) return '';
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }

  function renderSlides() {
    const container = document.getElementById('expSlides');
    if (!container) return;
    container.innerHTML = '';

    const isMobile = window.innerWidth <= 768;

    experiences.forEach((exp, idx) => {
      const card = document.createElement('div');
      card.className = 'exp-card';
      card.setAttribute('data-idx', idx);

      const visibleBullets = isMobile && exp.mobileLimit
        ? exp.bullets.slice(0, exp.mobileLimit)
        : exp.bullets;

      card.innerHTML = `
        <div class="card-header">
          <span class="job-title">${esc(exp.title)}</span>
          <span class="date-badge">
            ${esc(exp.dateStart)}
            <span class="date-dot"></span>
            ${esc(exp.dateEnd)}
          </span>
        </div>
        <div class="company-row">
          <span class="company-name">${esc(exp.company)}</span>
          <span class="dot-divider"></span>
          <span class="company-location">${esc(exp.location)}</span>
        </div>
        <ul class="exp-bullets">
          ${visibleBullets.map(b => `<li>${esc(b)}</li>`).join('')}
        </ul>
        <div class="tag-row">
          ${exp.tags.map(t => `<span class="tag">${esc(t)}</span>`).join('')}
        </div>
        <button class="show-more-btn" type="button">
          More
          <span class="btn-chevron">${CHEVRON_SVG}</span>
        </button>
        <div class="exp-detail-wrapper">
          <div class="exp-detail-inner">
            <p class="detail-text">${esc(exp.detailedExplanation)}</p>
            <ul class="detail-bullets">
              ${exp.bullets.map(b => `<li>${esc(b)}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      /* toggle handler */
      const btn = card.querySelector('.show-more-btn');
      const wrapper = card.querySelector('.exp-detail-wrapper');

      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = wrapper.classList.contains('expanded');

        /* close all others first */
        document.querySelectorAll('.exp-detail-wrapper.expanded').forEach(w => {
          if (w !== wrapper) {
            w.classList.remove('expanded');
            const otherBtn = w.closest('.exp-card').querySelector('.show-more-btn');
            if (otherBtn) {
              otherBtn.classList.remove('open');
              otherBtn.childNodes[0].textContent = 'More ';
            }
          }
        });

        /* toggle current */
        wrapper.classList.toggle('expanded', !isOpen);
        btn.classList.toggle('open', !isOpen);
        btn.childNodes[0].textContent = isOpen ? 'More ' : 'Less ';

        /* wait for detail panel transition then update height and layout */
        setTimeout(() => {
          updateWrapperHeight();
          updateLayout();
        }, 500);
      });

      container.appendChild(card);
    });
  }

  function initSlider() {
    const slidesContainer = document.getElementById('expSlides');
    const dotsContainer = document.getElementById('expDots');
    const prevBtn = document.getElementById('expPrev');
    const nextBtn = document.getElementById('expNext');
    const currentSpan = document.getElementById('expCurrent');
    const totalSpan = document.getElementById('expTotal');
    const progressFill = document.getElementById('expProgress');

    /* assign to outer shared state */
    sliderWrap = document.querySelector('.exp-slider-wrap');
    slides = document.querySelectorAll('.exp-card');

    if (!slides.length) return;

    const total = slides.length;

    totalSpan.textContent = String(total).padStart(2, '0');

    /* dots */
    dotsContainer.innerHTML = '';
    for (let i = 0; i < total; i++) {
      const dot = document.createElement('button');
      dot.className = 'exp-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }

    function goTo(index) {
      if (index < 0) index = total - 1;
      if (index >= total) index = 0;
      if (current === index) return;

      /* collapse open detail on leaving slide */
      const leavingCard = slides[current];
      const openWrapper = leavingCard.querySelector('.exp-detail-wrapper.expanded');
      if (openWrapper) {
        openWrapper.classList.remove('expanded');
        const openBtn = leavingCard.querySelector('.show-more-btn');
        if (openBtn) {
          openBtn.classList.remove('open');
          openBtn.childNodes[0].textContent = 'More ';
        }
      }

      /* update dots */
      const dots = dotsContainer.querySelectorAll('.exp-dot');
      dots[current].classList.remove('active');
      dots[index].classList.add('active');

      current = index;
      slidesContainer.style.transform = `translateX(-${current * 100}%)`;
      currentSpan.textContent = String(current + 1).padStart(2, '0');
      if (progressFill) {
        progressFill.style.width = `${((current + 1) / total) * 100}%`;
      }

      updateWrapperHeight();
      updateLayout();
    }

    /* set initial height + progress + layout */
    if (progressFill) progressFill.style.width = `${(1 / total) * 100}%`;
    updateWrapperHeight();
    updateLayout();

    prevBtn.addEventListener('click', () => goTo(current - 1));
    nextBtn.addEventListener('click', () => goTo(current + 1));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { goTo(current - 1); e.preventDefault(); }
      if (e.key === 'ArrowRight') { goTo(current + 1); e.preventDefault(); }
    });

    /* touch swipe */
    const wrap = document.querySelector('.exp-slider-wrap');
    let touchStart = 0;
    wrap?.addEventListener('touchstart', (e) => { touchStart = e.changedTouches[0].screenX; }, { passive: true });
    wrap?.addEventListener('touchend', (e) => {
      const delta = e.changedTouches[0].screenX - touchStart;
      if (Math.abs(delta) > 45) delta > 0 ? goTo(current - 1) : goTo(current + 1);
    });
  }

  renderSlides();
  initSlider();
});