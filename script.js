document.addEventListener('DOMContentLoaded', () => {

    // ── LENIS SMOOTH SCROLL ─────────────────────
    const lenis = new Lenis({
        duration: 1.8,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        orientation: 'vertical',
    });

    // ── GSAP SETUP ──────────────────────────────
    gsap.registerPlugin(ScrollTrigger);

    // SINGLE RAF SYSTEM (IMPORTANT FIX)
    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // Sync GSAP ScrollTrigger with Lenis
    lenis.on('scroll', ScrollTrigger.update);

    // ── HERO ANIMATIONS ─────────────────────────
    const heroTl = gsap.timeline({ delay: 0.2 });

    heroTl
        .from('.badge-wrapper', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        })
        .from('.hero-title', {
            y: 60,
            opacity: 0,
            duration: 1.2,
            ease: 'power4.out'
        }, '-=0.4')
        .from('.hero-subtitle', {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        }, '-=0.8')
        .from('.hero-actions', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.hero-stats', {
            y: 20,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6')
        .from('.hero-visual', {
            scale: 0.85,
            opacity: 0,
            duration: 1.5,
            ease: 'power2.out'
        }, '-=1.2');

    // ── SCROLL-TRIGGERED REVEALS ─────────────────
    document.querySelectorAll('.subject-section').forEach(section => {

        const info = section.querySelector('.subject-info');
        const visual = section.querySelector('.subject-visual');

        if (info) {
            gsap.from(info, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    once: true
                },
                x: -40,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        }

        if (visual) {
            gsap.from(visual, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 75%',
                    once: true
                },
                x: 40,
                opacity: 0,
                duration: 1,
                ease: 'power3.out',
                delay: 0.15
            });
        }
    });

    // ── ABOUT SECTION ───────────────────────────
    const aboutGrid = document.querySelector('.about-grid');

    if (aboutGrid) {

        gsap.from('.about-info', {
            scrollTrigger: {
                trigger: aboutGrid,
                start: 'top 75%',
                once: true
            },
            x: -40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out'
        });

        gsap.from('.about-visual-box', {
            scrollTrigger: {
                trigger: aboutGrid,
                start: 'top 75%',
                once: true
            },
            x: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            delay: 0.15
        });
    }

    // ── STAGGER ANIMATIONS ──────────────────────
    gsap.from('.faculty-card', {
        scrollTrigger: {
            trigger: '.faculty-grid',
            start: 'top 85%',
            once: true
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });

    gsap.from('.gallery-item', {
        scrollTrigger: {
            trigger: '.gallery-grid',
            start: 'top 85%',
            once: true
        },
        y: 30,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: 'power3.out'
    });

    gsap.from('.faq-item', {
        scrollTrigger: {
            trigger: '.faq-container',
            start: 'top 85%',
            once: true
        },
        y: 20,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.08,
        ease: 'power3.out'
    });

    gsap.from('.admission-box', {
        scrollTrigger: {
            trigger: '.admission-box',
            start: 'top 80%',
            once: true
        },
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
    });

    // ── NAVBAR ──────────────────────────────────
    let lastScroll = 0;

    const navbar = document.querySelector('.navbar');
    const backToTop = document.getElementById('back-to-top');
    const heroVisual = document.querySelector('.hero-visual');

    // SINGLE SCROLL LISTENER (PERFORMANCE FIX)
    lenis.on('scroll', ({ scroll }) => {

        // Navbar
        if (scroll > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        navbar.classList.remove('hidden');

        lastScroll = scroll;

        // Back to top
        if (backToTop) {
            if (scroll > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }

        // Hero parallax (optimized)
        if (heroVisual && window.innerWidth > 768) {
            gsap.set(heroVisual, {
                y: scroll * 0.08
            });
        }
    });

    // ── MOBILE SIDE NAV ─────────────────────────
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sideNav = document.querySelector('.side-nav');
    const navClose = document.querySelector('.nav-close');
    const sideLinks = document.querySelectorAll('.side-link');

    const openMenu = () => {
        sideNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
    };

    const closeMenu = () => {
        sideNav.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    };

    if (mobileToggle) {
        mobileToggle.addEventListener('click', openMenu);
    }

    if (navClose) {
        navClose.addEventListener('click', closeMenu);
    }

    sideLinks.forEach(link => {

        link.addEventListener('click', (e) => {

            e.preventDefault();

            const target = link.getAttribute('href');

            closeMenu();

            setTimeout(() => {

                lenis.scrollTo(target, {
                    duration: 2,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });

            }, 300);
        });
    });

    // ── SMOOTH LINK SCROLL ──────────────────────
    document.querySelectorAll('.nav-link, .footer-col a[href^="#"], .btn[href^="#"]').forEach(link => {

        link.addEventListener('click', (e) => {

            const href = link.getAttribute('href');

            if (href && href.startsWith('#') && href.length > 1) {

                const target = document.querySelector(href);

                if (target) {

                    e.preventDefault();

                    lenis.scrollTo(target, {
                        duration: 2,
                        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                    });
                }
            }
        });
    });

    // ── WHATSAPP MODAL ──────────────────────────
    const waModal = document.getElementById('whatsapp-modal');
    const waTrigger = document.getElementById('floating-whatsapp-trigger');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    const waNumber = "919600296734";

    const openModal = () => {
        waModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        lenis.stop();
    };

    const closeModal = () => {
        waModal.classList.remove('active');
        document.body.style.overflow = '';
        lenis.start();
    };

    if (waTrigger) waTrigger.addEventListener('click', openModal);
    if (modalClose) modalClose.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // ── ESCAPE KEY ──────────────────────────────
    document.addEventListener('keydown', (e) => {

        if (e.key === 'Escape') {
            closeModal();
            closeMenu();
        }
    });

    // ── WHATSAPP FUNCTIONS ──────────────────────
    const buildWhatsAppMsg = (classVal) =>
        `Hello Gurukula Tuitions, I am interested in enrolling my child (Class ${classVal}) in your institute. I would like to know more details.`;

    const modalWAbtn = document.getElementById('modal-whatsapp-chat-btn');
    const modalClassSelect = document.getElementById('modal-student-class');

    if (modalWAbtn && modalClassSelect) {

        modalWAbtn.addEventListener('click', () => {

            const msg = buildWhatsAppMsg(modalClassSelect.value);

            window.open(
                `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
                '_blank'
            );

            closeModal();
        });
    }

    const enquiryBtn = document.getElementById('whatsapp-chat-btn');
    const classDropdown = document.getElementById('student-class');

    if (enquiryBtn && classDropdown) {

        enquiryBtn.addEventListener('click', () => {

            const msg = buildWhatsAppMsg(classDropdown.value);

            window.open(
                `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`,
                '_blank'
            );
        });
    }

    // ── CALL BUTTON ─────────────────────────────
    const callBtn = document.querySelector('.call-card .btn-primary');

    if (callBtn) {

        callBtn.addEventListener('click', () => {
            window.location.href = 'tel:+919600296734';
        });
    }

    // ── MAGNETIC EFFECTS ────────────────────────
    // DISABLED ON MOBILE FOR PERFORMANCE
    if (window.innerWidth > 768) {

        document.querySelectorAll('.magnetic').forEach(el => {

            el.addEventListener('mousemove', (e) => {

                const rect = el.getBoundingClientRect();

                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                gsap.to(el, {
                    x: x * 0.25,
                    y: y * 0.25,
                    duration: 0.5,
                    ease: 'power2.out'
                });
            });

            el.addEventListener('mouseleave', () => {

                gsap.to(el, {
                    x: 0,
                    y: 0,
                    duration: 0.7,
                    ease: 'elastic.out(1, 0.4)'
                });
            });
        });
    }

    // ── FAQ ACCORDION ───────────────────────────
    document.querySelectorAll('.faq-question').forEach(question => {

        question.addEventListener('click', () => {

            const item = question.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item').forEach(i => {
                i.classList.remove('active');
            });

            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // ── BACK TO TOP ─────────────────────────────
    if (backToTop) {

        backToTop.addEventListener('click', () => {

            lenis.scrollTo(0, {
                duration: 2.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
            });
        });
    }

    // ── ACTIVE NAV LINK ─────────────────────────
    const navObserverOptions = {
        root: null,
        rootMargin: '-25% 0px -50% 0px',
        threshold: 0
    };

    const navSections = document.querySelectorAll('section[id]');

    const scrollObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const id = entry.target.id;

                document.querySelectorAll('.nav-link').forEach(link => {

                    const href = link.getAttribute('href');

                    const matches =
                        href === `#${id}` ||
                        (
                            href === '#subjects' &&
                            [
                                'math',
                                'physics',
                                'chemistry',
                                'biology',
                                'cs',
                                'commerce',
                                'humanities',
                                'english',
                                'history'
                            ].includes(id)
                        );

                    link.classList.toggle('active', matches);
                });
            }
        });

    }, navObserverOptions);

    navSections.forEach(el => scrollObserver.observe(el));

    // ── PARTICLES ───────────────────────────────
    // DELAYED + DISABLED ON MOBILE
    if (window.innerWidth > 768 && window.particlesJS) {

        window.addEventListener('load', () => {

            setTimeout(() => {

                particlesJS('particles-js', {
                    particles: {
                        number: {
                            value: 18,
                            density: {
                                enable: true,
                                value_area: 900
                            }
                        },
                        color: {
                            value: "#0f172a"
                        },
                        shape: {
                            type: "circle"
                        },
                        opacity: {
                            value: 0.03,
                            random: true
                        },
                        size: {
                            value: 2,
                            random: true
                        },
                        line_linked: {
                            enable: true,
                            distance: 180,
                            color: "#0f172a",
                            opacity: 0.03,
                            width: 1
                        },
                        move: {
                            enable: true,
                            speed: 0.5,
                            direction: "none",
                            random: true,
                            out_mode: "out"
                        }
                    },
                    interactivity: {
                        detect_on: "canvas",
                        events: {
                            onhover: { enable: false },
                            onclick: { enable: false }
                        }
                    },
                    retina_detect: true
                });

            }, 500);
        });
    }

    // ── SECTION NUMBER COLORS ───────────────────
    const accentMap = {
        'math-section': 'var(--accent-math)',
        'physics-section': 'rgba(255,255,255,0.3)',
        'chemistry-section': 'var(--accent-chem)',
        'biology-section': 'var(--accent-bio)',
        'cs-section': 'rgba(255,255,255,0.3)',
        'commerce-section': 'var(--accent-commerce)',
        'english-section': 'var(--accent-english)',
        'history-section': 'var(--accent-history-light)'
    };

    Object.entries(accentMap).forEach(([cls, color]) => {

        const el = document.querySelector(`.${cls} .section-number`);

        if (el) {
            el.style.color = color;
        }
    });

    // ── REFRESH ─────────────────────────────────
    window.addEventListener('load', () => {
        ScrollTrigger.refresh();
    });

    console.log('✅ Gurukula Tuitions — Optimized systems initialized');
    console.log('hello');

});