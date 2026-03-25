document.addEventListener("DOMContentLoaded", () => {
  const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  initMobileNav();
  initTypingEffect();
  initReveal();
  initSkillsAnimation();
  initActiveNav();
  initProjectModal();
  initBackToTop();
  initContactForm();

  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const menu = document.getElementById("navMenu");
    const icon = toggle?.querySelector("i");
    if (!toggle || !menu) return;

    function setOpen(nextOpen) {
      menu.classList.toggle("open", nextOpen);
      menu.setAttribute("data-open", String(nextOpen));
      toggle.setAttribute("aria-expanded", String(nextOpen));
      toggle.setAttribute("aria-label", nextOpen ? "Close menu" : "Open menu");
      document.body.classList.toggle("nav-open", nextOpen);

      if (icon) {
        icon.classList.toggle("fa-bars", !nextOpen);
        icon.classList.toggle("fa-xmark", nextOpen);
      }
    }

    toggle.addEventListener("click", () => setOpen(!menu.classList.contains("open")));
    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setOpen(false)));

    document.addEventListener("click", (e) => {
      if (!menu.classList.contains("open")) return;
      if (e.target.closest(".navbar")) return;
      setOpen(false);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (menu.classList.contains("open")) setOpen(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1024 && menu.classList.contains("open")) setOpen(false);
    });
  }

  function initTypingEffect() {
    const typingEl = document.getElementById("typing");
    if (!typingEl || prefersReducedMotion) return;

    const roles = ["Ethical Hacker", "Web Developer", "Cybersecurity Student"];
    let roleIndex = 0;
    let charIndex = 0;
    let currentText = "";
    let deleting = false;

    function tick() {
      const role = roles[roleIndex];

      if (!deleting) {
        currentText += role[charIndex++] ?? "";
        typingEl.textContent = currentText;
        if (charIndex >= role.length) {
          deleting = true;
          setTimeout(tick, 1200);
          return;
        }
      } else {
        currentText = currentText.slice(0, -1);
        typingEl.textContent = currentText;
        if (currentText.length === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
          charIndex = 0;
        }
      }

      setTimeout(tick, deleting ? 55 : 110);
    }

    tick();
  }

  function initReveal() {
    const reveals = document.querySelectorAll(".reveal");
    if (!reveals.length) return;

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      reveals.forEach((el) => el.classList.add("active"));
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("active");
          revealObserver.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    reveals.forEach((el) => revealObserver.observe(el));
  }

  function initSkillsAnimation() {
    const skillsSection = document.getElementById("skills");
    if (!skillsSection) return;

    const bars = document.querySelectorAll(".progress");
    const circleSkills = document.querySelectorAll(".circle-skill");
    let ran = false;

    function runOnce() {
      if (ran) return;
      bars.forEach((bar) => (bar.style.width = bar.dataset.width || "0%"));

      circleSkills.forEach((skill) => {
        const percent = Number(skill.dataset.percent || 0);
        const circle = skill.querySelectorAll("circle")[1];
        if (!circle) return;
        const circumference = 314;
        const offset = circumference - (circumference * percent) / 100;
        circle.style.strokeDashoffset = String(offset);
      });

      ran = true;
    }

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
      runOnce();
      return;
    }

    const skillsObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          runOnce();
          skillsObserver.disconnect();
        });
      },
      { root: null, rootMargin: "-10% 0px -30% 0px", threshold: 0 },
    );

    skillsObserver.observe(skillsSection);
  }

  function initActiveNav() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a[href^=\"#\"]");
    if (!sections.length || !navLinks.length || !("IntersectionObserver" in window)) return;

    const observerOptions = { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const id = entry.target.getAttribute("id");
        if (!id) return;
        navLinks.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === `#${id}`));
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
  }

  function initProjectModal() {
    const modal = document.getElementById("projectModal");
    if (!modal) return;

    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalTech = document.getElementById("modalTech");
    const modalImage = document.getElementById("modalImage");
    const modalLive = document.getElementById("modalLive");

    const cards = document.querySelectorAll(".project-card[role=\"button\"]");
    if (!cards.length) return;

    let lastFocus = null;

    function openFromCard(card, triggerEl) {
      const title = card.dataset.title || "Project";
      const description = card.dataset.description || "";
      const tech = card.dataset.tech || "";
      const live = card.dataset.live || "";
      const image = card.dataset.image || "";

      if (modalTitle) modalTitle.textContent = title;
      if (modalDesc) modalDesc.textContent = description;
      if (modalTech) modalTech.textContent = tech ? `Tech: ${tech}` : "";

      if (modalImage) {
        modalImage.src = image;
        modalImage.alt = `${title} screenshot`;
      }

      if (modalLive) {
        if (live) {
          modalLive.href = live;
          modalLive.style.display = "";
        } else {
          modalLive.href = "#";
          modalLive.style.display = "none";
        }
      }

      lastFocus = triggerEl instanceof HTMLElement ? triggerEl : null;
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      const closeBtn = modal.querySelector(".modal-close");
      closeBtn?.focus?.();
    }

    function close() {
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      lastFocus?.focus?.();
      lastFocus = null;
    }

    cards.forEach((card) => {
      card.addEventListener("click", (e) => {
        if (e.target.closest("a")) return;
        openFromCard(card, card);
      });

      card.addEventListener("keydown", (e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        openFromCard(card, card);
      });
    });

    modal.addEventListener("click", (e) => {
      if (e.target.closest("[data-modal-close]")) close();
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") close();
    });
  }

  function initBackToTop() {
    const btn = document.getElementById("backToTop");
    if (!btn) return;

    function update() {
      btn.classList.toggle("show", window.scrollY > 500);
    }

    update();
    window.addEventListener("scroll", update, { passive: true });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
  }

  function initContactForm() {
    const form = document.getElementById("contactForm");
    const successMsg = document.getElementById("successMsg");
    if (!form) return;

    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("subject");
    const message = document.getElementById("message");

    const fields = [name, email, subject, message].filter(Boolean);

    function getErrorEl(field) {
      const id = field.getAttribute("aria-describedby");
      if (id) return document.getElementById(id);
      return field.parentElement?.querySelector?.(".error") ?? null;
    }

    function setError(field, msg) {
      field.setAttribute("aria-invalid", "true");
      const el = getErrorEl(field);
      if (el) el.textContent = msg;
    }

    function clearError(field) {
      field.removeAttribute("aria-invalid");
      const el = getErrorEl(field);
      if (el) el.textContent = "";
    }

    function clearAll() {
      fields.forEach(clearError);
      if (successMsg) successMsg.textContent = "";
    }

    function isValidEmail(value) {
      return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value);
    }

    fields.forEach((field) => field.addEventListener("input", () => clearError(field)));

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAll();

      let ok = true;

      if (name && name.value.trim() === "") {
        setError(name, "Name is required");
        ok = false;
      }

      if (email) {
        if (email.value.trim() === "") {
          setError(email, "Email is required");
          ok = false;
        } else if (!isValidEmail(email.value.trim())) {
          setError(email, "Enter a valid email");
          ok = false;
        }
      }

      if (subject && subject.value.trim() === "") {
        setError(subject, "Subject is required");
        ok = false;
      }

      if (message && message.value.trim() === "") {
        setError(message, "Message is required");
        ok = false;
      }

      if (!ok) return;

      if (successMsg) successMsg.textContent = "Message sent successfully.";
      form.reset();
    });
  }
});
