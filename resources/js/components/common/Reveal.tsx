import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';

interface RevealProps {
    children: ReactNode;
    delay?: number;
    className?: string;
    as?: 'div' | 'li' | 'section' | 'article';
}

/**
 * Fade-and-rise on scroll entry. IntersectionObserver fires once per element,
 * so this stays off the scroll path. Reduced-motion users get a static render.
 */
export default function Reveal({
    children,
    delay = 0,
    className = '',
    as: Tag = 'div',
}: RevealProps) {
    const ref = useRef<HTMLElement>(null);
    const [shown, setShown] = useState(false);
    const [reduced, setReduced] = useState(
        () =>
            typeof window !== 'undefined' &&
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)');
        const onChange = (event: MediaQueryListEvent) =>
            setReduced(event.matches);

        query.addEventListener('change', onChange);

        return () => query.removeEventListener('change', onChange);
    }, []);

    useEffect(() => {
        const node = ref.current;

        if (!node || reduced) {
            setShown(true);

            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1, rootMargin: '0px 0px -60px 0px' },
        );

        observer.observe(node);

        return () => observer.disconnect();
    }, [reduced]);

    return (
        <Tag
            ref={ref as never}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
            className={`transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transition-none ${
                shown
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-6 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100'
            } ${className}`}
        >
            {children}
        </Tag>
    );
}
