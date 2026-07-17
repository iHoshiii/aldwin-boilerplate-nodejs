import { useEffect, useRef } from 'react';

/**
 * ScrollReveal
 * Wraps children in a div that animates into view on scroll.
 * Variants: 'reveal' | 'reveal-left' | 'reveal-right' | 'reveal-scale'
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {string}  [props.className]
 * @param {'reveal'|'reveal-left'|'reveal-right'|'reveal-scale'} [props.variant]
 * @param {number}  [props.delay]      - ms transition delay
 * @param {number}  [props.threshold]  - IntersectionObserver threshold 0–1
 * @param {boolean} [props.once]       - disconnect after first reveal
 */
export default function ScrollReveal({
  children,
  className = '',
  variant = 'reveal',
  delay = 0,
  threshold = 0.12,
  once = true,
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (delay) el.style.transitionDelay = `${delay}ms`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          if (once) observer.disconnect();
        } else if (!once) {
          el.classList.remove('is-visible');
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, threshold, once]);

  return (
    <div ref={ref} className={`${variant} ${className}`}>
      {children}
    </div>
  );
}
