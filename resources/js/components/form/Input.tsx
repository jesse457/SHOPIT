import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    error?: string;
    hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
    { className, error, hint, id, ...props },
    ref,
) {
    const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

    return (
        <div>
            <input
                ref={ref}
                id={id}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
                className={cn(
                    'h-11 w-full rounded-sm border border-line bg-surface px-3.5 text-[14px] text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
                    error && 'border-danger focus:border-danger',
                    className,
                )}
                {...props}
            />
            {hint && !error && (
                <p
                    id={`${id}-hint`}
                    className="mt-1.5 text-[11px] leading-relaxed text-muted"
                >
                    {hint}
                </p>
            )}
            {error && (
                <p
                    id={`${id}-error`}
                    className="mt-1.5 text-[11px] leading-relaxed text-danger"
                >
                    {error}
                </p>
            )}
        </div>
    );
});

export default Input;
