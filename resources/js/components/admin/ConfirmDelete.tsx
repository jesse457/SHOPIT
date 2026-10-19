import { router } from '@inertiajs/react';
import { Trash } from '@phosphor-icons/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button/Button';

interface ConfirmDeleteProps {
    url: string;
    label?: string;
    description?: string;
}

export default function ConfirmDelete({
    url,
    label = 'Delete',
    description = 'Delete this item?',
}: ConfirmDeleteProps) {
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    const remove = () => {
        setProcessing(true);

        router.delete(url, {
            preserveScroll: true,
            onFinish: () => setProcessing(false),
        });
    };

    if (!confirming) {
        return (
            <button
                type="button"
                onClick={() => setConfirming(true)}
                className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-danger"
            >
                <Trash size={13} aria-hidden="true" />
                {label}
            </button>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-soft">{description}</span>
            <Button
                type="button"
                variant="danger"
                size="sm"
                loading={processing}
                onClick={remove}
            >
                Yes
            </Button>
            <button
                type="button"
                onClick={() => setConfirming(false)}
                className="text-[11px] font-medium text-soft hover:text-ink"
            >
                No
            </button>
        </div>
    );
}
