document.addEventListener('DOMContentLoaded', () => {
    // 1. CONSTANTS & DOM ELEMENTS
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const closeMobileNav = document.getElementById('closeMobileNav');
    const overlay = document.getElementById('overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    const navLinks = document.querySelectorAll('.nav-links a');
    const admissionForm = document.getElementById('admissionForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');
    
    const NAV_HEIGHT = 82;

    // 2. STICKY NAVBAR & BACK TO TOP VISIBILITY
    const handleScroll = () => {
        const scrollY = window.scrollY;
        
        // Sticky Navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Back to Top
        if (scrollY > 500) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }

        // Force 'Home' active at the very top
        if (scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#home');
            });
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Init on load

    // 3. SMOOTH NAVIGATION (Modern Approach)
    const smoothScroll = (targetId) => {
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;

        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - NAV_HEIGHT;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            
            e.preventDefault();
            
            // Close mobile menu if open
            if (mobileNav.classList.contains('open')) {
                toggleMenu();
            }

            smoothScroll(href);
        });
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 4. ACTIVE LINK TRACKING (Intersection Observer - High Performance)
    const sections = document.querySelectorAll('header[id], section[id]');
    
    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // Update Desktop Nav
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });

                // Update Mobile Nav
                mobileLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, {
        // Trigger when section occupies the top portion of the viewport
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

    // 6. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 7. COUNTER ANIMATION
    const stats = document.querySelectorAll('.stat-num');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const stat = entry.target;
                const fullText = stat.innerText;
                const match = fullText.match(/(\d+)(.*)/);
                if (!match) return;

                const target = parseInt(match[1]);
                const suffix = match[2];
                let count = 0;
                const duration = 2000; // 2 seconds
                const frameRate = 1000 / 60;
                const totalFrames = Math.round(duration / frameRate);
                const increment = target / totalFrames;

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
                counterObserver.unobserve(stat);
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
            faqItems.forEach(otherItem => otherItem.classList.remove('active'));
            if (!isActive) item.classList.add('active');
        });
    });

    // 9. ADMISSION FORM HANDLING
    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const studentName = document.getElementById('studentName').value;
            const parentName = document.getElementById('parentName').value;
            const phone = document.getElementById('phone').value;
            const grade = document.getElementById('grade').value;
            const school = document.getElementById('school').value;
            const subjects = document.getElementById('subjectsInterested').value;
            const userMessage = document.getElementById('message').value;

            if (phone.length < 10) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            const phoneNumber = "919600296734";
            const waMessage = `*New Admission Enquiry - Gurukula Tuitions*%0A%0A` +
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
    const waToggle = document.getElementById('waToggle');
    const waOptions = document.getElementById('waOptions');
    const waGrade = document.getElementById('waGrade');
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
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <span class="lightbox-close">&times;</span>
        <img class="lightbox-content" id="lightboxImg">
        <div class="lightbox-caption" id="lightboxCaption"></div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const closeBtn = lightbox.querySelector('.lightbox-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            const caption = item.querySelector('span').innerText;
            lightbox.classList.add('active');
            lightboxImg.src = img.src;
            lightboxCaption.innerText = caption;
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
});
