import { useEffect } from 'react';

/**
 * RevealObserver
 * Attaches a single IntersectionObserver to the document that adds
 * `.is-visible` to every element with a `.reveal*` class on scroll.
 * Mount once at the root of the app.
 */
export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );

    const attach = () => {
      document
        .querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale')
        .forEach((el) => observer.observe(el));
    };

    attach();
    const timer = setTimeout(attach, 300);

    return () => {
      observer.disconnect();
      clearTimeout(timer);
    };
  }, []);

  return null;
}
