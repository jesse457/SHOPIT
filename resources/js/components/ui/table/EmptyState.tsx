import { Package } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: ReactNode;
    icon?: ReactNode;
    className?: string;
}

export default function EmptyState({
    title,
    description,
    action,
    icon,
    className = '',
}: EmptyStateProps) {
    return (
        <div
            className={cn(
                'flex flex-col items-center justify-center rounded-sm border border-dashed border-line bg-surface px-6 py-16 text-center',
                className,
            )}
        >
            <span className="text-muted" aria-hidden="true">
                {icon ?? <Package size={28} weight="regular" />}
            </span>
            <h3 className="mt-4 font-display text-[27px] leading-none font-medium text-ink">
                {title}
            </h3>
            {description && (
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-soft">
                    {description}
                </p>
            )}
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}
