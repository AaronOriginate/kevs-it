/**
 * Scroll-triggered animation utilities for Kevs IT v2.
 * Uses Intersection Observer + CSS classes. No heavy libraries.
 */

/** Observe elements with .fade-up or .pop-in and add .is-visible when in viewport */
export function fadeUpOnScroll(): void {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.querySelectorAll('.fade-up, .pop-in').forEach((el) => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  document.querySelectorAll('.fade-up, .pop-in').forEach((el) => {
    // Add anim-ready to hide element BEFORE observing — ensures content is visible if JS fails
    el.classList.add('anim-ready');
    observer.observe(el);
  });
}

/** Navbar scroll effect: transparent -> solid background + hide on scroll down, show on scroll up */
export function navbarScrollEffect(): void {
  if (typeof window === 'undefined') return;

  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 80;
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbar() {
    const currentScrollY = window.scrollY;

    // Near top: transparent, always visible
    if (currentScrollY <= SCROLL_THRESHOLD) {
      navbar!.classList.remove('navbar-solid');
      navbar!.classList.remove('navbar-hidden');
      lastScrollY = currentScrollY;
      ticking = false;
      return;
    }

    // Scrolling down past threshold: just hide, no solid bg flash
    if (currentScrollY > lastScrollY && currentScrollY > 200) {
      navbar!.classList.add('navbar-hidden');
      navbar!.classList.remove('navbar-solid');
    } else {
      // Scrolling up: show with solid background
      navbar!.classList.remove('navbar-hidden');
      navbar!.classList.add('navbar-solid');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateNavbar);
      ticking = true;
    }
  }, { passive: true });
  updateNavbar();
}

/** Counter animation using requestAnimationFrame */
export function counterAnimation(): void {
  if (typeof window === 'undefined') return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const counters = document.querySelectorAll<HTMLElement>('[data-counter]');
  if (counters.length === 0) return;

  if (prefersReducedMotion) {
    counters.forEach((el) => {
      el.textContent = el.dataset.counterFinal || el.dataset.counter || '';
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          animateCounter(el);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.15 }
  );

  counters.forEach((el) => observer.observe(el));
}

function animateCounter(el: HTMLElement): void {
  const finalValue = parseFloat(el.dataset.counter || '0');
  const finalText = el.dataset.counterFinal || '';
  const prefix = el.dataset.counterPrefix || '';
  const suffix = el.dataset.counterSuffix || '';
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const currentValue = Math.round(eased * finalValue);

    if (progress < 1) {
      el.textContent = prefix + currentValue.toLocaleString('en-GB') + suffix;
      requestAnimationFrame(update);
    } else {
      el.textContent = finalText || (prefix + finalValue.toLocaleString('en-GB') + suffix);
    }
  }

  requestAnimationFrame(update);
}

/** FAQ Accordion */
export function faqAccordion(): void {
  if (typeof window === 'undefined') return;

  const faqItems = document.querySelectorAll('[data-faq]');
  faqItems.forEach((item) => {
    const toggle = item.querySelector('.faq-toggle');
    const content = item.querySelector('.faq-content');
    const icon = item.querySelector('.faq-icon');

    if (!toggle || !content || !icon) return;

    toggle.addEventListener('click', () => {
      const isOpen = content.classList.contains('is-open');

      // Close all others
      faqItems.forEach((otherItem) => {
        const otherContent = otherItem.querySelector('.faq-content');
        const otherIcon = otherItem.querySelector('.faq-icon');
        const otherToggle = otherItem.querySelector('.faq-toggle');
        if (otherContent && otherIcon && otherToggle) {
          otherContent.classList.remove('is-open');
          otherIcon.classList.remove('is-open');
          otherToggle.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (!isOpen) {
        content.classList.add('is-open');
        icon.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/** Background gradient scroll effect: shifts from left-reveal to full overlay as you scroll */
export function bgGradientScroll(): void {
  if (typeof window === 'undefined') return;

  const gradient = document.getElementById('bg-gradient');
  if (!gradient) return;

  let ticking = false;

  function updateGradient() {
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;
    // Progress from 0 (top) to 1 (scrolled past one viewport)
    const progress = Math.min(scrollY / viewportHeight, 1);

    // At top: image visible everywhere, lighter on right side
    // As you scroll: everything gets darker evenly
    const leftOpacity = 0.5 + progress * 0.3;     // 0.5 -> 0.8
    const midOpacity = 0.3 + progress * 0.4;      // 0.3 -> 0.7
    const rightOpacity = 0.1 + progress * 0.6;    // 0.1 -> 0.7

    gradient!.style.background = `linear-gradient(to right, rgba(10,10,14,${leftOpacity}) 0%, rgba(10,10,14,${midOpacity}) 50%, rgba(10,10,14,${rightOpacity}) 100%)`;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateGradient);
      ticking = true;
    }
  }, { passive: true });
  updateGradient();
}

/** Initialize all animations */
export function initAnimations(): void {
  fadeUpOnScroll();
  navbarScrollEffect();
  counterAnimation();
  faqAccordion();
  bgGradientScroll();
}
