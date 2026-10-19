import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';
import type { Tone } from '@/lib/utils';

const TONE_CLASSES: Record<Tone, string> = {
    neutral: 'border-line bg-raised text-soft',
    success: 'border-success/30 bg-success/10 text-success',
    warning: 'border-sun/30 bg-sun/10 text-sun',
    danger: 'border-danger/30 bg-danger/10 text-danger',
    info: 'border-soft/25 bg-soft/10 text-soft',
    clay: 'border-clay/30 bg-clay/10 text-clay',
};

interface BadgeProps {
    tone?: Tone;
    children: ReactNode;
    className?: string;
}

export default function Badge({ tone = 'neutral', children, className }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] leading-none font-medium tracking-[0.12em] uppercase',
                TONE_CLASSES[tone],
                className,
            )}
        >
            {children}
        </span>
    );
}
