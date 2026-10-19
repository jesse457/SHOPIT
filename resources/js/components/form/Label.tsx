import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface LabelProps {
    htmlFor?: string;
    children: ReactNode;
    className?: string;
}

export default function Label({ htmlFor, children, className }: LabelProps) {
    return (
        <label
            htmlFor={htmlFor}
            className={cn(
                'block text-[11px] font-medium tracking-[0.1em] text-muted uppercase',
                className,
            )}
        >
            {children}
        </label>
    );
}
