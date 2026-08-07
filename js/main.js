/* SNG site interactions */

(function () {
  "use strict";

  // —— Nav ——
  const nav = document.querySelector(".nav");
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelectorAll(".nav-links a");

  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      document.body.style.overflow = nav.classList.contains("open") ? "hidden" : "";
    });
    links.forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        document.body.style.overflow = "";
      })
    );
  }

  window.addEventListener(
    "scroll",
    () => {
      if (nav) nav.classList.toggle("scrolled", window.scrollY > 24);
    },
    { passive: true }
  );

  // —— Reveal on scroll ——
  const reveals = document.querySelectorAll(".reveal");
  if (reveals.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // —— Animated counters ——
  function animateValue(el, target, duration, decimals) {
    const start = performance.now();
    const from = 0;
    function frame(now) {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const val = from + (target - from) * eased;
      el.textContent = decimals ? val.toFixed(decimals) : Math.round(val).toString();
      if (t < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  const counters = document.querySelectorAll("[data-count]");
  if (counters.length && "IntersectionObserver" in window) {
    const cio = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          const target = parseFloat(el.dataset.count);
          const decimals = parseInt(el.dataset.decimals || "0", 10);
          animateValue(el, target, 1400, decimals);
          cio.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );
    counters.forEach((el) => cio.observe(el));
  }

  // —— Serial strip (visual scarcity) ——
  const strip = document.getElementById("serial-strip");
  if (strip) {
    const held = new Set([3, 7, 11]); // demo held slots — wire to real data later
    for (let i = 1; i <= 30; i++) {
      const chip = document.createElement("div");
      chip.className = "serial-chip " + (held.has(i) ? "held" : "open");
      chip.textContent = String(i).padStart(2, "0");
      chip.title = held.has(i) ? "Held" : "Available";
      strip.appendChild(chip);
    }
  }

  // —— Deposit URL (set window.SNG_DEPOSIT_URL to Stripe Payment Link) ——
  const depositUrl = window.SNG_DEPOSIT_URL || null;

  ["deposit-link", "deposit-link-success"].forEach((id) => {
    const el = document.getElementById(id);
    if (el && depositUrl) {
      el.setAttribute("href", depositUrl);
      el.removeAttribute("target");
    }
  });

  // —— Founders application form ——
  const form = document.getElementById("founders-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const btn = form.querySelector('[type="submit"]');
      const card = form.closest(".form-card");
      const data = Object.fromEntries(new FormData(form).entries());

      if (!data.name || !data.email || !data.background) {
        alert("Please complete required fields.");
        return;
      }

      btn.disabled = true;
      btn.textContent = "Submitting…";

      const application = {
        ...data,
        id: "SNG-" + Date.now().toString(36).toUpperCase(),
        submittedAt: new Date().toISOString(),
        status: "pending_review",
      };

      try {
        const existing = JSON.parse(localStorage.getItem("sng_applications") || "[]");
        existing.push(application);
        localStorage.setItem("sng_applications", JSON.stringify(existing));
      } catch (_) {}

      if (window.SNG_FORM_ENDPOINT) {
        try {
          await fetch(window.SNG_FORM_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(application),
          });
        } catch (_) {}
      }

      if (card) card.classList.add("submitted");
      const success = document.getElementById("form-success");
      if (success) {
        success.classList.add("show");
        const serialEl = success.querySelector("[data-preferred-serial]");
        if (serialEl) {
          serialEl.textContent = data.serial
            ? "Preferred serial: " + data.serial + " · Application " + application.id
            : "Application " + application.id;
        }
        const dep = document.getElementById("deposit-link-success");
        if (dep) {
          if (depositUrl) {
            dep.setAttribute("href", depositUrl);
          } else {
            dep.setAttribute(
              "href",
              "mailto:hello@sngcycles.com?subject=Founders%20Deposit%20" +
                encodeURIComponent(application.id) +
                "&body=" +
                encodeURIComponent(
                  "Application ID: " +
                    application.id +
                    "\nName: " +
                    data.name +
                    "\nEmail: " +
                    data.email +
                    "\nPreferred serial: " +
                    (data.serial || "none") +
                    "\n\nReady to place $1,000 refundable deposit."
                )
            );
          }
        }
      }

      success?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
  }

  // —— Prefer reduced motion ——
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.querySelectorAll("video").forEach((v) => {
      v.removeAttribute("autoplay");
      v.pause();
    });
  }
})();
