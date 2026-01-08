// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  const contactForm = document.getElementById('contactForm');
  
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Get form values
      const name = document.getElementById('name')?.value.trim();
      const email = document.getElementById('email')?.value.trim();
      const phone = document.getElementById('phone')?.value.trim();
      const message = document.getElementById('message')?.value.trim();
      
      // Validation
      if (!name || !email || !phone || !message) {
        showAlert('Vui lòng điền đầy đủ thông tin!', 'danger');
        return;
      }
      
      if (!validateEmail(email)) {
        showAlert('Email không hợp lệ!', 'danger');
        return;
      }
      
      if (!validatePhone(phone)) {
        showAlert('Số điện thoại không hợp lệ (10-11 chữ số)!', 'danger');
        return;
      }
      
      // Success
      showAlert('Cảm ơn! Chúng tôi sẽ liên hệ lại sớm nhất.', 'success');
      contactForm.reset();
      
      // In production, send data to backend
      // sendFormData(name, email, phone, message);
    });
  }
});

// Email validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Phone validation (10-11 digits)
function validatePhone(phone) {
  const phoneRegex = /^[0-9]{10,11}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Show alert message
function showAlert(message, type) {
  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
  alertDiv.setAttribute('role', 'alert');
  alertDiv.innerHTML = `
    ${message}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  
  const contactSection = document.getElementById('contact');
  if (contactSection) {
    contactSection.insertBefore(alertDiv, contactSection.firstChild);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      alertDiv.remove();
    }, 5000);
  }
}

// ============================================
// SMOOTH SCROLL FOR NAVIGATION
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    
    // Skip if href is just "#"
    if (href === '#') return;
    
    e.preventDefault();
    const target = document.querySelector(href);
    
    if (target) {
      // Close mobile menu if open
      const navbarToggler = document.querySelector('.navbar-toggler');
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse?.classList.contains('show')) {
        navbarToggler.click();
      }

      // Smooth scroll with offset for navbar
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// ============================================
// NAVBAR STICKY EFFECT & SHADOW
// ============================================

let lastScrollY = 0;
let ticking = false;

function updateNavbar() {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
  } else {
    navbar.style.boxShadow = 'none';
  }
  ticking = false;
}

window.addEventListener('scroll', function() {
  lastScrollY = window.scrollY;
  
  if (!ticking) {
    window.requestAnimationFrame(updateNavbar);
    ticking = true;
  }
}, { passive: true });

// ============================================
// ACTIVE NAV LINK ON SCROLL
// ============================================

function updateActiveLink() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
  
  let current = '';
  
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    
    if (window.scrollY >= sectionTop - 150) {
      current = section.getAttribute('id');
    }
  });
  
  navLinks.forEach(link => {
    link.classList.remove('active');
    const href = link.getAttribute('href');
    
    if (href === `#${current}`) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveLink, { passive: true });
document.addEventListener('DOMContentLoaded', updateActiveLink);

// ============================================
// CARD HOVER ANIMATION (Desktop & Touch)
// ============================================

const cards = document.querySelectorAll('.destination-card');
const isTouchDevice = () => {
  return (('ontouchstart' in window) ||
          (navigator.maxTouchPoints > 0) ||
          (navigator.msMaxTouchPoints > 0));
};

cards.forEach(card => {
  if (!isTouchDevice()) {
    // Desktop hover effects
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-10px)';
      this.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
      this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
    });
  } else {
    // Touch effects
    card.addEventListener('touchstart', function() {
      this.style.transform = 'scale(0.95)';
      this.style.transition = 'all 0.2s ease';
    }, { passive: true });
    
    card.addEventListener('touchend', function() {
      this.style.transform = 'scale(1)';
    }, { passive: true });
  }
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        img.classList.add('loaded');
        observer.unobserve(img);
      }
    });
  });
  
  document.querySelectorAll('img').forEach(img => {
    imageObserver.observe(img);
  });
}

// ============================================
// COUNTER ANIMATION (Optional - for statistics)
// ============================================

function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// ============================================
// BACK TO TOP BUTTON
// ============================================

const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '↑';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Quay lại đầu trang');
backToTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  background-color: #d4a574;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  cursor: pointer;
  display: none;
  z-index: 99;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  font-weight: bold;
`;

document.body.appendChild(backToTopBtn);

let backToTopVisible = false;

window.addEventListener('scroll', function() {
  if (window.scrollY > 300 && !backToTopVisible) {
    backToTopBtn.style.display = 'block';
    backToTopVisible = true;
  } else if (window.scrollY <= 300 && backToTopVisible) {
    backToTopBtn.style.display = 'none';
    backToTopVisible = false;
  }
}, { passive: true });

backToTopBtn.addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

if (!isTouchDevice()) {
  backToTopBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'scale(1.1)';
    this.style.backgroundColor = '#b8956a';
  });

  backToTopBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'scale(1)';
    this.style.backgroundColor = '#d4a574';
  });
} else {
  backToTopBtn.addEventListener('touchstart', function() {
    this.style.opacity = '0.8';
  }, { passive: true });

  backToTopBtn.addEventListener('touchend', function() {
    this.style.opacity = '1';
  }, { passive: true });
}

// ============================================
// PAGE LOAD ANIMATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  // Fade in sections on scroll
  const observerOptions = {
    threshold: 0.05,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        sectionObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);
  
  document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'all 0.6s ease';
    sectionObserver.observe(section);
  });

  // First section should be visible immediately
  const firstSection = document.querySelector('section');
  if (firstSection) {
    firstSection.style.opacity = '1';
    firstSection.style.transform = 'translateY(0)';
  }
});

// ============================================
// MOBILE MENU CLOSE ON LINK CLICK
// ============================================

document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
  link.addEventListener('click', function() {
    const navbarToggler = document.querySelector('.navbar-toggler');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    if (navbarCollapse?.classList.contains('show')) {
      navbarToggler.click();
    }
  });
});

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Disable lazy loading for critical images
document.addEventListener('DOMContentLoaded', function() {
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    if (index < 3) {
      img.loading = 'eager';
    } else {
      img.loading = 'lazy';
    }
  });
});

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log('%cMini Tour Ninh Bình', 'font-size: 20px; font-weight: bold; color: #d4a574;');
console.log('Chào mừng bạn! 🌟 Khám phá vẻ đẹp Ninh Bình cùng chúng tôi.');
