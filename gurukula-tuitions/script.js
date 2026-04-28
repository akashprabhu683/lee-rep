document.addEventListener('DOMContentLoaded', () => {
    // 1. STICKY NAVBAR & BACK TO TOP
    const navbar = document.getElementById('navbar');
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        updateActiveNav()
    }, { passive: true });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 2. MOBILE NAVIGATION
    const hamburger = document.getElementById('hamburger');
    const mobileNav = document.getElementById('mobileNav');
    const closeMobileNav = document.getElementById('closeMobileNav');
    const overlay = document.getElementById('overlay');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');

    const toggleMenu = () => {
        mobileNav.classList.toggle('open');
        overlay.classList.toggle('active');
        document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : 'auto';
    };

    hamburger.addEventListener('click', toggleMenu);
    closeMobileNav.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 3. SCROLL REVEAL ANIMATION
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.2, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. FAQ ACCORDION
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
            });
            
            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
            }
        });
    });

    // 5. ADMISSION FORM HANDLING
    const admissionForm = document.getElementById('admissionForm');
    const formSuccess = document.getElementById('formSuccess');
    const submitBtn = document.getElementById('submitBtn');

    if (admissionForm) {
        admissionForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Collect Form Data
            const studentName = document.getElementById('studentName').value;
            const parentName = document.getElementById('parentName').value;
            const phone = document.getElementById('phone').value;
            const grade = document.getElementById('grade').value;
            const school = document.getElementById('school').value;
            const subjects = document.getElementById('subjectsInterested').value;
            const userMessage = document.getElementById('message').value;

            // Validation
            if (phone.length < 10) {
                alert('Please enter a valid 10-digit phone number.');
                return;
            }

            // Format WhatsApp Message
            const phoneNumber = "919600296734";
            const waMessage = `*New Admission Enquiry - Gurukula Tuitions*%0A%0A` +
                `*Student:* ${studentName}%0A` +
                `*Parent:* ${parentName}%0A` +
                `*Grade:* ${grade}%0A` +
                `*School:* ${school}%0A` +
                `*Phone:* ${phone}%0A` +
                `*Subjects:* ${subjects}%0A` +
                `*Additional Info:* ${userMessage || 'N/A'}`;

            // Show loading state briefly
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Redirecting to WhatsApp...';
            submitBtn.disabled = true;

            // Redirect to WhatsApp
            setTimeout(() => {
                window.open(`https://wa.me/${phoneNumber}?text=${waMessage}`, '_blank');
                
                // Show success state on site
                admissionForm.style.display = 'none';
                formSuccess.style.display = 'block';
                formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 1000);
        });
    }

    // 6. ACTIVE NAV LINK ON SCROLL (scroll-based — most reliable for SPAs)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const NAV_HEIGHT = 90;

    function updateActiveNav() {
        const scrollY = window.scrollY;
        let current = '';

        sections.forEach((section) => {
            const sectionTop = section.offsetTop - NAV_HEIGHT - 10;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav(); // run on load

    // 7. COUNTER ANIMATION
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        const fullText = stat.innerText;
        const match = fullText.match(/(\d+)(.*)/);
        if (!match) return;
        
        const target = parseInt(match[1]);
        const suffix = match[2];
        
        let count = 0;
        const updateCount = () => {
            const speed = target / 40;
            if (count < target) {
                count += speed;
                stat.innerText = Math.ceil(count) + suffix;
                setTimeout(updateCount, 25);
            } else {
                stat.innerText = target + suffix;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCount();
                observer.unobserve(entries[0].target);
            }
        }, { threshold: 0.5 });
        observer.observe(stat);
    });

    // 8. GALLERY LIGHTBOX
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    // Create Lightbox Elements
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

    // 9. WHATSAPP ENQUIRY LOGIC
    const waToggle = document.getElementById('waToggle');
    const waOptions = document.getElementById('waOptions');
    const waGrade = document.getElementById('waGrade');
    const waSendBtn = document.getElementById('waSendBtn');

    if (waToggle && waOptions) {
        waToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            waOptions.classList.toggle('active');
        });

        // Close when clicking outside
        document.addEventListener('click', (e) => {
            if (!waOptions.contains(e.target) && e.target !== waToggle) {
                waOptions.classList.remove('active');
            }
        });

        waSendBtn.addEventListener('click', () => {
            const grade = waGrade.value;
            const phoneNumber = "919600296734";
            const message = `Hello Gurukula Tuitions, I am interested in enrolling my child (Class ${grade}) in your institute. I would like to know more about the batch timings, fee structure, and other necessary admission details. Could you please provide this information? Thank you.`;
            
            const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            waOptions.classList.remove('active');
        });
    }

    // SMOOTH SCROLL WITH PRECISE OFFSET
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId.startsWith('#')) return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                
                // Close mobile nav if open
                if (mobileNav.classList.contains('open')) {
                    toggleMenu();
                }

                const navHeight = 82;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        });
    });
});
