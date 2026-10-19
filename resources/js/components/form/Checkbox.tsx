import type { ReactNode } from 'react';

interface CheckboxProps {
    id: string;
    label: ReactNode;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function Checkbox({
    id,
    label,
    checked,
    onChange,
    disabled = false,
}: CheckboxProps) {
    return (
        <label
            htmlFor={id}
            className="flex cursor-pointer items-center gap-2.5 text-[13px] text-soft transition-colors hover:text-ink"
        >
            <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={(event) => onChange(event.target.checked)}
                disabled={disabled}
                className="h-4 w-4 rounded-xs border-line accent-clay"
            />
            <span>{label}</span>
        </label>
    );
}
