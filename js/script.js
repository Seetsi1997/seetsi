function initScripts() {
  // Helper to lock/unlock body scroll
  function toggleBodyScroll(disable) {
    if (disable) {
      document.body.classList.add("mobile-nav");
    } else {
      document.body.classList.remove("mobile-nav");
    }
  }

  // Safely close any open drawers (if they exist)
  if (typeof closeCertPanel === "function") closeCertPanel();
  if (typeof closeEduPopup === "function") closeEduPopup();
  if (typeof closeViewer === "function") closeViewer();

  /* Email */
  var email = "seetsi1997" + "@" + "gmail.com";
  var d = document.getElementById("email-display");
  if (d) d.textContent = email;
  var b = document.getElementById("email-btn");
  if (b) b.href = "mailto:" + email;

  /* Navbar scroll shadow */
  var nav = document.getElementById("navbar");
  if (nav) {
    window.addEventListener(
      "scroll",
      function () {
        nav.classList.toggle("scrolled", window.scrollY > 20);
      },
      { passive: true },
    );
  }

  /* Mobile menu */
  var ham = document.getElementById("hamburger");
  var mob = document.getElementById("mobileNav");
  var open = false;

  function closeMenu() {
    open = false;
    if (mob) mob.classList.remove("open");
    if (ham) {
      ham.classList.remove("open");
      ham.setAttribute("aria-expanded", "false");
    }
    toggleBodyScroll(false);
  }

  function openMenu() {
    if (typeof closeCertPanel === "function") closeCertPanel();
    if (typeof closeEduPopup === "function") closeEduPopup();
    if (typeof closeViewer === "function") closeViewer();

    open = true;
    if (mob) mob.classList.add("open");
    if (ham) {
      ham.classList.add("open");
      ham.setAttribute("aria-expanded", "true");
    }
    toggleBodyScroll(true);
  }

  window.closeMenu = closeMenu;

  window.navTo = function (e, target) {
    e.preventDefault();
    closeMenu();
    setTimeout(function () {
      var el = document.querySelector(target);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 350);
  };

  if (ham) {
    ham.addEventListener("click", function () {
      open ? closeMenu() : openMenu();
    });
    document.addEventListener("click", function (e) {
      if (
        open &&
        !e.target.closest(".navbar") &&
        !e.target.closest(".mobile-nav")
      )
        closeMenu();
    });
  }

  // ── Mobile accordion toggles
  document.querySelectorAll(".mobile-acc-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const menu = btn.nextElementSibling;
      const isOpen = menu.classList.contains("open");

      document
        .querySelectorAll(".mobile-acc-menu.open")
        .forEach((m) => m.classList.remove("open"));
      document
        .querySelectorAll('.mobile-acc-toggle[aria-expanded="true"]')
        .forEach((b) => b.setAttribute("aria-expanded", "false"));

      if (!isOpen) {
        menu.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // Close mobile nav when a sub-link is clicked
  document.querySelectorAll(".mobile-acc-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      document.getElementById("mobileNav").classList.remove("open");
      document.getElementById("hamburger").classList.remove("open");
      document
        .getElementById("hamburger")
        .setAttribute("aria-expanded", "false");
    });
  });

  // ── Desktop dropdown active state
  document.querySelectorAll(".has-dropdown").forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    const caretImg = item.querySelector(".caret-img");
    if (!toggle || !caretImg) return;

    toggle.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const isActive = item.classList.contains("active");

      // close all other dropdowns and reset their images
      document.querySelectorAll(".has-dropdown.active").forEach((other) => {
        other.classList.remove("active");
        const otherImg = other.querySelector(".caret-img");
        if (otherImg) otherImg.src = "../../images/icons/arrow_drop_down.png";
      });

      if (!isActive) {
        item.classList.add("active");
        caretImg.src = "../../images/icons/arrow_drop_up_white.png";
      } else {
        caretImg.src = "../../images/icons/arrow_drop_down.png";
      }
    });
  });

  // Close dropdown when clicking outside — reset images too
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".has-dropdown")) {
      document.querySelectorAll(".has-dropdown.active").forEach((item) => {
        item.classList.remove("active");
        const img = item.querySelector(".caret-img");
        if (img) img.src = "../../images/icons/arrow_drop_down.png";
      });
    }
  });

  /* Scroll reveal */
  var els = document.querySelectorAll(".reveal");
  if (els.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px 40px 0px" },
    );
    els.forEach(function (el) {
      io.observe(el);
    });
  }
}

window.addEventListener("partialsLoaded", initScripts);