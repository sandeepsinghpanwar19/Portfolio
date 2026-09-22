/* =============================================================================
   PANWAR SANDEEPSINGH — DEVELOPER PORTFOLIO  (V3.0)
   FILE 3 OF 3  →  script.js   (all behaviour lives here)
   Other files  →  index.html (content)   |   style.css (design)
==============================================================================

   ┌───────────────────────────────────────────────────────────────────────┐
   │  MOST-EDITED SETTINGS LIVE IN "CONFIG" RIGHT BELOW THIS BOX.          │
   │  You will rarely need to touch anything past that block.             │
   └───────────────────────────────────────────────────────────────────────┘

   File map (search these section titles to jump around):
   0. CONFIG · 1. HELPERS · 2. LOADER · 3. TYPING ANIMATION
   4. HERO NAME SPLIT · 5. NAVBAR (scroll state, active link, indicator)
   6. MOBILE MENU · 7. SCROLL PROGRESS + BACK-TO-TOP RING · 8. SMOOTH SCROLL
   9. REVEAL-ON-SCROLL · 10. STAGGERED CHILDREN · 11. SKILL BARS
   12. COUNTERS · 13. FILTERS (certs + projects) · 14. DETAILS MODAL
   15. THEME SWITCH · 16. COPY EMAIL · 17. CONTACT FORM · 18. TOAST
   19. PARTICLE BACKGROUND (canvas) · 20. CURSOR + MAGNETIC + TILT + SPOTLIGHT
   21. ORBIT CLICK BURST · 22. MISC (console message, external links)
============================================================================= */

"use strict";

/* =============================================================================
   0. CONFIG — edit these values, not the code below, for the common changes
============================================================================= */
const CONFIG = {

    // Roles shown in the hero's typing animation.
    // Add, remove or reorder freely — nothing else needs to change.
    roles: [
        "Python Developer",
        "Django Developer",
        "AI / ML Enthusiast",
        "Android Developer",
        "Web Developer"
    ],

    // Contact details
    email: "sandeepsinghpanwar1906@gmail.com",

    // OPTIONAL: paste a Formspree (or similar) endpoint URL here to have the
    // contact form send messages directly, e.g. "https://formspree.io/f/xxxxxx".
    // Leave as "" to fall back to opening the visitor's email app instead.
    formEndpoint: "",

    // Typing animation speed (milliseconds)
    typeSpeed: 95,
    deleteSpeed: 45,
    holdAfterWord: 1500,

    // How much of a card must be visible before its scroll-reveal animation fires
    revealThreshold: 0.15,

    // Particle background density (roughly: higher = more particles = busier)
    particleDensity: 14000,   // one particle per N square px of screen
    particleMax: 90
};


/* =============================================================================
   1. HELPERS
============================================================================= */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none), (pointer: coarse)").matches;
const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

/* Debounce: only run `fn` after events stop firing for `wait` ms.
   Used on window resize so we don't recompute layout on every pixel. */
function debounce(fn, wait = 120) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), wait);
    };
}


/* =============================================================================
   2. LOADER
   Shows a fake-but-honest progress bar (it is not tied to real network
   progress — Font Awesome/fonts loading is not reliably measurable — but it
   never finishes before `window.load`, so it never lies about being ready).
============================================================================= */
(function loader() {
    const loaderEl = $("#loader");
    const bar = $("#loaderBar");
    const percentEl = $("#loaderPercent");
    if (!loaderEl) return;

    let progress = 0;
    let done = false;

    const tick = () => {
        if (done) return;
        // Ease toward 90% quickly, then creep — classic "fake but pleasant" curve
        progress += (90 - progress) * 0.06 + 0.3;
        progress = Math.min(progress, 90);
        if (bar) bar.style.width = progress + "%";
        if (percentEl) percentEl.textContent = Math.round(progress);
        requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    window.addEventListener("load", () => {
        done = true;
        progress = 100;
        if (bar) bar.style.width = "100%";
        if (percentEl) percentEl.textContent = "100";
        setTimeout(() => loaderEl.classList.add("hide"), 400);
    });

    // Safety net: never trap a visitor behind the loader for more than 4s
    setTimeout(() => loaderEl.classList.add("hide"), 4000);
})();


/* =============================================================================
   3. TYPING ANIMATION  (hero "I am a ___")
============================================================================= */
(function typingAnimation() {
    const typing = $("#typing");
    if (!typing) return;

    if (prefersReducedMotion) {
        typing.textContent = CONFIG.roles[0];
        return;
    }

    let wordIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
        const word = CONFIG.roles[wordIndex % CONFIG.roles.length];
        charIndex += deleting ? -1 : 1;
        typing.textContent = word.substring(0, charIndex);

        let speed = deleting ? CONFIG.deleteSpeed : CONFIG.typeSpeed;

        if (!deleting && charIndex === word.length) {
            speed = CONFIG.holdAfterWord;
            deleting = true;
        } else if (deleting && charIndex === 0) {
            deleting = false;
            wordIndex++;
            speed = 400;
        }
        setTimeout(tick, speed);
    }
    tick();
})();


/* =============================================================================
   4. HERO NAME SPLIT  (turns "Panwar" into per-letter <span class="char">
   so style.css can animate each letter in individually)
============================================================================= */
(function splitHeroName() {
    $$("[data-split]").forEach(el => {
        const text = el.textContent.trim();
        el.textContent = "";
        text.split("").forEach((letter, i) => {
            const span = document.createElement("span");
            span.className = "char";
            span.style.animationDelay = `${0.55 + i * 0.045}s`;
            span.textContent = letter === " " ? "\u00A0" : letter;
            el.appendChild(span);
        });
    });
})();


/* =============================================================================
   5. NAVBAR — scrolled state, active-section highlight, sliding indicator pill
============================================================================= */
const header = $("#header");
const navLinksWrap = $("#navLinks");
const navItems = $$(".nav-link");
const navIndicator = $(".nav-indicator");
const sections = $$("section[id]");

function moveIndicator(link) {
    // Desktop pill only — the mobile slide-down menu doesn't use it
    if (!navIndicator || !link || window.innerWidth <= 950) return;
    navIndicator.style.width = link.offsetWidth + "px";
    navIndicator.style.transform = `translateX(${link.offsetLeft - 4}px)`;
}

function updateActiveNav() {
    let current = sections[0]?.getAttribute("id") || "";
    const scrollPos = window.scrollY + 170;

    sections.forEach(section => {
        if (scrollPos >= section.offsetTop) current = section.getAttribute("id");
    });

    let activeLink = null;
    navItems.forEach(link => {
        const isActive = link.getAttribute("href") === `#${current}`;
        link.classList.toggle("active", isActive);
        if (isActive) activeLink = link;
    });
    if (activeLink) moveIndicator(activeLink);
}

function handleScroll() {
    header.classList.toggle("scrolled", window.scrollY > 40);
    updateActiveNav();
}

window.addEventListener("scroll", handleScroll, { passive: true });
window.addEventListener("load", handleScroll);
window.addEventListener("resize", debounce(updateActiveNav));
handleScroll();


/* =============================================================================
   6. MOBILE MENU
============================================================================= */
(function mobileMenu() {
    const menuToggle = $("#menuToggle");
    if (!menuToggle || !navLinksWrap) return;

    function setOpen(open) {
        navLinksWrap.classList.toggle("open", open);
        menuToggle.classList.toggle("open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        document.body.classList.toggle("menu-open", open);
        document.body.style.overflow = open ? "hidden" : "";
    }

    menuToggle.addEventListener("click", () => {
        setOpen(!navLinksWrap.classList.contains("open"));
    });

    navItems.forEach(link => link.addEventListener("click", () => setOpen(false)));

    document.addEventListener("keydown", e => {
        if (e.key === "Escape") setOpen(false);
    });

    // Tapping the dark backdrop (outside the panel) also closes it
    document.addEventListener("click", e => {
        if (navLinksWrap.classList.contains("open") &&
            !navLinksWrap.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            setOpen(false);
        }
    });
})();


/* =============================================================================
   7. SCROLL PROGRESS BAR + BACK-TO-TOP RING
============================================================================= */
const scrollProgress = $("#scroll-progress");
const backToTop = $("#backToTop");
const bttRing = $("#bttRing");
const RING_CIRCUMFERENCE = 2 * Math.PI * 21; // matches the r=21 circle in the SVG

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgress) scrollProgress.style.width = percent + "%";
    if (bttRing) bttRing.style.strokeDashoffset = String(RING_CIRCUMFERENCE * (1 - percent / 100));
    if (backToTop) backToTop.classList.toggle("show", scrollTop > 500);
}
window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

if (backToTop) {
    backToTop.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
    });
}


/* =============================================================================
   8. SMOOTH ANCHOR NAVIGATION
============================================================================= */
$$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (event) {
        const targetId = this.getAttribute("href");
        if (!targetId || targetId === "#") return;
        const target = $(targetId);
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
        // Keep the URL shareable without an extra jump
        history.pushState(null, "", targetId);
    });
});


/* =============================================================================
   9. REVEAL-ON-SCROLL  (fade/slide/blur in as sections enter the viewport)
============================================================================= */
(function revealOnScroll() {
    const revealEls = $$(".reveal");
    if (!revealEls.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        revealEls.forEach(el => el.classList.add("active"));
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: CONFIG.revealThreshold });

    revealEls.forEach(el => observer.observe(el));
})();


/* =============================================================================
   10. STAGGERED CHILDREN
   Any wrapper marked data-stagger numbers its .reveal children with
   --stagger-i, which style.css turns into an increasing transition-delay —
   so grids of cards reveal one-by-one instead of all at once.
============================================================================= */
(function staggerChildren() {
    $$("[data-stagger]").forEach(group => {
        $$(".reveal", group).forEach((el, i) => {
            el.style.setProperty("--stagger-i", i % 8); // cap so late items aren't too delayed
        });
    });
})();


/* =============================================================================
   11. SKILL BAR FILL ANIMATION
============================================================================= */
(function skillBars() {
    const bars = $$(".progress");
    if (!bars.length) return;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
        bars.forEach(bar => { bar.style.width = bar.dataset.width; });
        return;
    }

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.dataset.width;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    bars.forEach(bar => observer.observe(bar));
})();


/* =============================================================================
   12. ANIMATED COUNTERS  (stats section)
   Supports two data attributes:
     data-target="60"            → counts up to a fixed number
     data-count=".project-card"  → counts how many elements match a selector
                                    (so the number updates itself when you
                                    add/remove project cards in index.html)
============================================================================= */
(function counters() {
    const counterEls = $$("[data-target], [data-count]");
    if (!counterEls.length) return;

    function animate(el) {
        let target = Number(el.dataset.target);
        const suffix = target === 100 ? "%" : "+";

        if (el.dataset.count) {
            target = $$(el.dataset.count).length;
        }
        if (!target || isNaN(target)) target = 0;

        if (prefersReducedMotion) {
            el.textContent = target + (el.dataset.count ? "+" : suffix);
            return;
        }

        let current = 0;
        const increment = Math.max(1, Math.ceil(target / 50));
        (function step() {
            current += increment;
            if (current >= target) {
                el.textContent = target + (el.dataset.count ? "+" : suffix);
                return;
            }
            el.textContent = current;
            requestAnimationFrame(step);
        })();
    }

    if (!("IntersectionObserver" in window)) {
        counterEls.forEach(animate);
        return;
    }
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    counterEls.forEach(el => observer.observe(el));
})();


/* =============================================================================
   13. FILTERS  (certifications + projects)
   Works for any number of cards — new cards you add in index.html are
   picked up automatically because we query by class, not by index.
============================================================================= */
function setupFilter(buttonSelector, cardSelector, datasetKey) {
    const buttons = $$(buttonSelector);
    const cards = $$(cardSelector);
    if (!buttons.length || !cards.length) return;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filter = button.dataset[datasetKey];

            cards.forEach(card => {
                const categories = (card.dataset.category || "").split(" ");
                const matches = filter === "all" || categories.includes(filter);
                card.classList.toggle("filter-hidden", !matches);
            });
        });
    });
}
setupFilter(".filter-btn", ".cert-card", "filter");
setupFilter(".project-filter", ".project-card", "projectFilter");


/* =============================================================================
   14. DETAILS MODAL  (shared pop-up for certificates + projects)
   Reads data-title / data-description / data-tech / data-link / data-github
   off whichever button was clicked — no per-item JavaScript ever required.
============================================================================= */
(function detailsModal() {
    const modal = $("#detailsModal");
    if (!modal) return;

    const modalTitle = $("#modalTitle");
    const modalKicker = $("#modalKicker");
    const modalDescription = $("#modalDescription");
    const modalTech = $("#modalTech");
    const modalActions = $("#modalActions");
    const modalIcon = $("#modalIcon");
    const modalClose = $(".modal-close", modal);

    let lastFocused = null;

    function openModal(button) {
        const { title, description, tech, link, github, category } = button.dataset;
        const cardIcon = button.closest("article")?.querySelector(".cert-icon i, .project-icon i");

        modalTitle.textContent = title || "Details";
        modalKicker.textContent = category || (button.classList.contains("details-btn") ? "Certification" : "Project");
        modalDescription.textContent = description || "";
        modalIcon.innerHTML = cardIcon ? cardIcon.outerHTML : '<i class="fas fa-award"></i>';

        modalTech.innerHTML = "";
        if (tech) {
            tech.split("•").map(t => t.trim()).filter(Boolean).forEach(item => {
                const span = document.createElement("span");
                span.textContent = item;
                modalTech.appendChild(span);
            });
        }

        modalActions.innerHTML = "";
        if (link) {
            modalActions.appendChild(makeActionLink(link, "Live Demo", "fa-arrow-up-right-from-square"));
        }
        if (github) {
            modalActions.appendChild(makeActionLink(github, "Source Code", "fa-brands fa-github"));
        }

        lastFocused = document.activeElement;
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
        modalClose.focus();
    }

    function makeActionLink(href, label, icon) {
        const a = document.createElement("a");
        a.href = href;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.innerHTML = `<i class="${icon.includes('fa-') && !icon.includes('fa-brands') ? 'fas ' + icon : icon}"></i><span>${label}</span>`;
        return a;
    }

    function closeModal() {
        modal.classList.remove("show");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
        if (lastFocused) lastFocused.focus();
    }

    // Event delegation: works for every current AND future .details-btn /
    // .project-details button, so adding new cards needs zero JS changes.
    document.addEventListener("click", e => {
        const trigger = e.target.closest(".details-btn, .project-details");
        // The "View All Certificates" link is also `.details-btn` but is a
        // real external link (has target="_blank") — let it navigate normally.
        if (trigger && trigger.tagName === "BUTTON") {
            openModal(trigger);
        }
    });

    modalClose.addEventListener("click", closeModal);
    modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && modal.classList.contains("show")) closeModal();
    });
})();


/* =============================================================================
   15. THEME SWITCH  (dark ⇄ light, saved to localStorage)
============================================================================= */
(function themeSwitch() {
    const themeToggle = $("#themeToggle");
    const root = document.documentElement;
    const THEME_KEY = "portfolio-theme";
    const metaTheme = $('meta[name="theme-color"]');

    function apply(theme) {
        if (theme === "light") {
            root.setAttribute("data-theme", "light");
        } else {
            root.removeAttribute("data-theme");
        }
        if (themeToggle) {
            const isLight = theme === "light";
            themeToggle.innerHTML = isLight ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
            themeToggle.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
        }
        if (metaTheme) metaTheme.setAttribute("content", theme === "light" ? "#f4f7fc" : "#050b16");
    }

    // The inline <head> script already set data-theme before paint if a
    // preference was saved — just sync the toggle icon to match it now.
    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark");

    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";
            apply(next);
            try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* storage may be blocked — theme still works this visit */ }
        });
    }
})();


/* =============================================================================
   16. COPY EMAIL
============================================================================= */
(function copyEmail() {
    const button = $("#copyEmail");
    if (!button) return;

    button.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(CONFIG.email);
            showToast("Email copied to clipboard!");
            button.classList.add("copied");
            setTimeout(() => button.classList.remove("copied"), 1500);
        } catch (error) {
            // Fallback for browsers/contexts without Clipboard API permission
            const temp = document.createElement("textarea");
            temp.value = CONFIG.email;
            temp.style.position = "fixed";
            temp.style.opacity = "0";
            document.body.appendChild(temp);
            temp.select();
            try {
                document.execCommand("copy");
                showToast("Email copied to clipboard!");
            } catch (fallbackError) {
                showToast("Could not copy — email is " + CONFIG.email, true);
            }
            document.body.removeChild(temp);
        }
    });
})();


/* =============================================================================
   17. CONTACT FORM
   Client-side validation with inline errors, then either:
     • posts to CONFIG.formEndpoint (if set), or
     • opens the visitor's email client pre-filled with the message.
   A hidden honeypot field silently rejects simple spam bots.
============================================================================= */
(function contactForm() {
    const form = $("#contactForm");
    if (!form) return;

    const submitBtn = $(".submit-btn", form);
    const submitLabel = $(".submit-label", submitBtn);

    const fields = {
        name: $("#name", form),
        email: $("#email", form),
        message: $("#message", form)
    };

    function setFieldError(field, message) {
        const group = field.closest(".input-group");
        const errorEl = $(".field-error", group);
        group.classList.toggle("invalid", Boolean(message));
        if (errorEl) errorEl.textContent = message || "";
    }

    function validate() {
        let valid = true;

        if (!fields.name.value.trim()) {
            setFieldError(fields.name, "Please enter your name.");
            valid = false;
        } else {
            setFieldError(fields.name, "");
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!fields.email.value.trim()) {
            setFieldError(fields.email, "Please enter your email.");
            valid = false;
        } else if (!emailPattern.test(fields.email.value.trim())) {
            setFieldError(fields.email, "Please enter a valid email address.");
            valid = false;
        } else {
            setFieldError(fields.email, "");
        }

        if (!fields.message.value.trim()) {
            setFieldError(fields.message, "Please add a short message.");
            valid = false;
        } else {
            setFieldError(fields.message, "");
        }

        return valid;
    }

    // Clear an error the moment the visitor starts fixing it
    Object.values(fields).forEach(field => {
        field.addEventListener("input", () => setFieldError(field, ""));
    });

    form.addEventListener("submit", async event => {
        event.preventDefault();

        // Honeypot: if this hidden field has a value, silently pretend success
        const honeypot = $('input[name="website"]', form);
        if (honeypot && honeypot.value) {
            form.reset();
            return;
        }

        if (!validate()) {
            showToast("Please fix the highlighted fields.", true);
            return;
        }

        const data = {
            name: fields.name.value.trim(),
            email: fields.email.value.trim(),
            message: fields.message.value.trim()
        };

        submitBtn.classList.add("loading");
        submitBtn.disabled = true;

        try {
            if (CONFIG.formEndpoint) {
                // Real delivery via a form-handling service (e.g. Formspree)
                const response = await fetch(CONFIG.formEndpoint, {
                    method: "POST",
                    headers: { Accept: "application/json", "Content-Type": "application/json" },
                    body: JSON.stringify(data)
                });
                if (!response.ok) throw new Error("Form endpoint responded with an error.");
                showToast("Message sent successfully!");
                form.reset();
            } else {
                // No backend configured — open the visitor's own email app instead,
                // which reliably delivers the message without any server.
                const subject = encodeURIComponent(`Portfolio inquiry from ${data.name}`);
                const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);
                window.location.href = `mailto:${CONFIG.email}?subject=${subject}&body=${body}`;
                showToast("Opening your email app to send the message…");
                form.reset();
            }
        } catch (error) {
            showToast("Something went wrong. Please email me directly.", true);
        } finally {
            submitBtn.classList.remove("loading");
            submitBtn.disabled = false;
        }
    });
})();


/* =============================================================================
   18. TOAST NOTIFICATIONS
============================================================================= */
const toast = $("#toast");
const toastMessage = $("#toastMessage");
let toastTimer;

function showToast(message, isError = false) {
    if (!toast || !toastMessage) return;
    toastMessage.textContent = message;
    toast.classList.toggle("error", isError);
    toast.querySelector("i").className = isError ? "fas fa-circle-exclamation" : "fas fa-circle-check";
    toast.classList.add("show");

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3200);
}


/* =============================================================================
   19. PARTICLE BACKGROUND  (built-in canvas — no external library needed)
   Replaces the old particles.js CDN dependency: one less network request,
   one less thing that can fail to load, and full control over styling.
   Particles drift slowly and connect with lines when close together;
   gently avoid the mouse on pointer-fine devices.
============================================================================= */
(function particleBackground() {
    const canvas = $("#bg-canvas");
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext("2d");
    let width, height, particles;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let mouse = { x: null, y: null };
    let rafId;

    function themeColor() {
        return document.documentElement.getAttribute("data-theme") === "light"
            ? "8, 145, 178"   // light theme accent (matches --cyan)
            : "86, 224, 255"; // dark theme accent
    }

    function resize() {
        width = canvas.width = window.innerWidth * dpr;
        height = canvas.height = window.innerHeight * dpr;
        canvas.style.width = window.innerWidth + "px";
        canvas.style.height = window.innerHeight + "px";
        const count = Math.min(CONFIG.particleMax, Math.floor((window.innerWidth * window.innerHeight) / CONFIG.particleDensity));
        particles = Array.from({ length: count }, createParticle);
    }

    function createParticle() {
        return {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.35 * dpr,
            vy: (Math.random() - 0.5) * 0.35 * dpr,
            r: (Math.random() * 1.6 + 0.6) * dpr
        };
    }

    function step() {
        ctx.clearRect(0, 0, width, height);
        const color = themeColor();

        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Gentle repulsion from the cursor
            if (mouse.x !== null) {
                const dx = p.x - mouse.x, dy = p.y - mouse.y;
                const dist = Math.hypot(dx, dy);
                const radius = 120 * dpr;
                if (dist < radius) {
                    const force = (radius - dist) / radius;
                    p.x += (dx / dist) * force * 1.6;
                    p.y += (dy / dist) * force * 1.6;
                }
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${color}, 0.55)`;
            ctx.fill();
        });

        // Connect nearby particles with faint lines
        const linkDist = 130 * dpr;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const dist = Math.hypot(a.x - b.x, a.y - b.y);
                if (dist < linkDist) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `rgba(${color}, ${0.14 * (1 - dist / linkDist)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }

        rafId = requestAnimationFrame(step);
    }

    window.addEventListener("mousemove", e => {
        mouse.x = e.clientX * dpr;
        mouse.y = e.clientY * dpr;
    }, { passive: true });
    window.addEventListener("mouseleave", () => { mouse.x = null; mouse.y = null; });

    // Pause entirely on hidden tabs to save battery/CPU
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            cancelAnimationFrame(rafId);
        } else {
            rafId = requestAnimationFrame(step);
        }
    });

    window.addEventListener("resize", debounce(resize, 200));
    resize();
    step();
})();


/* =============================================================================
   20. CURSOR + MAGNETIC BUTTONS + CARD TILT + SPOTLIGHT
   All grouped here because they share one mousemove listener for performance
   instead of each feature adding its own.
============================================================================= */
(function pointerEffects() {
    if (isTouch || prefersReducedMotion) return;

    document.documentElement.classList.add("custom-cursor");

    const dot = $("#cursor-dot");
    const ring = $("#cursor-ring");
    const magnetics = $$(".magnetic");
    const tilts = $$(".tilt");
    const spots = $$(".spot");

    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (dot) { dot.style.left = mouseX + "px"; dot.style.top = mouseY + "px"; }

        // .spot elements: expose cursor position as a CSS % for the radial glow
        spots.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (mouseX >= rect.left && mouseX <= rect.right && mouseY >= rect.top && mouseY <= rect.bottom) {
                el.style.setProperty("--mx", ((mouseX - rect.left) / rect.width) * 100 + "%");
                el.style.setProperty("--my", ((mouseY - rect.top) / rect.height) * 100 + "%");
            }
        });
    }, { passive: true });

    // Ring trails the dot with easing for a smooth "chasing" feel
    (function ringLoop() {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        if (ring) { ring.style.left = ringX + "px"; ring.style.top = ringY + "px"; }
        requestAnimationFrame(ringLoop);
    })();

    document.addEventListener("mouseover", e => {
        const interactive = e.target.closest("a, button, .cert-card, .project-card, input, textarea");
        document.documentElement.classList.toggle("cursor-hover", Boolean(interactive));
    });

    // Magnetic pull: buttons nudge toward the cursor within a small radius
    magnetics.forEach(el => {
        el.addEventListener("mousemove", e => {
            const rect = el.getBoundingClientRect();
            const relX = e.clientX - rect.left - rect.width / 2;
            const relY = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${relX * 0.25}px, ${relY * 0.3}px)`;
        });
        el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });

    // 3D tilt on certificate/project cards
    tilts.forEach(el => {
        el.addEventListener("mousemove", e => {
            const rect = el.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            el.style.setProperty("--rx", (relX * 8).toFixed(2) + "deg");
            el.style.setProperty("--ry", (relY * -8).toFixed(2) + "deg");
        });
        el.addEventListener("mouseleave", () => {
            el.style.setProperty("--rx", "0deg");
            el.style.setProperty("--ry", "0deg");
        });
    });
})();


/* =============================================================================
   21. ORBIT CLICK BURST  (small flourish — click the "PS" centre logo)
============================================================================= */
(function orbitBurst() {
    const core = $("#orbitCore");
    const orbit = $("#orbit");
    if (!core || !orbit || prefersReducedMotion) return;

    core.addEventListener("click", () => {
        for (let i = 0; i < 10; i++) {
            const particle = document.createElement("span");
            const angle = (Math.PI * 2 * i) / 10;
            particle.style.cssText = `
                position:absolute; left:50%; top:50%; width:6px; height:6px;
                border-radius:50%; background:var(--cyan); pointer-events:none;
                transition: transform .7s cubic-bezier(.16,1,.3,1), opacity .7s ease;
                transform: translate(-50%,-50%); opacity:1; z-index:5;`;
            orbit.appendChild(particle);

            requestAnimationFrame(() => {
                const dist = 90 + Math.random() * 40;
                particle.style.transform =
                    `translate(calc(-50% + ${Math.cos(angle) * dist}px), calc(-50% + ${Math.sin(angle) * dist}px))`;
                particle.style.opacity = "0";
            });

            setTimeout(() => particle.remove(), 750);
        }
        core.style.transform = "scale(0.9)";
        setTimeout(() => { core.style.transform = ""; }, 200);
    });
})();


/* =============================================================================
   22. MISC
============================================================================= */

// Friendly console signature (harmless, common developer-portfolio touch)
console.log(
    "%cHey, curious developer! \u{1F44B}",
    "color:#56e0ff;font-size:18px;font-weight:bold;"
);
console.log(
    "%cThis portfolio is open to feedback: " + CONFIG.email,
    "color:#9fb0c9;font-size:12px;"
);
