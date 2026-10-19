import { Link, usePage } from '@inertiajs/react';
import {
    ArrowUpRight,
    Heart,
    List,
    MagnifyingGlass,
    ShoppingBag,
    User,
    X,
} from '@phosphor-icons/react';
import { useState } from 'react';
import type { ReactNode } from 'react';

import { create as loginCreate } from '@/actions/App/Http/Controllers/Auth/LoginController';
import { create as registerCreate } from '@/actions/App/Http/Controllers/Auth/RegisterController';
import SkipLink from '@/components/common/SkipLink';
import ThemeToggle from '@/components/common/ThemeToggle';
import ToastProvider from '@/components/ui/toast/Toast';
import { formatCurrency } from '@/lib/utils';
import { home } from '@/routes';
import { index as accountIndex } from '@/routes/account';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as cartIndex } from '@/routes/cart';
import { index as categoriesIndex } from '@/routes/categories';
import { index as ordersIndex } from '@/routes/orders';
import { index as productsIndex } from '@/routes/products';
import { index as wishlistIndex } from '@/routes/wishlist';
import type { PageProps } from '@/types';

export default function StorefrontLayout({
    children,
}: {
    children: ReactNode;
}) {
    const { auth, cart, wishlist, navCategories, shop } =
        usePage<PageProps>().props;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const year = new Date().getFullYear();
    const user = auth.user;

    const closeMenu = () => setIsMenuOpen(false);

    return (
        <div className="flex min-h-dvh flex-col bg-canvas text-ink">
            <SkipLink />

            <div className="bg-ink text-canvas">
                <div className="container-shop flex h-9 items-center justify-center">
                    <p className="text-[10px] leading-none font-medium tracking-[0.14em] uppercase">
                        Complimentary delivery over{' '}
                        {formatCurrency(
                            shop.shipping.free_threshold,
                            shop.currency,
                            shop.currency_locale,
                        )}
                    </p>
                </div>
            </div>

            <header className="sticky top-0 z-50 border-b border-line bg-canvas/90 backdrop-blur-md">
                <div className="container-shop flex h-16 items-center justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3 lg:gap-8">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((open) => !open)}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                            aria-expanded={isMenuOpen}
                            aria-controls="storefront-mobile-menu"
                            className="flex h-10 w-10 items-center justify-center rounded-sm text-soft transition-colors hover:bg-raised hover:text-ink lg:hidden"
                        >
                            {isMenuOpen ? (
                                <X size={20} aria-hidden="true" />
                            ) : (
                                <List size={20} aria-hidden="true" />
                            )}
                        </button>

                        <Link
                            href={home.url()}
                            className="font-display text-[27px] leading-none font-semibold tracking-[0.01em] text-ink"
                            aria-label="SHOPIT home"
                        >
                            SHOPIT
                        </Link>

                        <nav
                            aria-label="Main"
                            className="hidden items-center gap-6 lg:flex"
                        >
                            <Link
                                href={productsIndex.url()}
                                className="link-underline text-[13px] font-medium text-soft transition-colors hover:text-ink"
                            >
                                Shop
                            </Link>
                            <Link
                                href={categoriesIndex.url()}
                                className="link-underline text-[13px] font-medium text-soft transition-colors hover:text-ink"
                            >
                                Departments
                            </Link>
                            {navCategories.slice(0, 3).map((category) => (
                                <Link
                                    key={category.id}
                                    href={productsIndex.url({
                                        query: { category: category.slug },
                                    })}
                                    className="link-underline text-[13px] font-medium text-soft transition-colors hover:text-ink"
                                >
                                    {category.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex shrink-0 items-center gap-1 sm:gap-2">
                        <form
                            action={productsIndex.url()}
                            method="get"
                            role="search"
                            className="relative hidden items-center xl:flex"
                        >
                            <label
                                htmlFor="storefront-search"
                                className="sr-only"
                            >
                                Search products
                            </label>
                            <MagnifyingGlass
                                size={16}
                                className="pointer-events-none absolute left-0 text-muted"
                                aria-hidden="true"
                            />
                            <input
                                id="storefront-search"
                                name="q"
                                type="search"
                                placeholder="Search the edit"
                                className="h-10 w-44 border-b border-line bg-transparent pr-2 pl-6 text-[13px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                            />
                        </form>

                        <ThemeToggle />

                        <Link
                            href={user ? accountIndex.url() : loginCreate.url()}
                            aria-label={user ? 'Your account' : 'Sign in'}
                            title={user ? 'Your account' : 'Sign in'}
                            className="flex h-10 w-10 items-center justify-center rounded-sm text-soft transition-colors hover:bg-raised hover:text-ink"
                        >
                            <User size={20} aria-hidden="true" />
                        </Link>

                        {user && (
                            <Link
                                href={wishlistIndex.url()}
                                aria-label={`Wishlist with ${wishlist.count} item${wishlist.count === 1 ? '' : 's'}`}
                                title="Wishlist"
                                className="relative flex h-10 w-10 items-center justify-center rounded-sm text-soft transition-colors hover:bg-raised hover:text-ink"
                            >
                                <Heart size={20} aria-hidden="true" />
                                {wishlist.count > 0 && (
                                    <span className="tabular absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[9px] leading-none font-semibold text-canvas">
                                        {wishlist.count}
                                    </span>
                                )}
                            </Link>
                        )}

                        {user?.is_admin && (
                            <Link
                                href={adminDashboard.url()}
                                className="hidden items-center gap-1 rounded-sm px-3 py-2 text-[11px] font-medium tracking-[0.12em] text-clay uppercase transition-colors hover:bg-raised sm:flex"
                            >
                                Admin
                                <ArrowUpRight size={12} aria-hidden="true" />
                            </Link>
                        )}

                        <Link
                            href={cartIndex.url()}
                            aria-label={`Cart with ${cart.count} item${cart.count === 1 ? '' : 's'}`}
                            title="Cart"
                            className="relative flex h-10 w-10 items-center justify-center rounded-sm text-soft transition-colors hover:bg-raised hover:text-ink"
                        >
                            <ShoppingBag size={20} aria-hidden="true" />
                            {cart.count > 0 && (
                                <span className="tabular absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-clay px-1 text-[9px] leading-none font-semibold text-canvas">
                                    {cart.count}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav
                        id="storefront-mobile-menu"
                        aria-label="Mobile"
                        className="border-t border-line bg-canvas px-5 py-5 lg:hidden"
                    >
                        <form
                            action={productsIndex.url()}
                            method="get"
                            role="search"
                            className="relative mb-5"
                        >
                            <label htmlFor="mobile-search" className="sr-only">
                                Search products
                            </label>
                            <MagnifyingGlass
                                size={16}
                                className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-muted"
                                aria-hidden="true"
                            />
                            <input
                                id="mobile-search"
                                name="q"
                                type="search"
                                placeholder="Search the edit"
                                className="h-11 w-full border-b border-line bg-transparent pr-3 pl-6 text-sm text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                            />
                        </form>

                        <ul className="flex flex-col gap-1">
                            {[
                                {
                                    href: productsIndex.url(),
                                    label: 'Shop all',
                                },
                                {
                                    href: categoriesIndex.url(),
                                    label: 'Departments',
                                },
                                ...navCategories.map((category) => ({
                                    href: productsIndex.url({
                                        query: { category: category.slug },
                                    }),
                                    label: category.name,
                                })),
                                {
                                    href: cartIndex.url(),
                                    label: `Cart (${cart.count})`,
                                },
                                user
                                    ? {
                                          href: ordersIndex.url(),
                                          label: 'My orders',
                                      }
                                    : {
                                          href: loginCreate.url(),
                                          label: 'Sign in',
                                      },
                                ...(user
                                    ? [
                                          {
                                              href: wishlistIndex.url(),
                                              label: `Wishlist (${wishlist.count})`,
                                          },
                                          {
                                              href: accountIndex.url(),
                                              label: 'Account',
                                          },
                                      ]
                                    : [
                                          {
                                              href: registerCreate.url(),
                                              label: 'Create an account',
                                          },
                                      ]),
                                ...(user?.is_admin
                                    ? [
                                          {
                                              href: adminDashboard.url(),
                                              label: 'Admin dashboard',
                                          },
                                      ]
                                    : []),
                            ].map((link) => (
                                <li key={`${link.href}-${link.label}`}>
                                    <Link
                                        href={link.href}
                                        onClick={closeMenu}
                                        className="block rounded-sm px-2 py-2.5 text-sm font-medium text-soft transition-colors hover:bg-raised hover:text-ink"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                )}
            </header>

            <main id="main-content" className="flex-1">
                {children}
            </main>

            <ToastProvider />

            <footer className="border-t border-line bg-surface">
                <div className="container-shop grid gap-12 py-14 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr] lg:py-16">
                    <div className="max-w-sm">
                        <Link
                            href={home.url()}
                            className="font-display text-[30px] leading-none font-semibold tracking-[0.01em] text-ink"
                        >
                            SHOPIT
                        </Link>
                        <p className="mt-4 text-sm leading-relaxed text-soft">
                            A considered edit of apparel, objects and technology
                            for everyday life. Chosen for how they live, not how
                            they sell.
                        </p>
                        <p className="mt-5 text-[12px] leading-relaxed text-muted">
                            Secure card payments and cash on delivery.
                            Complimentary delivery over{' '}
                            {formatCurrency(
                                shop.shipping.free_threshold,
                                shop.currency,
                                shop.currency_locale,
                            )}
                            .
                        </p>
                    </div>

                    <nav aria-label="Shop">
                        <h2 className="eyebrow">Shop</h2>
                        <ul className="mt-5 space-y-3 text-sm">
                            <li>
                                <Link
                                    href={productsIndex.url()}
                                    className="link-underline text-soft hover:text-ink"
                                >
                                    All products
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={categoriesIndex.url()}
                                    className="link-underline text-soft hover:text-ink"
                                >
                                    Departments
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={productsIndex.url({
                                        query: { sort: 'latest' },
                                    })}
                                    className="link-underline text-soft hover:text-ink"
                                >
                                    New this week
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={cartIndex.url()}
                                    className="link-underline text-soft hover:text-ink"
                                >
                                    Your cart
                                </Link>
                            </li>
                        </ul>
                    </nav>

                    <nav aria-label="Account">
                        <h2 className="eyebrow">Account</h2>
                        <ul className="mt-5 space-y-3 text-sm">
                            {user ? (
                                <>
                                    <li>
                                        <Link
                                            href={accountIndex.url()}
                                            className="link-underline text-soft hover:text-ink"
                                        >
                                            Your account
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={ordersIndex.url()}
                                            className="link-underline text-soft hover:text-ink"
                                        >
                                            My orders
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={wishlistIndex.url()}
                                            className="link-underline text-soft hover:text-ink"
                                        >
                                            Wishlist ({wishlist.count})
                                        </Link>
                                    </li>
                                </>
                            ) : (
                                <>
                                    <li>
                                        <Link
                                            href={loginCreate.url()}
                                            className="link-underline text-soft hover:text-ink"
                                        >
                                            Sign in
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            href={registerCreate.url()}
                                            className="link-underline text-soft hover:text-ink"
                                        >
                                            Create an account
                                        </Link>
                                    </li>
                                </>
                            )}
                            {user?.is_admin && (
                                <li>
                                    <Link
                                        href={adminDashboard.url()}
                                        className="link-underline text-clay hover:text-ink"
                                    >
                                        Admin dashboard
                                    </Link>
                                </li>
                            )}
                        </ul>
                    </nav>
                </div>

                <div className="border-t border-line">
                    <div className="container-shop flex flex-col gap-2 py-5 text-[11px] text-muted sm:flex-row sm:items-center sm:justify-between">
                        <p>© {year} SHOPIT. All rights reserved.</p>
                        <p>Laravel, Inertia and React.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
