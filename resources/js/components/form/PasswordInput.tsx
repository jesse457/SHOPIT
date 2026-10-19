import { Eye, EyeSlash } from '@phosphor-icons/react';
import { useState } from 'react';

import { cn } from '@/lib/utils';

import Input from './Input';
import type { InputProps } from './Input';

export default function PasswordInput(props: Omit<InputProps, 'type'>) {
    const [visible, setVisible] = useState(false);

    return (
        <div className="relative">
            <Input
                {...props}
                type={visible ? 'text' : 'password'}
                className={cn('pr-11', props.className)}
            />
            <button
                type="button"
                onClick={() => setVisible((current) => !current)}
                aria-label={visible ? 'Hide password' : 'Show password'}
                title={visible ? 'Hide password' : 'Show password'}
                className="absolute top-0 right-0 flex h-11 w-11 items-center justify-center text-muted transition-colors hover:text-ink"
            >
                {visible ? (
                    <EyeSlash size={17} aria-hidden="true" />
                ) : (
                    <Eye size={17} aria-hidden="true" />
                )}
            </button>
        </div>
    );
}
