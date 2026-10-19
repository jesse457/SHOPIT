import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface StatCardProps {
    label: string;
    value: string | number;
    meta?: string;
    icon?: ReactNode;
    className?: string;
}

export default function StatCard({
    label,
    value,
    meta,
    icon,
    className,
}: StatCardProps) {
    return (
        <div
            className={cn(
                'rounded-sm border border-line bg-surface p-5',
                className,
            )}
        >
            <div className="flex items-start justify-between gap-3">
                <p className="text-[10px] font-medium tracking-[0.12em] text-muted uppercase">
                    {label}
                </p>
                {icon && (
                    <span className="text-muted" aria-hidden="true">
                        {icon}
                    </span>
                )}
            </div>
            <p className="tabular mt-3 font-display text-[27px] leading-tight font-medium tracking-[-0.02em] break-words text-ink">
                {value}
            </p>
            {meta && <p className="mt-2 text-[11px] text-muted">{meta}</p>}
        </div>
    );
}
