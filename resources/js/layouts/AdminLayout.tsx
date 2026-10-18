import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowSquareOut,
    List,
    Package,
    Receipt,
    Shapes,
    SignOut,
    SquaresFour,
    Storefront,
    Tag,
    Users,
    X,
} from '@phosphor-icons/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import SkipLink from '@/components/common/SkipLink';
import ThemeToggle from '@/components/common/ThemeToggle';
import ToastProvider from '@/components/ui/toast/Toast';
import { cn, initials } from '@/lib/utils';
import type { PageProps } from '@/types';

const NAVIGATION = [
    { href: '/admin', label: 'Dashboard', icon: SquaresFour },
    { href: '/admin/orders', label: 'Orders', icon: Receipt },
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/categories', label: 'Categories', icon: Shapes },
    { href: '/admin/brands', label: 'Brands', icon: Tag },
    { href: '/admin/customers', label: 'Customers', icon: Users },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
    const { props, url } = usePage<PageProps>();
    const { auth } = props;
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const closeSidebar = () => setIsSidebarOpen(false);

    const isActive = (href: string) =>
        href === '/admin' ? url === '/admin' : url.startsWith(href);

    const navigation = (
        <nav aria-label="Admin" className="flex flex-1 flex-col gap-1">
            {NAVIGATION.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={closeSidebar}
                        aria-current={active ? 'page' : undefined}
                        className={cn(
                            'flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] font-medium transition-colors',
                            active
                                ? 'bg-ink text-canvas'
                                : 'text-soft hover:bg-raised hover:text-ink',
                        )}
                    >
                        <Icon size={17} weight={active ? 'fill' : 'regular'} aria-hidden="true" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );

    return (
        <div className="min-h-dvh bg-canvas text-ink">
            <SkipLink />

            {isSidebarOpen && (
                <button
                    type="button"
                    aria-label="Close admin menu"
                    onClick={closeSidebar}
                    className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
                />
            )}

            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-surface px-4 py-5 transition-transform duration-300 lg:translate-x-0',
                    isSidebarOpen ? 'translate-x-0' : '-translate-x-full',
                )}
            >
                <div className="flex items-center justify-between px-1">
                    <Link href="/admin" className="flex items-baseline gap-2">
                        <span className="font-display text-[26px] leading-none font-semibold">
                            SHOPIT
                        </span>
                        <span className="text-[9px] font-medium tracking-[0.16em] text-muted uppercase">
                            Admin
                        </span>
                    </Link>
                    <button
                        type="button"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                        className="flex h-9 w-9 items-center justify-center rounded-sm text-soft hover:bg-raised lg:hidden"
                    >
                        <X size={18} aria-hidden="true" />
                    </button>
                </div>

                <div className="mt-7">{navigation}</div>

                <div className="mt-auto space-y-2 border-t border-line pt-4">
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-sm px-3 py-2.5 text-[13px] font-medium text-soft transition-colors hover:bg-raised hover:text-ink"
                    >
                        <Storefront size={17} aria-hidden="true" />
                        View store
                        <ArrowSquareOut size={13} className="ml-auto" aria-hidden="true" />
                    </Link>
                    <div className="flex items-center gap-3 rounded-sm px-3 py-2.5">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-semibold text-canvas">
                            {initials(auth.user?.name)}
                        </span>
                        <div className="min-w-0">
                            <p className="truncate text-[12px] font-medium text-ink">
                                {auth.user?.name}
                            </p>
                            <p className="truncate text-[11px] text-muted">
                                {auth.user?.email}
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-[13px] font-medium text-soft transition-colors hover:bg-raised hover:text-ink"
                    >
                        <SignOut size={17} aria-hidden="true" />
                        Sign out
                    </button>
                </div>
            </aside>

            <div className="lg:pl-64">
                <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-line bg-canvas/90 px-5 backdrop-blur-md md:px-8">
                    <button
                        type="button"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open admin menu"
                        className="flex h-10 w-10 items-center justify-center rounded-sm text-soft hover:bg-raised hover:text-ink lg:hidden"
                    >
                        <List size={20} aria-hidden="true" />
                    </button>

                    <div className="hidden text-[11px] font-medium tracking-[0.14em] text-muted uppercase lg:block">
                        Store operations
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="hidden items-center gap-2 rounded-sm px-3 py-2 text-[12px] font-medium text-soft transition-colors hover:bg-raised hover:text-ink sm:flex"
                        >
                            <Storefront size={16} aria-hidden="true" />
                            Storefront
                        </Link>
                        <ThemeToggle />
                    </div>
                </header>

                <main id="main-content" className="px-5 py-8 md:px-8 lg:py-10">
                    {children}
                </main>
            </div>

            <ToastProvider />
        </div>
    );
}
