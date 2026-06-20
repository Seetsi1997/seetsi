// ========== PROJECT DATA ==========
const projects = [
  {
    heading: "Interactive Calculator",
    subtitle: "A fully functional calculator with basic arithmetic operations.",
    tech: ["HTML", "CSS", "JavaScript"]
  },
  {
    heading: "Notes App",
    subtitle: "Notes is a simple text editor. Ideal for composing brief text documents saved as plain text.",
    tech: ["HTML", "CSS", "JavaScript"]   // Normalised "JS" → "JavaScript"
  },
  {
    heading: "In-Need App",
    subtitle: "Connects sponsors to verified charities, enabling real-time giving and building trust through transparency.",
    tech: ["Angular", "HTML", "CSS", "TypeScript", "Spring Boot", "Java", "Postgres"]
  },
  {
    heading: "Go-School App",
    subtitle: "Student transport app ensuring safe, reliable trips with real-time tracking and optimized routes.",
    tech: ["Angular", "HTML", "CSS", "TypeScript", "Spring Boot", "Java", "Postgres"]
  },
  {
    heading: "E-learning App",
    subtitle: "An e-learning app helping students learn online with flexible and accessible access to knowledge.",
    tech: ["HTML", "CSS"]
  }
];

// ─── Helper: normalise tech names ───────────────────────────────
function normaliseTech(techArray) {
  return techArray.map(t => {
    if (t === "JS") return "JavaScript";
    if (t === "Postgres") return "PostgreSQL";
    return t;
  });
}

// ─── Initialisation ──────────────────────────────────────────────
let projectSliderInitialised = false;

function initProjectSlider() {
  if (projectSliderInitialised) return;
  projectSliderInitialised = true;

  const slidesContainer = document.getElementById('slidesContainer');
  const sliderFrame     = document.getElementById('sliderFrame');
  const headingEl       = document.getElementById('slideHeading');
  const subtitleEl      = document.getElementById('slideSubtitle');
  const techStackEl     = document.getElementById('techStack');
  const indicatorsEl    = document.querySelector('.indicators');

  // Guard: missing critical elements
  if (!slidesContainer || !sliderFrame || !headingEl || !subtitleEl || !techStackEl) {
    console.warn('Project slider: required elements not found – aborting.');
    return;
  }

  // ─── Dots ──────────────────────────────────────────────────────
  let dots = [];
  if (indicatorsEl) {
    dots = Array.from(indicatorsEl.querySelectorAll('.dot'));
  }

  // If no dots exist, create them dynamically (optional but nice)
  if (dots.length === 0 && indicatorsEl) {
    projects.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'dot' + (i === 0 ? ' active' : '');
      dot.dataset.index = i;
      indicatorsEl.appendChild(dot);
    });
    dots = Array.from(indicatorsEl.querySelectorAll('.dot'));
  }

  let current = 0;
  let autoTimer = null;

  // ─── Update overlay content (with crossfade) ──────────────────
  function updateOverlay(idx) {
    const p = projects[idx];
    if (!p) return;

    headingEl.classList.add('fading');
    subtitleEl.classList.add('fading');

    setTimeout(() => {
      headingEl.textContent  = p.heading;
      subtitleEl.textContent = p.subtitle;

      const tech = normaliseTech(p.tech);
      techStackEl.innerHTML = tech.map(t =>
        `<span class="tech-pill">${t}</span>`
      ).join('');

      headingEl.classList.remove('fading');
      subtitleEl.classList.remove('fading');
    }, 200);
  }

  // ─── Show slide ────────────────────────────────────────────────
  function showSlide(idx) {
    const total = projects.length;
    if (total === 0) return;
    idx = ((idx % total) + total) % total;
    current = idx;

    // Move the slides container
    slidesContainer.style.transform = `translateX(-${current * 100}%)`;

    // Update dots
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    updateOverlay(current);
  }

  // ─── Auto-play ──────────────────────────────────────────────────
  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(() => {
      showSlide(current + 1);
    }, 5000);
  }

  function stopAuto() {
    clearInterval(autoTimer);
    autoTimer = null;
  }

  // ─── Dot click handlers ────────────────────────────────────────
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', () => {
      if (current === idx) return;
      showSlide(idx);
      startAuto(); // restart timer after manual navigation
    });
  });

  // ─── Pause on hover / touch ────────────────────────────────────
  const pauseEvents = ['mouseenter', 'touchstart'];
  const resumeEvents = ['mouseleave', 'touchend'];

  pauseEvents.forEach(ev => {
    sliderFrame.addEventListener(ev, stopAuto);
  });
  resumeEvents.forEach(ev => {
    sliderFrame.addEventListener(ev, startAuto);
  });

  // ─── Handle window resize (optional: keep slide centered) ────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Re-apply transform to avoid misalignment
      if (!sliderFrame.matches(':hover')) {
        slidesContainer.style.transform = `translateX(-${current * 100}%)`;
      }
    }, 200);
  });

  // ─── Initialise ────────────────────────────────────────────────
  // Ensure the container width is correct (CSS should set width: 100% * number of slides)
  showSlide(0);
  startAuto();
}

// ─── Attach to partials loaded event ────────────────────────────
window.addEventListener('partialsLoaded', initProjectSlider);