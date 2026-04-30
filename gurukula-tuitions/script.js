document.addEventListener('DOMContentLoaded', () => {

    // 1. CONSTANTS & DOM ELEMENTS
    const navbar      = document.getElementById('navbar');
    const backToTop   = document.getElementById('backToTop');
    const hamburger   = document.getElementById('hamburger');
    const mobileNav   = document.getElementById('mobileNav');
    const closeMobileNav = document.getElementById('closeMobileNav');
    const overlay     = document.getElementById('overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const navLinks    = document.querySelectorAll('.nav-links a');
    const admissionForm = document.getElementById('admissionForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn   = document.getElementById('submitBtn');

    const NAV_HEIGHT = 82;

    // 2. STICKY NAVBAR & BACK TO TOP
    //    FIX 9: Scroll handler wrapped in requestAnimationFrame throttle.
    //    This means handleScroll runs at most once per animation frame (~60fps cap)
    //    instead of firing on every tiny scroll delta — prevents main-thread overload.
    const handleScroll = () => {
        const scrollY = window.scrollY;

        navbar.classList.toggle('scrolled', scrollY > 50);
        backToTop.classList.toggle('show', scrollY > 500);

        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#home');
            });
        }
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    handleScroll(); // run once on load

    // 3. SMOOTH NAVIGATION
    const smoothScroll = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            e.preventDefault();
            if (mobileNav.classList.contains('open')) toggleMenu();
            smoothScroll(href);
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. ACTIVE LINK TRACKING (IntersectionObserver — zero scroll cost)
    const sections = document.querySelectorAll('header[id], section[id]');

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
                mobileLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        rootMargin: `-${NAV_HEIGHT}px 0px -70% 0px`,
        threshold: 0
    });

    sections.forEach(section => activeNavObserver.observe(section));

    // 5. MOBILE NAVIGATION TOGGLE
    const toggleMenu = () => {
        mobileNav.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
    };

    hamburger.addEventListener('click', toggleMenu);
    closeMobileNav.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // 6. SCROLL REVEAL (IntersectionObserver — no scroll listener needed)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // stop watching once revealed
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. COUNTER ANIMATION
    //    FIX 10: Added 200ms defer before starting counter + reduced duration to 1200ms.
    //    Previously started at 2000ms immediately on intersection, competing with
    //    fonts/images still loading on hero entry. The defer gives the browser
    //    a moment to settle before kicking off the 60fps rAF loop.
    const stats = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                counterObserver.unobserve(stat);

                setTimeout(() => {
                    const fullText = stat.innerText;
                    const match = fullText.match(/(\d+)(.*)/);
                    if (!match) return;

                    const target    = parseInt(match[1]);
                    const suffix    = match[2];
                    const duration  = 1200; // was 2000ms — snappier and less main-thread time
                    const frameRate = 1000 / 60;
                    const totalFrames = Math.round(duration / frameRate);
                    const increment = target / totalFrames;
                    let count = 0;

                    const updateCount = () => {
                        count += increment;
                        if (count < target) {
                            stat.innerText = Math.round(count) + suffix;
                            requestAnimationFrame(updateCount);
                        } else {
                            stat.innerText = target + suffix;
                        }
                    };

                    updateCount();
                }, 200); // defer start by 200ms
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => counterObserver.observe(stat));

    // 8. FAQ ACCORDION
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            faqItems.forEach(other => other.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 9. ADMISSION FORM — WhatsApp redirect
    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const studentName = document.getElementById('studentName').value;
            const parentName  = document.getElementById('parentName').value;
            const phone       = document.getElementById('phone').value;
            const grade       = document.getElementById('grade').value;
            const school      = document.getElementById('school').value;
            const subjects    = document.getElementById('subjectsInterested').value;
            const userMessage = document.getElementById('message').value;

            if (phone.length < 10) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            const phoneNumber = "919600296734";
            const waMessage =
                `*New Admission Enquiry - Gurukula Tuitions*%0A%0A` +
                `*Student:* ${studentName}%0A` +
                `*Parent:* ${parentName}%0A` +
                `*Grade:* ${grade}%0A` +
                `*School:* ${school}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Subjects:* ${subjects}%0A` +
                `*Additional Info:* ${userMessage || 'N/A'}`;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting...';
            submitBtn.disabled = true;

            setTimeout(() => {
                window.open(`https://wa.me/${phoneNumber}?text=${waMessage}`, '_blank');
                admissionForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 800);
        });
    }

    // 10. WHATSAPP FLOATING BUTTON
    const waToggle  = document.getElementById('waToggle');
    const waOptions = document.getElementById('waOptions');
    const waGrade   = document.getElementById('waGrade');
    const waSendBtn = document.getElementById('waSendBtn');

    if (waToggle && waOptions) {
        waToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            waOptions.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!waOptions.contains(e.target) && e.target !== waToggle) {
                waOptions.classList.remove('active');
            }
        });

        waSendBtn.addEventListener('click', () => {
            const grade = waGrade.value;
            const message = `Hello Gurukula Tuitions, I am interested in enrolling my child (Class ${grade}) in your institute. I would like to know more details.`;
            window.open(`https://wa.me/919600296734?text=${encodeURIComponent(message)}`, '_blank');
            waOptions.classList.remove('active');
        });
    }

    // 11. GALLERY LIGHTBOX
    //     FIX 11: Lightbox DOM is created once (already was), but we also now
    //     reuse the existing img element's currentSrc so the browser serves
    //     from cache instead of making a fresh network request on each open.
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Create lightbox once and reuse
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightboxImg" decoding="async">
        <div class="lightbox-caption" id="lightboxCaption"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg     = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn        = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img     = item.querySelector('img');
            const caption = item.querySelector('span').innerText;

            // Use currentSrc (respects srcset/cache) with fallback to src
            lightboxImg.src       = img.currentSrc || img.src;
            lightboxCaption.innerText = caption;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Close lightbox on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
    // 12. MOBILE AUTO-HOVER (Scroll-triggered hover for cards & buttons)
    // This feature enhances mobile UX by automatically triggering hover effects
    // as elements enter the middle of the screen.
    const autoHoverElements = document.querySelectorAll('.why-card, .program-card, .faculty-card, .gallery-item, .testi-card, .btn, .subject-tags span, .faq-item');
    
    if (window.innerWidth < 1024) {
        const autoHoverObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Only one element should be hovered at a time
                    autoHoverElements.forEach(el => el.classList.remove('auto-hover'));
                    entry.target.classList.add('auto-hover');
                } else {
                    entry.target.classList.remove('auto-hover');
                }
            });
        }, {
            // Target elements when they are in the middle 20% of the viewport
            rootMargin: '-40% 0px -40% 0px',
            threshold: 0
        });

        autoHoverElements.forEach(el => autoHoverObserver.observe(el));
    }
});