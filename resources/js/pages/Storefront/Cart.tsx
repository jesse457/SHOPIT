import { Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Minus,
    Plus,
    ShoppingBag,
    Tag,
    Trash,
} from '@phosphor-icons/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import PageMeta from '@/components/common/PageMeta';
import ProductImage from '@/components/storefront/ProductImage';
import { Button, ButtonLink } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import { formatCurrency } from '@/lib/utils';
import { clear as cartClear } from '@/routes/cart';
import {
    destroy as cartCouponDestroy,
    store as cartCouponStore,
} from '@/routes/cart/coupon';
import {
    destroy as cartDestroy,
    update as cartUpdate,
} from '@/routes/cart/items';
import { index as checkoutIndex } from '@/routes/checkout';
import { index as productsIndex, show as productShow } from '@/routes/products';
import type { CartLine, CartSummary, PageProps } from '@/types';

interface CartProps {
    cart: CartSummary;
}

export default function Cart({ cart }: CartProps) {
    const { shop } = usePage<PageProps>().props;
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [confirmClear, setConfirmClear] = useState(false);
    const couponForm = useForm({ code: '' });
    const couponError = (
        couponForm.errors as Record<string, string | undefined>
    ).coupon;

    const applyCoupon = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        couponForm.post(cartCouponStore.url(), {
            preserveScroll: true,
            onSuccess: () => couponForm.reset(),
        });
    };

    const removeCoupon = () => {
        router.delete(cartCouponDestroy.url(), { preserveScroll: true });
    };

    const money = (value: string) =>
        formatCurrency(value, shop.currency, shop.currency_locale);

    const changeQuantity = (line: CartLine, quantity: number) => {
        if (quantity < 1 || quantity > line.stock_quantity) {
            return;
        }

        setUpdatingId(line.product_id);

        router.patch(
            cartUpdate.url(line.slug),
            { quantity },
            {
                preserveScroll: true,
                onFinish: () => setUpdatingId(null),
            },
        );
    };

    const removeLine = (line: CartLine) => {
        router.delete(cartDestroy.url(line.slug), { preserveScroll: true });
    };

    const clearCart = () => {
        router.delete(cartClear.url(), {
            preserveScroll: true,
            onFinish: () => setConfirmClear(false),
        });
    };

    const freeShippingRemaining = Number.parseFloat(
        cart.remaining_for_free_shipping,
    );

    if (cart.items.length === 0) {
        return (
            <>
                <PageMeta
                    title="Your cart"
                    description="Your SHOPIT cart."
                    noIndex
                />

                <section className="container-shop py-16 lg:py-24">
                    <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                        Your cart
                    </h1>

                    <EmptyState
                        className="mt-10"
                        icon={<ShoppingBag size={28} weight="regular" />}
                        title="Your cart is empty"
                        description="Nothing here yet. The edit is small on purpose, so start with the new arrivals."
                        action={
                            <ButtonLink
                                href={productsIndex.url()}
                                size="sm"
                                endIcon={
                                    <ArrowRight size={14} aria-hidden="true" />
                                }
                            >
                                Shop the edit
                            </ButtonLink>
                        }
                    />
                </section>
            </>
        );
    }

    return (
        <>
            <PageMeta
                title="Your cart"
                description="Review your SHOPIT cart."
                noIndex
            />

            <section className="container-shop py-10 lg:py-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                            Your cart
                        </h1>
                        <p className="tabular mt-3 text-[13px] text-muted">
                            {cart.count} {cart.count === 1 ? 'piece' : 'pieces'}
                        </p>
                    </div>
                    <Link
                        href={productsIndex.url()}
                        className="link-underline text-[12px] font-medium text-soft hover:text-ink"
                    >
                        Continue shopping
                    </Link>
                </div>

                <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
                    <div>
                        <div className="divide-y divide-line border-t border-line">
                            {cart.items.map((line) => (
                                <article
                                    key={line.product_id}
                                    className="grid grid-cols-[92px_1fr] gap-4 py-6 sm:grid-cols-[110px_1fr_auto] sm:items-start sm:gap-6"
                                >
                                    <Link
                                        href={productShow.url(line.slug)}
                                        className="aspect-[4/5] overflow-hidden rounded-sm border border-line bg-raised"
                                    >
                                        <ProductImage
                                            src={line.image_url}
                                            alt={line.name}
                                            className="transition-transform duration-500 hover:scale-[1.03]"
                                        />
                                    </Link>

                                    <div className="min-w-0">
                                        <Link
                                            href={productShow.url(line.slug)}
                                            className="font-display text-[22px] leading-tight font-medium text-ink hover:text-clay"
                                        >
                                            {line.name}
                                        </Link>
                                        <p className="tabular mt-1.5 text-[12px] text-muted">
                                            {money(line.unit_amount)} each
                                        </p>

                                        <div className="mt-4 flex flex-wrap items-center gap-3">
                                            <div className="flex h-9 items-center rounded-sm border border-line">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        changeQuantity(
                                                            line,
                                                            line.quantity - 1,
                                                        )
                                                    }
                                                    disabled={
                                                        line.quantity <= 1
                                                    }
                                                    aria-label={`Decrease quantity of ${line.name}`}
                                                    className="flex h-full w-9 items-center justify-center text-soft hover:text-ink disabled:opacity-40"
                                                >
                                                    <Minus
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                                <span className="tabular w-8 text-center text-[12px] font-medium">
                                                    {line.quantity}
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        changeQuantity(
                                                            line,
                                                            line.quantity + 1,
                                                        )
                                                    }
                                                    disabled={
                                                        line.quantity >=
                                                            line.stock_quantity ||
                                                        updatingId ===
                                                            line.product_id
                                                    }
                                                    aria-label={`Increase quantity of ${line.name}`}
                                                    className="flex h-full w-9 items-center justify-center text-soft hover:text-ink disabled:opacity-40"
                                                >
                                                    <Plus
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                </button>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => removeLine(line)}
                                                className="flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-danger"
                                            >
                                                <Trash
                                                    size={13}
                                                    aria-hidden="true"
                                                />
                                                Remove
                                            </button>
                                        </div>

                                        {line.quantity >=
                                            line.stock_quantity && (
                                            <p className="mt-2 text-[11px] text-sun">
                                                Only {line.stock_quantity}{' '}
                                                available.
                                            </p>
                                        )}
                                    </div>

                                    <p className="tabular col-start-2 text-right text-[14px] font-medium text-ink sm:col-start-3">
                                        {money(line.total_amount)}
                                    </p>
                                </article>
                            ))}
                        </div>

                        <div className="mt-6">
                            {confirmClear ? (
                                <div className="flex flex-wrap items-center gap-3 text-[12px]">
                                    <span className="text-soft">
                                        Clear the whole cart?
                                    </span>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        size="sm"
                                        onClick={clearCart}
                                    >
                                        Yes, clear it
                                    </Button>
                                    <button
                                        type="button"
                                        onClick={() => setConfirmClear(false)}
                                        className="text-[12px] font-medium text-soft hover:text-ink"
                                    >
                                        Keep it
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setConfirmClear(true)}
                                    className="text-[11px] font-medium text-muted hover:text-danger"
                                >
                                    Clear cart
                                </button>
                            )}
                        </div>
                    </div>

                    <aside className="lg:sticky lg:top-24 lg:self-start">
                        <div className="rounded-sm border border-line bg-surface p-6">
                            <h2 className="font-display text-[27px] leading-none font-medium">
                                Summary
                            </h2>

                            {cart.coupon ? (
                                <div className="mt-4 flex items-center justify-between gap-3 rounded-sm bg-raised px-3 py-2 text-[11px]">
                                    <span className="flex items-center gap-1.5 font-medium text-soft">
                                        <Tag size={13} aria-hidden="true" />
                                        {cart.coupon.code}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={removeCoupon}
                                        className="font-medium text-clay hover:text-ink"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={applyCoupon} className="mt-4">
                                    <label
                                        htmlFor="coupon-code"
                                        className="sr-only"
                                    >
                                        Coupon code
                                    </label>
                                    <div className="flex gap-2">
                                        <input
                                            id="coupon-code"
                                            value={couponForm.data.code}
                                            onChange={(event) =>
                                                couponForm.setData(
                                                    'code',
                                                    event.target.value,
                                                )
                                            }
                                            placeholder="Coupon code"
                                            className="h-9 w-full rounded-sm border border-line bg-canvas px-2.5 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                                        />
                                        <Button
                                            type="submit"
                                            variant="secondary"
                                            size="sm"
                                            loading={couponForm.processing}
                                        >
                                            Apply
                                        </Button>
                                    </div>
                                    {couponError && (
                                        <p className="mt-1.5 text-[11px] text-danger">
                                            {couponError}
                                        </p>
                                    )}
                                </form>
                            )}

                            <dl className="mt-5 space-y-3 text-[13px]">
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-soft">Subtotal</dt>
                                    <dd className="tabular text-ink">
                                        {money(cart.subtotal)}
                                    </dd>
                                </div>
                                <div className="flex items-center justify-between gap-4">
                                    <dt className="text-soft">Delivery</dt>
                                    <dd className="tabular text-ink">
                                        {cart.qualifies_for_free_shipping
                                            ? 'Free'
                                            : money(cart.shipping)}
                                    </dd>
                                </div>
                                {Number.parseFloat(cart.discount) > 0 && (
                                    <div className="flex items-center justify-between gap-4">
                                        <dt className="text-soft">
                                            Discount
                                            {cart.coupon
                                                ? ` (${cart.coupon.code})`
                                                : ''}
                                        </dt>
                                        <dd className="tabular text-success">
                                            - {money(cart.discount)}
                                        </dd>
                                    </div>
                                )}
                            </dl>

                            <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                                <span className="font-display text-[22px] font-medium">
                                    Total
                                </span>
                                <span className="tabular text-[16px] font-medium text-ink">
                                    {money(cart.grand_total)}
                                </span>
                            </div>

                            {freeShippingRemaining > 0 && (
                                <p className="mt-4 rounded-sm bg-raised px-3 py-2 text-[11px] leading-relaxed text-soft">
                                    Add{' '}
                                    {money(cart.remaining_for_free_shipping)}{' '}
                                    for complimentary delivery.
                                </p>
                            )}

                            <ButtonLink
                                href={checkoutIndex.url()}
                                size="lg"
                                fullWidth
                                className="mt-5"
                                endIcon={
                                    <ArrowRight size={15} aria-hidden="true" />
                                }
                            >
                                Checkout
                            </ButtonLink>

                            <p className="mt-3 text-center text-[10px] leading-relaxed text-muted">
                                Secure card payment or cash on delivery.
                            </p>
                        </div>
                    </aside>
                </div>
            </section>
        </>
    );
}
