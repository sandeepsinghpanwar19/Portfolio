/* =========================================================
   PORTFOLIO V2.0 JAVASCRIPT
   PANWAR SANDEEPSINGH
========================================================= */


/* =========================================================
   LOADER
========================================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    setTimeout(() => {

        loader.classList.add("hide");

    }, 700);

});


/* =========================================================
   TYPING ANIMATION
========================================================= */

const words = [

    "Python Developer",
    "Django Developer",
    "AI / ML Enthusiast",
    "Android Developer",
    "Web Developer"

];

let wordIndex = 0;
let charIndex = 0;
let deleting = false;

const typing = document.getElementById("typing");


function typeWriter() {

    if (!typing) return;

    const currentWord = words[wordIndex];

    if (deleting) {

        charIndex--;

    } else {

        charIndex++;

    }

    typing.textContent =
        currentWord.substring(0, charIndex);


    let speed = deleting ? 55 : 100;


    if (!deleting && charIndex === currentWord.length) {

        speed = 1600;

        deleting = true;

    }

    else if (deleting && charIndex === 0) {

        deleting = false;

        wordIndex++;

        if (wordIndex >= words.length) {

            wordIndex = 0;

        }

        speed = 400;

    }


    setTimeout(typeWriter, speed);

}

typeWriter();


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle =
    document.getElementById("menuToggle");

const navLinks =
    document.getElementById("navLinks");

const navItems =
    document.querySelectorAll(".nav-link");


menuToggle.addEventListener("click", () => {

    navLinks.classList.toggle("open");

    menuToggle.classList.toggle("open");

});


navItems.forEach(link => {

    link.addEventListener("click", () => {

        navLinks.classList.remove("open");

    });

});


/* =========================================================
   HEADER SCROLL EFFECT
========================================================= */

const header =
    document.getElementById("header");

const scrollProgress =
    document.getElementById("scroll-progress");

const backToTop =
    document.getElementById("backToTop");


function handleScroll() {

    const scrollTop =
        window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

    const scrollPercent =
        (scrollTop / documentHeight) * 100;


    scrollProgress.style.width =
        `${scrollPercent}%`;


    if (scrollTop > 50) {

        header.classList.add("scrolled");

    } else {

        header.classList.remove("scrolled");

    }


    if (scrollTop > 500) {

        backToTop.classList.add("show");

    } else {

        backToTop.classList.remove("show");

    }

}

window.addEventListener("scroll", handleScroll);

handleScroll();


/* =========================================================
   BACK TO TOP
========================================================= */

backToTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* =========================================================
   SMOOTH NAVIGATION
========================================================= */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (event) {

        const targetId =
            this.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {

            return;

        }

        const target =
            document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({

            behavior: "smooth",

            block: "start"

        });

    });

});


/* =========================================================
   ACTIVE NAVIGATION
========================================================= */

const sections =
    document.querySelectorAll("section[id]");


function updateActiveNav() {

    let currentSection = "";

    sections.forEach(section => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            currentSection =
                section.getAttribute("id");

        }

    });


    navItems.forEach(link => {

        link.classList.remove("active");

        if (
            link.getAttribute("href") ===
            `#${currentSection}`
        ) {

            link.classList.add("active");

        }

    });

}

window.addEventListener(
    "scroll",
    updateActiveNav
);


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const revealElements =
    document.querySelectorAll(".reveal");


const revealObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                    revealObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.12
        }

    );


revealElements.forEach(element => {

    revealObserver.observe(element);

});


/* =========================================================
   SKILL BAR ANIMATION
========================================================= */

const progressBars =
    document.querySelectorAll(".progress");


const skillObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    const bar =
                        entry.target;

                    const width =
                        bar.dataset.width;

                    bar.style.width =
                        width;

                    skillObserver.unobserve(bar);

                }

            });

        },

        {
            threshold: 0.4
        }

    );


progressBars.forEach(bar => {

    skillObserver.observe(bar);

});


/* =========================================================
   COUNTER ANIMATION
========================================================= */

const counters =
    document.querySelectorAll("[data-target]");


function animateCounter(element) {

    const target =
        Number(element.dataset.target);

    let current = 0;

    const increment =
        Math.max(1, Math.ceil(target / 50));


    const updateCounter = () => {

        current += increment;

        if (current >= target) {

            element.textContent =
                target + (target === 100 ? "%" : "+");

            return;

        }

        element.textContent =
            current;

        requestAnimationFrame(updateCounter);

    };


    updateCounter();

}


const counterObserver =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    animateCounter(
                        entry.target
                    );

                    counterObserver.unobserve(
                        entry.target
                    );

                }

            });

        },

        {
            threshold: 0.5
        }

    );


counters.forEach(counter => {

    counterObserver.observe(counter);

});


/* =========================================================
   CERTIFICATION FILTER
========================================================= */

const certFilterButtons =
    document.querySelectorAll(".filter-btn");

const certCards =
    document.querySelectorAll(".cert-card");


certFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        certFilterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        const filter =
            button.dataset.filter;


        certCards.forEach(card => {

            const category =
                card.dataset.category;


            if (
                filter === "all" ||
                category === filter
            ) {

                card.classList.remove(
                    "filter-hidden"
                );

            } else {

                card.classList.add(
                    "filter-hidden"
                );

            }

        });

    });

});


/* =========================================================
   PROJECT FILTER
========================================================= */

const projectFilterButtons =
    document.querySelectorAll(
        ".project-filter"
    );

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );


projectFilterButtons.forEach(button => {

    button.addEventListener("click", () => {

        projectFilterButtons.forEach(btn => {

            btn.classList.remove("active");

        });

        button.classList.add("active");


        const filter =
            button.dataset.projectFilter;


        projectCards.forEach(card => {

            const categories =
                card.dataset.category
                    .split(" ");


            if (
                filter === "all" ||
                categories.includes(filter)
            ) {

                card.classList.remove(
                    "filter-hidden"
                );

            } else {

                card.classList.add(
                    "filter-hidden"
                );

            }

        });

    });

});


/* =========================================================
   MODAL
========================================================= */

const modal =
    document.getElementById("detailsModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalDescription =
    document.getElementById(
        "modalDescription"
    );

const modalTech =
    document.getElementById("modalTech");

const modalClose =
    document.querySelector(".modal-close");


const detailButtons =
    document.querySelectorAll(
        ".details-btn, .project-details"
    );


detailButtons.forEach(button => {

    button.addEventListener("click", () => {

        const title =
            button.dataset.title;

        const description =
            button.dataset.description;

        const tech =
            button.dataset.tech || "";


        modalTitle.textContent =
            title;

        modalDescription.textContent =
            description;


        modalTech.innerHTML = "";


        if (tech) {

            tech.split("•").forEach(item => {

                const span =
                    document.createElement("span");

                span.textContent =
                    item.trim();

                modalTech.appendChild(span);

            });

        }


        modal.classList.add("show");

        document.body.style.overflow =
            "hidden";

    });

});


function closeModal() {

    modal.classList.remove("show");

    document.body.style.overflow =
        "";

}


modalClose.addEventListener(
    "click",
    closeModal
);


modal.addEventListener(
    "click",
    event => {

        if (event.target === modal) {

            closeModal();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            modal.classList.contains("show")
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   THEME SWITCHER
========================================================= */

const themeToggle =
    document.getElementById(
        "themeToggle"
    );


const savedTheme =
    localStorage.getItem("portfolio-theme");


if (savedTheme === "light") {

    document.body.classList.add(
        "light-mode"
    );

    themeToggle.innerHTML =
        '<i class="fas fa-sun"></i>';

}


themeToggle.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "light-mode"
        );


        const isLight =
            document.body.classList.contains(
                "light-mode"
            );


        localStorage.setItem(
            "portfolio-theme",
            isLight ? "light" : "dark"
        );


        themeToggle.innerHTML =
            isLight
                ? '<i class="fas fa-sun"></i>'
                : '<i class="fas fa-moon"></i>';

    }
);


/* =========================================================
   COPY EMAIL
========================================================= */

const copyEmail =
    document.getElementById(
        "copyEmail"
    );


const email =
    "sandeepsinghpanwar1906@gmail.com";


copyEmail.addEventListener(
    "click",
    async () => {

        try {

            await navigator.clipboard.writeText(
                email
            );

            showToast(
                "Email copied successfully!"
            );

        } catch (error) {

            showToast(
                "Unable to copy email."
            );

        }

    }
);


/* =========================================================
   CONTACT FORM
========================================================= */

const contactForm =
    document.getElementById(
        "contactForm"
    );


contactForm.addEventListener(
    "submit",
    event => {

        event.preventDefault();


        const name =
            document.getElementById(
                "name"
            ).value.trim();

        const userEmail =
            document.getElementById(
                "email"
            ).value.trim();

        const message =
            document.getElementById(
                "message"
            ).value.trim();


        if (
            !name ||
            !userEmail ||
            !message
        ) {

            showToast(
                "Please fill in all fields."
            );

            return;

        }


        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (!emailPattern.test(userEmail)) {

            showToast(
                "Please enter a valid email."
            );

            return;

        }


        showToast(
            "Message validated successfully!"
        );


        contactForm.reset();

    }
);


/* =========================================================
   TOAST
========================================================= */

const toast =
    document.getElementById("toast");

const toastMessage =
    document.getElementById(
        "toastMessage"
    );

let toastTimer;


function showToast(message) {

    toastMessage.textContent =
        message;

    toast.classList.add("show");


    clearTimeout(toastTimer);


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 3000);

}


/* =========================================================
   PARTICLES.JS
========================================================= */

function initializeParticles() {

    if (
        typeof particlesJS ===
        "undefined"
    ) {

        console.warn(
            "Particles.js failed to load."
        );

        return;

    }


    particlesJS("particles-js", {

        particles: {

            number: {
                value: 65,
                density: {
                    enable: true,
                    value_area: 900
                }
            },

            color: {
                value: "#38bdf8"
            },

            shape: {
                type: "circle"
            },

            opacity: {
                value: 0.35,
                random: true
            },

            size: {
                value: 2.5,
                random: true
            },

            line_linked: {

                enable: true,

                distance: 145,

                color: "#38bdf8",

                opacity: 0.16,

                width: 1

            },

            move: {

                enable: true,

                speed: 1.2,

                direction: "none",

                random: false,

                straight: false,

                out_mode: "out"

            }

        },

        interactivity: {

            detect_on: "canvas",

            events: {

                onhover: {

                    enable: true,

                    mode: "repulse"

                },

                onclick: {

                    enable: true,

                    mode: "push"

                },

                resize: true

            },

            modes: {

                repulse: {

                    distance: 100,

                    duration: 0.4

                },

                push: {

                    particles_nb: 3

                }

            }

        },

        retina_detect: true

    });

}


initializeParticles();


/* =========================================================
   PARALLAX HERO EFFECT
========================================================= */

const heroContent =
    document.querySelector(
        ".hero-content"
    );


document.addEventListener(
    "mousemove",
    event => {

        if (
            window.innerWidth < 900 ||
            !heroContent
        ) {

            return;

        }


        const x =
            (window.innerWidth / 2 -
                event.clientX) / 70;

        const y =
            (window.innerHeight / 2 -
                event.clientY) / 70;


        heroContent.style.transform =
            `translate(${x}px, ${y}px)`;

    }
);


document.addEventListener(
    "mouseleave",
    () => {

        if (!heroContent) return;

        heroContent.style.transform =
            "translate(0, 0)";

    }
);


/* =========================================================
   PREVENT EMPTY SOCIAL LINKS
========================================================= */

document.querySelectorAll(
    '.social-links a[href="#"], .footer-socials a[href="#"]'
).forEach(link => {

    link.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showToast(
                "Add your social profile URL here."
            );

        }
    );

});


/* =========================================================
   CONSOLE MESSAGE
========================================================= */

console.log(
    "%cWelcome to Panwar Sandeepsingh's Portfolio!",
    "color:#38bdf8;font-size:18px;font-weight:bold;"
);

console.log(
    "%cPortfolio V2.0 loaded successfully.",
    "color:#818cf8;font-size:13px;"
);
