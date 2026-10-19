import { usePage } from '@inertiajs/react';
import { CheckCircle, Info, WarningCircle, X } from '@phosphor-icons/react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { PageProps, ToastMessage, ToastType } from '@/types';

const TONE_CLASSES: Record<ToastType, string> = {
    success: 'border-success/35 bg-surface text-success',
    info: 'border-line bg-surface text-soft',
    error: 'border-danger/35 bg-surface text-danger',
};

function ToastIcon({ type }: { type: ToastType }) {
    const Icon =
        type === 'success' ? CheckCircle : type === 'error' ? WarningCircle : Info;

    return <Icon size={19} weight="fill" aria-hidden="true" />;
}

function ToastItem({
    toast,
    onDismiss,
}: {
    toast: ToastMessage;
    onDismiss: () => void;
}) {
    const [visible, setVisible] = useState(true);
    const dismissRef = useRef(onDismiss);

    useEffect(() => {
        dismissRef.current = onDismiss;
    }, [onDismiss]);

    useEffect(() => {
        const timer = window.setTimeout(() => dismissRef.current(), 4500);

        return () => window.clearTimeout(timer);
    }, []);

    if (!visible) {
        return null;
    }

    const dismiss = () => {
        setVisible(false);
        onDismiss();
    };

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                'fixed bottom-6 left-1/2 z-[70] flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center gap-3 rounded-sm border px-4 py-3 text-sm shadow-soft',
                TONE_CLASSES[toast.type],
            )}
        >
            <ToastIcon type={toast.type} />
            <p className="flex-1 leading-snug">{toast.message}</p>
            <button
                type="button"
                onClick={dismiss}
                aria-label="Dismiss notification"
                className="flex h-7 w-7 items-center justify-center rounded-sm text-current/70 transition-colors hover:bg-raised hover:text-current"
            >
                <X size={15} aria-hidden="true" />
            </button>
        </div>
    );
}

export default function ToastProvider() {
    const { toast } = usePage<PageProps>().props;
    const [eventToast, setEventToast] = useState<ToastMessage | null>(null);

    useEffect(() => {
        const onShow = (event: Event) => {
            const detail = (event as CustomEvent<ToastMessage>).detail;

            if (detail?.message) {
                setEventToast(detail);
            }
        };

        window.addEventListener('toast:show', onShow);

        return () => window.removeEventListener('toast:show', onShow);
    }, []);

    const current = eventToast ?? toast;

    if (!current) {
        return null;
    }

    const key = current.id ?? `${current.type}:${current.message}`;

    return (
        <ToastItem key={key} toast={current} onDismiss={() => setEventToast(null)} />
    );
}
