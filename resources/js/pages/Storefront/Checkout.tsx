import { Link, useForm, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Money,
    CaretLeft,
    CreditCard,
    Lock,
} from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import { store as checkoutStore } from '@/actions/App/Http/Controllers/Storefront/CheckoutController';
import PageMeta from '@/components/common/PageMeta';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import Textarea from '@/components/form/Textarea';
import ProductImage from '@/components/storefront/ProductImage';
import Alert from '@/components/ui/alert/Alert';
import { Button } from '@/components/ui/button/Button';
import { cn, formatCurrency } from '@/lib/utils';
import { index as cartIndex } from '@/routes/cart';
import type { CartSummary, PageProps } from '@/types';

interface CheckoutAddress {
    first_name: string;
    last_name: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
}

interface CheckoutProps {
    cart: CartSummary;
    defaultAddress: CheckoutAddress | null;
    stripeEnabled: boolean;
}

export default function Checkout({
    cart,
    defaultAddress,
    stripeEnabled,
}: CheckoutProps) {
    const { shop } = usePage<PageProps>().props;
    const money = (value: string) =>
        formatCurrency(value, shop.currency, shop.currency_locale);

    const { data, setData, post, processing, errors } = useForm({
        first_name: defaultAddress?.first_name ?? '',
        last_name: defaultAddress?.last_name ?? '',
        phone: defaultAddress?.phone ?? '',
        street_address: defaultAddress?.street_address ?? '',
        city: defaultAddress?.city ?? '',
        state: defaultAddress?.state ?? '',
        zip_code: defaultAddress?.zip_code ?? '',
        payment_method: stripeEnabled ? 'stripe' : 'cod',
        notes: '',
    });

    const cartError = (errors as Record<string, string | undefined>).cart;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(checkoutStore.url());
    };

    const submitLabel =
        data.payment_method === 'stripe' ? 'Pay with card' : 'Place order';

    return (
        <>
            <PageMeta
                title="Checkout"
                description="Complete your SHOPIT order."
                noIndex
            />

            <section className="container-shop py-10 lg:py-14">
                <Link
                    href={cartIndex.url()}
                    className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                >
                    <CaretLeft size={13} aria-hidden="true" />
                    Back to cart
                </Link>

                <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
                    <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                        Checkout
                    </h1>
                    <p className="tabular text-[12px] text-muted">
                        {cart.count} {cart.count === 1 ? 'piece' : 'pieces'}
                    </p>
                </div>

                {cartError && (
                    <Alert variant="error" className="mt-6">
                        {cartError}
                    </Alert>
                )}

                <form onSubmit={submit} className="mt-9">
                    <div className="grid gap-10 lg:grid-cols-[1fr_360px] lg:gap-14">
                        <div className="space-y-10">
                            <section>
                                <h2 className="font-display text-[27px] leading-none font-medium">
                                    Delivery details
                                </h2>
                                <p className="mt-2 text-[12px] text-muted">
                                    We use these details only to deliver this
                                    order.
                                </p>

                                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="first_name">
                                            First name
                                        </Label>
                                        <Input
                                            id="first_name"
                                            autoComplete="given-name"
                                            required
                                            value={data.first_name}
                                            onChange={(event) =>
                                                setData(
                                                    'first_name',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.first_name}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="last_name">
                                            Last name
                                        </Label>
                                        <Input
                                            id="last_name"
                                            autoComplete="family-name"
                                            required
                                            value={data.last_name}
                                            onChange={(event) =>
                                                setData(
                                                    'last_name',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.last_name}
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="phone">Phone</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            required
                                            value={data.phone}
                                            onChange={(event) =>
                                                setData(
                                                    'phone',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.phone}
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2">
                                        <Label htmlFor="street_address">
                                            Street address
                                        </Label>
                                        <Input
                                            id="street_address"
                                            autoComplete="street-address"
                                            required
                                            value={data.street_address}
                                            onChange={(event) =>
                                                setData(
                                                    'street_address',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.street_address}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="city">City</Label>
                                        <Input
                                            id="city"
                                            autoComplete="address-level2"
                                            required
                                            value={data.city}
                                            onChange={(event) =>
                                                setData(
                                                    'city',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.city}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="state">Region</Label>
                                        <Input
                                            id="state"
                                            autoComplete="address-level1"
                                            required
                                            value={data.state}
                                            onChange={(event) =>
                                                setData(
                                                    'state',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.state}
                                        />
                                    </div>

                                    <div className="space-y-2 sm:col-span-2 sm:max-w-[50%]">
                                        <Label htmlFor="zip_code">
                                            Postal code
                                        </Label>
                                        <Input
                                            id="zip_code"
                                            autoComplete="postal-code"
                                            required
                                            value={data.zip_code}
                                            onChange={(event) =>
                                                setData(
                                                    'zip_code',
                                                    event.target.value,
                                                )
                                            }
                                            error={errors.zip_code}
                                        />
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h2 className="font-display text-[27px] leading-none font-medium">
                                    Payment
                                </h2>
                                <p className="mt-2 text-[12px] text-muted">
                                    Card payments are processed by Stripe. Cash
                                    on delivery is also available.
                                </p>

                                <div className="mt-5 space-y-3">
                                    <label
                                        className={cn(
                                            'flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors',
                                            data.payment_method === 'stripe'
                                                ? 'border-ink bg-raised'
                                                : 'border-line hover:border-soft',
                                            !stripeEnabled &&
                                                'cursor-not-allowed opacity-50',
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="stripe"
                                            checked={
                                                data.payment_method === 'stripe'
                                            }
                                            onChange={() =>
                                                setData(
                                                    'payment_method',
                                                    'stripe',
                                                )
                                            }
                                            disabled={!stripeEnabled}
                                            className="mt-1 accent-clay"
                                        />
                                        <CreditCard
                                            size={20}
                                            className="mt-0.5 shrink-0 text-clay"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            <span className="block text-[13px] font-medium text-ink">
                                                Card payment
                                            </span>
                                            <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                                                You will be redirected to Stripe
                                                to pay securely.
                                            </span>
                                        </span>
                                    </label>

                                    <label
                                        className={cn(
                                            'flex cursor-pointer items-start gap-3 rounded-sm border p-4 transition-colors',
                                            data.payment_method === 'cod'
                                                ? 'border-ink bg-raised'
                                                : 'border-line hover:border-soft',
                                        )}
                                    >
                                        <input
                                            type="radio"
                                            name="payment_method"
                                            value="cod"
                                            checked={
                                                data.payment_method === 'cod'
                                            }
                                            onChange={() =>
                                                setData('payment_method', 'cod')
                                            }
                                            className="mt-1 accent-clay"
                                        />
                                        <Money
                                            size={20}
                                            className="mt-0.5 shrink-0 text-clay"
                                            aria-hidden="true"
                                        />
                                        <span>
                                            <span className="block text-[13px] font-medium text-ink">
                                                Cash on delivery
                                            </span>
                                            <span className="mt-0.5 block text-[11px] leading-relaxed text-muted">
                                                Pay in cash when your order
                                                arrives.
                                            </span>
                                        </span>
                                    </label>
                                </div>

                                {!stripeEnabled && (
                                    <p className="mt-3 text-[11px] leading-relaxed text-muted">
                                        Card payments are not configured on this
                                        environment. Cash on delivery is
                                        available.
                                    </p>
                                )}

                                {errors.payment_method && (
                                    <p className="mt-3 text-[11px] text-danger">
                                        {errors.payment_method}
                                    </p>
                                )}
                            </section>

                            <section>
                                <h2 className="font-display text-[27px] leading-none font-medium">
                                    Order note
                                </h2>
                                <div className="mt-4">
                                    <Label htmlFor="notes">Optional</Label>
                                    <Textarea
                                        id="notes"
                                        className="mt-2"
                                        value={data.notes}
                                        onChange={(event) =>
                                            setData('notes', event.target.value)
                                        }
                                        error={errors.notes}
                                        placeholder="Delivery instructions, a gate code, anything useful."
                                    />
                                </div>
                            </section>
                        </div>

                        <aside className="lg:sticky lg:top-24 lg:self-start">
                            <div className="rounded-sm border border-line bg-surface p-6">
                                <h2 className="font-display text-[27px] leading-none font-medium">
                                    Summary
                                </h2>

                                <div className="mt-4 divide-y divide-line border-y border-line">
                                    {cart.items.map((line) => (
                                        <div
                                            key={line.product_id}
                                            className="flex items-center gap-3 py-3"
                                        >
                                            <div className="h-14 w-11 shrink-0 overflow-hidden rounded-sm border border-line bg-raised">
                                                <ProductImage
                                                    src={line.image_url}
                                                    alt={line.name}
                                                />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-[12px] font-medium text-ink">
                                                    {line.name}
                                                </p>
                                                <p className="tabular mt-0.5 text-[10px] text-muted">
                                                    {line.quantity} x{' '}
                                                    {money(line.unit_amount)}
                                                </p>
                                            </div>
                                            <p className="tabular shrink-0 text-[12px] text-ink">
                                                {money(line.total_amount)}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <dl className="mt-4 space-y-2 text-[12px]">
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
                                </dl>

                                <div className="mt-4 flex items-baseline justify-between gap-4 border-t border-line pt-4">
                                    <span className="font-display text-[22px] font-medium">
                                        Total
                                    </span>
                                    <span className="tabular text-[16px] font-medium text-ink">
                                        {money(cart.grand_total)}
                                    </span>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    fullWidth
                                    loading={processing}
                                    className="mt-5"
                                    endIcon={
                                        <ArrowRight
                                            size={15}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    {submitLabel}
                                </Button>

                                <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] text-muted">
                                    <Lock size={11} aria-hidden="true" />
                                    Secure checkout. Your details stay private.
                                </p>
                            </div>
                        </aside>
                    </div>
                </form>
            </section>
        </>
    );
}
