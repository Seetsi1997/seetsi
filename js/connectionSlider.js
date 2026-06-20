// connectionSlider.js – seamless infinite loop
window.addEventListener('partialsLoaded', function () {
  (function () {

    const track = document.getElementById('conn-track');
    const pips = document.getElementById('conn-pips');
    const counter = document.getElementById('conn-counter');
    const viewport = document.getElementById('conn-viewport');

    if (!track || !pips || !counter || !viewport) {
      console.warn('Slider elements missing – skipping');
      return;
    }

    const items = [
      { img: "/images/imgs/people/0.jpg", title: "University", tag: "Bloemfontein, Free State", country: "South Africa" },
      { img: "/images/imgs/people/1.jpg", title: "Aucklands Park", tag: "Johannesburg, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/2.jpg", title: "Aucklands Park", tag: "Johannesburg, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/3.jpg", title: "Aucklands Park", tag: "Johannesburg, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/4.jpg", title: "Heuweloord", tag: "Centurion, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/5.jpg", title: "Mayibiye", tag: "Midrand, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/6.jpg", title: "Kgotsong", tag: "Matatiele, Eastern Cape", country: "South Africa" },
      { img: "/images/imgs/people/7.jpg", title: "Mayibuye", tag: "Midrand, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/8.jpg", title: "Queens Mercy", tag: "Matatiele, Eastern Cape", country: "South Africa" },
      { img: "/images/imgs/people/9.jpg", title: "Aucklands Park", tag: "Johannesburg, Gauteng", country: "South Africa" },
      { img: "/images/imgs/people/10.jpg", title: "Toyota Stadium", tag: "Bloemfontein, Free State", country: "South Africa" },
      { img: "/images/imgs/people/11.jpg", title: "Engen Mount Currie", tag: "Kokstad, Kwazulu-Natal", country: "South Africa" },
      { img: "/images/imgs/people/13.jpg", title: "Engen Mount Currie", tag: "Kokstad, Kwazulu-Natal", country: "South Africa" },
      { img: "/images/imgs/people/14.jpg", title: "Queens Mercy", tag: "Matatiele, Eastern Cape", country: "South Africa" },
      { img: "/images/imgs/people/15.jpg", title: "Maloto", tag: "Matatiele, Eastern Cape", country: "South Africa" },
      { img: "/images/imgs/people/16.jpg", title: "Xaxazana", tag: "Mount Fletcher, Eastern Cape", country: "South Africa" },
    ];

    const total = items.length;

    // ----- State -----
    let current = 0;           // real index (0 to total-1)
    let autoTimer = null;
    let isDragging = false;
    let dragStart = 0;
    let isJumping = false;     // true while silently resetting position

    // ----- Build slides -----
    // DOM order: [clone of last] [0] [1] ... [total-1] [clone of first]
    function makeSlide(item) {
      const slide = document.createElement('div');
      slide.className = 'slide';
      slide.innerHTML = `
        <img src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="slide-grad"></div>
        <div class="slide-tag">${item.tag}</div>
        <div class="slide-title">${item.title}</div>
        <div class="slide-hint"><span class="slide-hint-dot"></span>${item.country}</div>
      `;
      return slide;
    }

    // Leading clone (last slide)
    track.appendChild(makeSlide(items[total - 1]));
    // All real slides
    items.forEach(item => track.appendChild(makeSlide(item)));
    // Trailing clone (first slide)
    track.appendChild(makeSlide(items[0]));

    // Total DOM slides = total + 2
    // Real slides are at positions 1 to total (inclusive)
    // Leading clone at position 0, trailing clone at position total+1

    // ----- Pips (real slides only) -----
    items.forEach((_, idx) => {
      const pip = document.createElement('div');
      pip.className = 'conn-pip' + (idx === 0 ? ' active' : '');
      pips.appendChild(pip);
    });

    // ----- Helpers -----
    function domIndex() {
      return current + 1; // because of leading clone
    }

    function getX(pos) {
      return -pos * viewport.clientWidth;
    }

    function moveTo(pos, animate) {
      track.style.transition = animate
        ? 'transform 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        : 'none';
      track.style.transform = `translateX(${getX(pos)}px)`;
    }

    function syncUI() {
      counter.textContent = `${current + 1} / ${total}`;
      document.querySelectorAll('.conn-pip').forEach((p, i) =>
        p.classList.toggle('active', i === current)
      );
    }

    // ----- Core navigation -----
    function goTo(index, instant = false) {
      // Normalise index to real range
      const target = ((index % total) + total) % total;

      // If we are already at target, just update UI and position (no animation)
      if (target === current && !instant) {
        moveTo(domIndex(), false);
        return;
      }

      // ---- Edge cases for seamless infinite loop ----
      // Going from first to previous (wrapping to last)
      if (current === 0 && target === total - 1) {
        // 1. Instantly jump to leading clone (pos 0)
        isJumping = true;
        current = total - 1;   // update real index to last
        syncUI();
        moveTo(0, false);      // no transition
        track.offsetHeight;    // force reflow
        isJumping = false;
        // 2. Animate from clone (pos 0) to real last (pos total)
        requestAnimationFrame(() => {
          moveTo(total, true); // animate to real last
        });
        return;
      }

      // Going from last to next (wrapping to first)
      if (current === total - 1 && target === 0) {
        // 1. Instantly jump to trailing clone (pos total+1)
        isJumping = true;
        current = 0;           // update real index to first
        syncUI();
        moveTo(total + 1, false);
        track.offsetHeight;
        isJumping = false;
        // 2. Animate from clone (pos total+1) to real first (pos 1)
        requestAnimationFrame(() => {
          moveTo(1, true);
        });
        return;
      }

      // ---- Normal transition ----
      current = target;
      syncUI();
      moveTo(domIndex(), !instant);
    }

    // ----- Transition end listener (handle clone landing) -----
    track.addEventListener('transitionend', () => {
      if (isJumping) return;

      const pos = domIndex();

      // Landed on leading clone (pos 0) – should only happen if something went wrong,
      // but we handle it by jumping to real last.
      if (pos === 0) {
        isJumping = true;
        current = total - 1;
        syncUI();
        moveTo(total, false);
        track.offsetHeight;
        isJumping = false;
        return;
      }

      // Landed on trailing clone (pos total+1) – jump to real first.
      if (pos === total + 1) {
        isJumping = true;
        current = 0;
        syncUI();
        moveTo(1, false);
        track.offsetHeight;
        isJumping = false;
        return;
      }
    });

    // ----- Next / Prev -----
    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    // ----- Auto play -----
    function startAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        if (!isDragging) next();
      }, 3800);
    }

    function stopAuto() {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = null;
    }

    // ----- Drag / swipe -----
    function onDragStart(clientX) {
      stopAuto();
      isDragging = true;
      dragStart = clientX;
      track.classList.add('dragging');
      moveTo(domIndex(), false);
    }

    function onDragMove(clientX) {
      if (!isDragging) return;
      const delta = clientX - dragStart;
      const offset = getX(domIndex());
      track.style.transform = `translateX(${offset + delta}px)`;
    }

    function onDragEnd(clientX) {
      if (!isDragging) return;
      isDragging = false;
      track.classList.remove('dragging');
      const delta = clientX - dragStart;
      if (Math.abs(delta) > 45) {
        if (delta < 0) next();
        else prev();
      } else {
        goTo(current);
      }
      startAuto();
    }

    // ----- Event listeners -----
    viewport.addEventListener('touchstart', e => onDragStart(e.touches[0].clientX), { passive: true });
    viewport.addEventListener('touchmove', e => { onDragMove(e.touches[0].clientX); e.preventDefault(); }, { passive: false });
    viewport.addEventListener('touchend', e => onDragEnd(e.changedTouches[0].clientX));

    viewport.addEventListener('mousedown', e => { e.preventDefault(); onDragStart(e.clientX); });
    window.addEventListener('mousemove', e => { if (isDragging) onDragMove(e.clientX); });
    window.addEventListener('mouseup', e => { if (isDragging) onDragEnd(e.clientX); });

    // Hover pause
    viewport.addEventListener('mouseenter', stopAuto);
    viewport.addEventListener('mouseleave', startAuto);

    // Resize
    window.addEventListener('resize', () => {
      if (!isDragging) moveTo(domIndex(), false);
    });

    // ----- Initialise -----
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        goTo(0, true);
        startAuto();
      });
    });

  })();
});