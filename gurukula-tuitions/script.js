// Hamburger Menu
const hamburger = document.getElementById('hamburger'), mobileNav = document.getElementById('mobileNav'), overlay = document.getElementById('overlay');
function toggleMenu() { hamburger.classList.toggle('open'); mobileNav.classList.toggle('open'); overlay.classList.toggle('show'); document.body.style.overflow = mobileNav.classList.contains('open') ? 'hidden' : '' }
hamburger.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);
document.querySelectorAll('.mobile-nav a').forEach(a => a.addEventListener('click', () => { if (mobileNav.classList.contains('open')) toggleMenu() }));

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 50) });

// Active link highlighting
const sections = document.querySelectorAll('section[id]');
const navLinksAll = [...document.querySelectorAll('.nav-links a'), ...document.querySelectorAll('.mobile-nav a')];
function setActiveLink() {
    let current = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id') });
    navLinksAll.forEach(a => { a.classList.toggle('active', a.getAttribute('href') === '#' + current) });
}
window.addEventListener('scroll', setActiveLink);
window.addEventListener('load', setActiveLink);

// Click event for snappy active state
navLinksAll.forEach(link => {
    link.addEventListener('click', function () {
        navLinksAll.forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
function checkReveal() {
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 80) el.classList.add('active');
    });
}
window.addEventListener('scroll', checkReveal);
window.addEventListener('load', checkReveal);

// Back to top
const backToTop = document.getElementById('backToTop');
const aboutSection = document.getElementById('about');
window.addEventListener('scroll', () => {
    if (window.scrollY > (aboutSection ? aboutSection.offsetTop - 100 : 500)) {
        backToTop.classList.add('show');
    } else {
        backToTop.classList.remove('show');
    }
});
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// WhatsApp Menu Toggle
const waButton = document.getElementById('waButton');
const contactWhatsApp = document.getElementById('contactWhatsApp');
const waMenu = document.getElementById('waMenu');
if (waMenu) {
    if (waButton) {
        waButton.addEventListener('click', (e) => {
            e.stopPropagation();
            waMenu.classList.toggle('show');
        });
    }
    if (contactWhatsApp) {
        contactWhatsApp.addEventListener('click', (e) => {
            e.stopPropagation();
            waMenu.classList.toggle('show');
        });
    }
    document.addEventListener('click', () => waMenu.classList.remove('show'));
}

function sendWAMsg(className) {
    const msg = `Hello, I’m interested in joining Gurukula Tuitions for ${className}. I’ve seen the details on your website. Could you please confirm availability and how to proceed with admission?`;
    const waUrl = `https://wa.me/919600296734?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
}

// Contact form
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = document.getElementById('form-name').value;
        const phone = document.getElementById('form-phone').value;
        const msg = document.getElementById('form-message').value;
        
        // Prepare mailto link
        const subject = encodeURIComponent(`Admission Inquiry - ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nPhone: ${phone}\n\nMessage:\n${msg}`);
        window.location.href = `mailto:info@gurukulatuitions.com?subject=${subject}&body=${body}`;
        
        // Show success UI
        contactForm.style.display = 'none';
        formSuccess.style.display = 'block';
        
        // Reset form data after short delay
        setTimeout(() => this.reset(), 1000);
    });
}

function resetFormUI() {
    contactForm.style.display = 'block';
    formSuccess.style.display = 'none';
}

// Counter animation
function animateCounters() {
    document.querySelectorAll('.hero-stat h3[data-count]').forEach(el => {
        const target = parseInt(el.getAttribute('data-count'));
        const suffix = el.textContent.replace(/[0-9]/g, '');
        const duration = 2000;
        const start = performance.now();
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            el.textContent = current + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    });
}
window.addEventListener('load', animateCounters);

// Add ripple effect dynamically
document.querySelectorAll('.btn').forEach(btn => {
    btn.classList.add('ripple');
});
