import type { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    description?: string;
    action?: ReactNode;
}

export default function PageHeader({
    title,
    description,
    action,
}: PageHeaderProps) {
    return (
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-[clamp(1.9rem,3.6vw,2.9rem)] leading-[0.98] font-medium tracking-[-0.02em]">
                    {title}
                </h1>
                {description && (
                    <p className="mt-2 max-w-[60ch] text-[13px] leading-relaxed text-soft">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0">{action}</div>}
        </div>
    );
}
