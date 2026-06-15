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
    tech: ["HTML", "CSS", "JS"]
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

function initProjectSlider() {
  var slidesContainer = document.getElementById('slidesContainer');
  var sliderFrame     = document.getElementById('sliderFrame');
  var headingEl       = document.getElementById('slideHeading');
  var subtitleEl      = document.getElementById('slideSubtitle');
  var techStackEl     = document.getElementById('techStack');

  var indicatorsEl = document.querySelector('.indicators');
  var dots = indicatorsEl ? indicatorsEl.querySelectorAll('.dot') : [];

  if (!slidesContainer || !sliderFrame || !headingEl || !subtitleEl || !techStackEl) {
    return;
  }

  var current = 0;
  var autoTimer;

  function updateOverlay(idx) {
    var p = projects[idx];
    if (!p) return;

    headingEl.classList.add('fading');
    subtitleEl.classList.add('fading');

    setTimeout(function () {
      headingEl.textContent  = p.heading;
      subtitleEl.textContent = p.subtitle;
      techStackEl.innerHTML  = p.tech.map(function(t) {
        return '<span class="tech-pill">' + t + '</span>';
      }).join('');

      headingEl.classList.remove('fading');
      subtitleEl.classList.remove('fading');
    }, 200);
  }

  function showSlide(idx) {
    if (idx < 0) idx = projects.length - 1;
    if (idx >= projects.length) idx = 0;
    current = idx;

    slidesContainer.style.transform = 'translateX(-' + (current * 100) + '%)';

    dots.forEach(function(dot, i) {
      dot.classList.toggle('active', i === current);
    });

    updateOverlay(current);
  }

  function startAuto() {
    clearInterval(autoTimer);
    autoTimer = setInterval(function() { showSlide(current + 1); }, 5000);
  }

  dots.forEach(function(dot, idx) {
    dot.addEventListener('click', function() {
      showSlide(idx);
      startAuto();
    });
  });

  sliderFrame.addEventListener('mouseenter', function() { clearInterval(autoTimer); });
  sliderFrame.addEventListener('mouseleave', startAuto);

  showSlide(0);
  startAuto();
}

window.addEventListener('partialsLoaded', initProjectSlider);