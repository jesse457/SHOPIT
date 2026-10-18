import { Link } from '@inertiajs/react';
import { ArrowLeft } from '@phosphor-icons/react';
import type { ReactNode } from 'react';

import SkipLink from '@/components/common/SkipLink';
import ThemeToggle from '@/components/common/ThemeToggle';
import ToastProvider from '@/components/ui/toast/Toast';

const EDITORIAL_IMAGE =
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=80';

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="grid min-h-dvh bg-canvas text-ink lg:grid-cols-2">
            <SkipLink />

            <div className="flex min-h-dvh flex-col px-5 py-5 sm:px-8 lg:px-12">
                <header className="flex items-center justify-between">
                    <Link
                        href="/"
                        className="font-display text-[27px] leading-none font-semibold tracking-[0.01em]"
                    >
                        SHOPIT
                    </Link>
                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="flex items-center gap-1.5 rounded-sm px-3 py-2 text-[12px] font-medium text-soft transition-colors hover:bg-raised hover:text-ink"
                        >
                            <ArrowLeft size={14} aria-hidden="true" />
                            Back to store
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>

                <main
                    id="main-content"
                    className="flex flex-1 items-center justify-center py-12"
                >
                    <div className="w-full max-w-md">{children}</div>
                </main>

                <footer className="text-[11px] text-muted">
                    © {new Date().getFullYear()} SHOPIT. All rights reserved.
                </footer>
            </div>

            <aside className="relative hidden min-h-dvh overflow-hidden lg:block">
                <img
                    src={EDITORIAL_IMAGE}
                    alt="Folded garments in warm neutral tones"
                    className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#171410]/85 via-[#171410]/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-12 text-[#f6f2ea]">
                    <p className="font-display max-w-md text-[42px] leading-[1.02] font-medium tracking-[-0.02em]">
                        Buy less. Choose well. Keep it for years.
                    </p>
                    <p className="mt-5 max-w-sm text-[13px] leading-relaxed text-[#f6f2ea]/75">
                        An account keeps your orders, addresses and payment history
                        in one quiet place.
                    </p>
                </div>
            </aside>

            <ToastProvider />
        </div>
    );
}
