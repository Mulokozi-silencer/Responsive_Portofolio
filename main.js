// JS is running: allow scroll-reveal styles to hide elements until they appear
document.documentElement.classList.remove("no-js");

// ----- Typing animation -----
if (window.Typed) {
  new Typed(".typing-text", {
    strings: ["Frontend Developer", "Web Designer", "UI/UX Designer"],
    typeSpeed: 80,
    backSpeed: 50,
    backDelay: 1500,
    loop: true,
  });
}

// ----- Light / dark theme -----
const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeMeta = document.querySelector('meta[name="theme-color"]');

function applyTheme(theme) {
  root.dataset.theme = theme;
  const isDark = theme === "dark";
  themeToggle.querySelector("i").className = isDark ? "bx bx-sun" : "bx bx-moon";
  themeToggle.setAttribute("aria-label", isDark ? "Switch to light theme" : "Switch to dark theme");
  themeMeta.setAttribute("content", isDark ? "#0b1120" : "#f7f9fc");
}

applyTheme(root.dataset.theme || "dark");

themeToggle.addEventListener("click", () => {
  const next = root.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch (e) { /* storage blocked: theme just won't be remembered */ }
});

// ----- Mobile menu -----
const menuToggle = document.querySelector(".menu-toggle");
const navbar = document.querySelector(".navbar");

function setMenu(open) {
  navbar.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  menuToggle.querySelector("i").className = open ? "bx bx-x" : "bx bx-menu";
}

menuToggle.addEventListener("click", () => setMenu(!navbar.classList.contains("open")));
navbar.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// ----- Highlight the nav link of the section in view -----
const navLinks = navbar.querySelectorAll("a");
const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) =>
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`)
      );
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => sectionObserver.observe(s));

// ----- Reveal elements (and fill skill bars) when scrolled into view -----
const revealObserver = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => revealObserver.observe(el));

// ----- Contact form (Formspree, sent in the background so the page doesn't reload) -----
const CONTACT_EMAIL = "mulokoziwillium@gmail.com";
const form = document.querySelector(".contact-form form");
const statusBox = document.querySelector(".form-status");

function showStatus(text, isError) {
  statusBox.textContent = text;
  statusBox.classList.toggle("error", isError);
  statusBox.hidden = false;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = new FormData(form);

  // Formspree not set up yet: open the visitor's email app instead
  if (form.action.includes("YOUR_FORM_ID")) {
    const subject = data.get("_subject") || "Message from your portfolio";
    const body = `${data.get("message")}\n\n${data.get("name")} (${data.get("email")})`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending...";
  try {
    const res = await fetch(form.action, {
      method: "POST",
      body: data,
      headers: { Accept: "application/json" },
    });
    if (!res.ok) throw new Error(res.status);
    form.reset();
    showStatus("Thank you! Your message has been sent. I'll reply soon.", false);
  } catch {
    showStatus(`Sorry, the message could not be sent. Please email me at ${CONTACT_EMAIL}.`, true);
  } finally {
    button.disabled = false;
    button.textContent = "Send Message";
  }
});

// ----- Footer year -----
document.getElementById("year").textContent = new Date().getFullYear();
