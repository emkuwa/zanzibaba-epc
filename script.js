// ============================================
// ZANZIBABA EPC - Interactive Features
// UX Redesign: Progressive Disclosure & Mobile
// ============================================

document.addEventListener('DOMContentLoaded', function() {

  // ==========================================
  // NAVBAR SCROLL EFFECT
  // ==========================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // ==========================================
  // MOBILE MENU TOGGLE
  // ==========================================
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navLinks.classList.toggle('active');
      document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
    });

    // Close mobile menu when clicking a nav link
    navLinks.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close on Escape
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && navLinks.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navLinks.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ==========================================
  // SMOOTH SCROLL FOR ANCHOR LINKS
  // ==========================================
  document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
    anchor.addEventListener('click', function(e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerOffset = 80;
        var elementPosition = target.getBoundingClientRect().top;
        var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    });
  });

  // ==========================================
  // PROGRESSIVE DISCLOSURE - READ MORE BUTTONS
  // ==========================================
  document.querySelectorAll('.btn-read-more').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var targetId = this.getAttribute('data-target');
      var target = document.getElementById(targetId);
      if (!target) return;

      var isExpanded = target.classList.contains('expanded');
      target.classList.toggle('expanded');
      this.classList.toggle('active');

      // Update button text
      var textEl = this.querySelector('.btn-read-more-text');
      if (textEl) {
        if (!isExpanded) {
          textEl.textContent = 'Show Less';
        } else {
          var originalTexts = {
            'about-details': 'Learn More',
            'leadership-details': 'Read Full Message',
            'materials-details': 'View Full Product List',
            'procurement-details': 'View All Procurement Services'
          };
          textEl.textContent = originalTexts[targetId] || 'Read More';
        }
      }
    });
  });

  // ==========================================
  // EXPANDABLE SERVICE SECTIONS
  // ==========================================
  function waitForImages(container) {
    var images = container.querySelectorAll('img');
    var promises = [];
    images.forEach(function(img) {
      if (img.complete) return;
      promises.push(new Promise(function(resolve) {
        img.addEventListener('load', resolve);
        img.addEventListener('error', resolve);
      }));
    });
    return Promise.all(promises);
  }

  function expandContainer(contentEl) {
    contentEl.style.height = '0px';
    contentEl.style.overflow = 'hidden';
    waitForImages(contentEl).then(function() {
      var targetH = contentEl.scrollHeight;
      contentEl.style.height = targetH + 'px';
      setTimeout(function() {
        contentEl.style.height = 'auto';
        contentEl.style.overflow = 'visible';
      }, 550);
    });
  }

  function collapseContainer(contentEl) {
    contentEl.style.height = contentEl.scrollHeight + 'px';
    contentEl.offsetHeight;
    contentEl.style.height = '0px';
    contentEl.style.overflow = 'hidden';
  }

  document.querySelectorAll('.service-expandable-header').forEach(function(header) {
    header.addEventListener('click', function() {
      var parent = this.closest('.service-expandable');
      if (!parent) return;
      var content = parent.querySelector('.service-expandable-content');
      if (!content) return;
      var isActive = parent.classList.contains('active');

      if (isActive) {
        collapseContainer(content);
        parent.classList.remove('active');
      } else {
        // Close all other open service accordions
        document.querySelectorAll('.service-expandable.active').forEach(function(other) {
          if (other !== parent) {
            var otherContent = other.querySelector('.service-expandable-content');
            if (otherContent) collapseContainer(otherContent);
            other.classList.remove('active');
          }
        });
        parent.classList.add('active');
        expandContainer(content);
        // Scroll into view after short delay
        setTimeout(function() {
          parent.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      }
    });
  });

  // ==========================================
  // EXPANDABLE SUB-SECTIONS (within services)
  // ==========================================
  document.querySelectorAll('.service-sub-header').forEach(function(header) {
    header.addEventListener('click', function(e) {
      e.stopPropagation();
      var parent = this.closest('.service-sub-expandable');
      if (!parent) return;
      var content = parent.querySelector('.service-sub-content');
      if (!content) return;
      var isActive = parent.classList.contains('active');

      if (isActive) {
        collapseContainer(content);
        parent.classList.remove('active');
      } else {
        // Close other sub-sections within the same parent
        var parentService = parent.closest('.service-expandable-content');
        if (parentService) {
          parentService.querySelectorAll('.service-sub-expandable.active').forEach(function(other) {
            if (other !== parent) {
              var otherContent = other.querySelector('.service-sub-content');
              if (otherContent) collapseContainer(otherContent);
              other.classList.remove('active');
            }
          });
        }
        parent.classList.add('active');
        expandContainer(content);
      }
    });
  });

  // ==========================================
  // SCROLL ANIMATIONS
  // ==========================================
  var observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.animate-on-scroll').forEach(function(el) {
    observer.observe(el);
  });

  // ==========================================
  // ACTIVE NAV LINK ON SCROLL
  // ==========================================
  var sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', function() {
    var current = '';
    sections.forEach(function(section) {
      var sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 200) {
        current = section.getAttribute('id');
      }
    });
    document.querySelectorAll('.nav-links a').forEach(function(link) {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = 'var(--accent-blue)';
      }
    });
  });

  // ==========================================
  // FORM SUBMISSION
  // ==========================================
  var contactForm = document.querySelector('.contact-form-compact form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      var name = document.getElementById('name').value;
      var email = document.getElementById('email').value;
      if (!name || !email) {
        alert('Please fill in all required fields.');
        return;
      }
      alert('Thank you for your message! We will get back to you soon.');
      this.reset();
    });
  }

  // ==========================================
  // KEYBOARD ACCESSIBILITY
  // ==========================================
  document.querySelectorAll('.service-expandable-header, .service-sub-header').forEach(function(el) {
    el.setAttribute('tabindex', '0');
    el.setAttribute('role', 'button');
    el.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  });

  // ==========================================
  // PRINT FUNCTIONALITY
  // ==========================================
  window.printProfile = function() {
    window.print();
  };

});

// Utility function for smooth scrolling
function scrollToSection(sectionId) {
  var section = document.getElementById(sectionId);
  if (section) {
    var headerOffset = 80;
    var elementPosition = section.getBoundingClientRect().top;
    var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
  }
}
