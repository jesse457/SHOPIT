import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';
import { usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { PageProps, ToastMessage, ToastType } from '@/types';

const TONE_CLASSES: Record<ToastType, string> = {
    success: 'border-success/35 bg-surface text-success',
    info: 'border-line bg-surface text-soft',
    error: 'border-danger/35 bg-surface text-danger',
};

function ToastIcon({ type }: { type: ToastType }) {
    const Icon = type === 'success' ? CheckCircle : type === 'error' ? WarningCircle : Info;

    return <Icon size={19} weight="fill" aria-hidden="true" />;
}

export default function ToastProvider() {
    const { toast } = usePage<PageProps>().props;
    const [message, setMessage] = useState<ToastMessage | null>(null);
    const timer = useRef<number | null>(null);

    useEffect(() => {
        if (!toast) {
            return;
        }

        setMessage(toast);

        if (timer.current) {
            window.clearTimeout(timer.current);
        }

        timer.current = window.setTimeout(() => setMessage(null), 4500);

        return () => {
            if (timer.current) {
                window.clearTimeout(timer.current);
            }
        };
    }, [toast]);

    useEffect(() => {
        const onShow = (event: Event) => {
            const detail = (event as CustomEvent<ToastMessage>).detail;

            if (detail?.message) {
                setMessage(detail);
            }
        };

        window.addEventListener('toast:show', onShow);

        return () => window.removeEventListener('toast:show', onShow);
    }, []);

    if (!message) {
        return null;
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'fixed bottom-6 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-sm border px-4 py-3 text-sm shadow-soft',
                TONE_CLASSES[message.type],
            )}
        >
            <ToastIcon type={message.type} />
            <p className="flex-1 leading-snug">{message.message}</p>
            <button
                type="button"
                onClick={() => setMessage(null)}
                aria-label="Dismiss notification"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-current/70 transition-colors hover:bg-raised hover:text-current"
            >
                <X size={15} aria-hidden="true" />
            </button>
        </div>
    );
}
