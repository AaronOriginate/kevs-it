import { useState, useEffect } from 'react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Services', href: '/services' },
  { label: 'Contact', href: '/contact' },
];

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* Hamburger button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5"
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isOpen}
      >
        <span
          className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-2' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-text-primary transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-2' : ''
          }`}
        />
      </button>

      {/* Mobile menu overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl lg:hidden"
          onClick={() => setIsOpen(false)}
        >
          <nav
            className="flex flex-col items-center justify-center h-full gap-8"
            onClick={(e) => e.stopPropagation()}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[24px] uppercase tracking-normal text-text-primary hover:text-cyan transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <a
              href="/contact"
              className="mt-4 inline-flex items-center justify-center px-8 py-4 bg-cyan text-black text-[16px] uppercase tracking-normal hover:brightness-110 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              Book a Meeting
            </a>
          </nav>
        </div>
      )}
    </>
  );
}
