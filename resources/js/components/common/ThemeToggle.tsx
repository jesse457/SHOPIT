import { Moon, Sun } from '@phosphor-icons/react';

import { useTheme } from '@/context/ThemeContext';
import { cn } from '@/lib/utils';

export default function ThemeToggle({ className }: { className?: string }) {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';
    const label = `Switch to ${isDark ? 'light' : 'dark'} theme`;

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            className={cn(
                'flex h-10 w-10 items-center justify-center rounded-sm text-soft transition-colors duration-200 hover:bg-raised hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-clay',
                className,
            )}
        >
            {isDark ? (
                <Sun size={19} weight="regular" aria-hidden="true" />
            ) : (
                <Moon size={19} weight="regular" aria-hidden="true" />
            )}
        </button>
    );
}
