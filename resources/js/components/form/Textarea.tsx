import { forwardRef } from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    error?: string;
    hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    function Textarea({ className, error, hint, id, ...props }, ref) {
        return (
            <div>
                <textarea
                    ref={ref}
                    id={id}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={
                        error ? `${id}-error` : hint ? `${id}-hint` : undefined
                    }
                    className={cn(
                        'min-h-28 w-full rounded-sm border border-line bg-surface px-3.5 py-3 text-[14px] leading-relaxed text-ink transition-colors placeholder:text-muted focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-60',
                        error && 'border-danger focus:border-danger',
                        className,
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p
                        id={`${id}-hint`}
                        className="mt-1.5 text-[11px] text-muted"
                    >
                        {hint}
                    </p>
                )}
                {error && (
                    <p
                        id={`${id}-error`}
                        className="mt-1.5 text-[11px] text-danger"
                    >
                        {error}
                    </p>
                )}
            </div>
        );
    },
);

export default Textarea;
