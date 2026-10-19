import { CheckCircle, Info, WarningCircle } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

import { cn } from '@/lib/utils';

type AlertVariant = 'success' | 'error' | 'info';

const STYLES: Record<AlertVariant, string> = {
    success: 'border-success/30 bg-success/10 text-success',
    error: 'border-danger/30 bg-danger/10 text-danger',
    info: 'border-line bg-raised text-soft',
};

const ICONS = {
    success: CheckCircle,
    error: WarningCircle,
    info: Info,
};

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
    className?: string;
}

export default function Alert({
    variant = 'info',
    title,
    children,
    className,
}: AlertProps) {
    const Icon = ICONS[variant];

    return (
        <div
            role={variant === 'error' ? 'alert' : 'status'}
            className={cn(
                'flex items-start gap-3 rounded-sm border px-4 py-3 text-[13px] leading-relaxed',
                STYLES[variant],
                className,
            )}
        >
            <Icon size={18} weight="fill" className="mt-0.5 shrink-0" aria-hidden="true" />
            <div>
                {title && <p className="font-medium">{title}</p>}
                <div className={title ? 'mt-0.5' : undefined}>{children}</div>
            </div>
        </div>
    );
}
