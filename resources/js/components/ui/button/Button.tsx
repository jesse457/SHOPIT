import { Link } from '@inertiajs/react';
import { CircleNotch } from '@phosphor-icons/react';
import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonStyleOptions {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
}

const BASE_CLASSES =
    'inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-[background-color,border-color,color,transform] duration-200 focus-visible:outline-2 focus-visible:outline-clay focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px';

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
    primary: 'bg-ink text-canvas hover:bg-clay hover:text-canvas',
    secondary: 'border border-ink/25 text-ink hover:border-ink hover:bg-raised',
    ghost: 'text-soft hover:bg-raised hover:text-ink',
    danger: 'bg-danger text-canvas hover:bg-danger/90',
    link: 'h-auto !p-0 text-ink underline decoration-line underline-offset-4 hover:text-clay hover:decoration-clay',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
    sm: 'h-9 px-3.5 text-[13px]',
    md: 'h-11 px-5 text-sm',
    lg: 'h-12 px-7 text-[15px]',
    icon: 'h-10 w-10',
};

export function buttonStyles({
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className,
}: ButtonStyleOptions = {}): string {
    return cn(
        BASE_CLASSES,
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth && 'w-full',
        className,
    );
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    fullWidth?: boolean;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export function Button({
    variant,
    size,
    loading = false,
    fullWidth = false,
    startIcon,
    endIcon,
    className,
    children,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            className={buttonStyles({ variant, size, fullWidth, className })}
            disabled={disabled || loading}
            {...props}
        >
            {loading ? (
                <CircleNotch size={16} className="animate-spin" aria-hidden="true" />
            ) : (
                startIcon
            )}
            <span>{children}</span>
            {!loading && endIcon}
        </button>
    );
}

interface ButtonLinkProps extends Omit<ComponentProps<typeof Link>, 'className' | 'size'> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    fullWidth?: boolean;
    className?: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export function ButtonLink({
    variant,
    size,
    fullWidth = false,
    className,
    startIcon,
    endIcon,
    children,
    ...props
}: ButtonLinkProps) {
    return (
        <Link className={buttonStyles({ variant, size, fullWidth, className })} {...props}>
            {startIcon}
            <span>{children}</span>
            {endIcon}
        </Link>
    );
}
