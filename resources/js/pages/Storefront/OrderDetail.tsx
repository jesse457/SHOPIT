import { Link, router } from '@inertiajs/react';
import {
    ArrowRight,
    CaretLeft,
    CheckCircle,
    Circle,
} from '@phosphor-icons/react';
import { useState } from 'react';

import CheckoutRetryController from '@/actions/App/Http/Controllers/Storefront/CheckoutRetryController';
import PageMeta from '@/components/common/PageMeta';
import OrderReceipt from '@/components/storefront/OrderReceipt';
import Badge from '@/components/ui/badge/Badge';
import { Button, ButtonLink } from '@/components/ui/button/Button';
import { formatDate, orderStatusTone, paymentStatusTone } from '@/lib/utils';
import { index as ordersIndex } from '@/routes/orders';
import { index as productsIndex } from '@/routes/products';
import type { Order } from '@/types';

const TIMELINE = [
    { key: 'new', label: 'Order placed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
];

export default function OrderDetail({ order }: { order: Order }) {
    const [retrying, setRetrying] = useState(false);
    const currentStep = TIMELINE.findIndex((step) => step.key === order.status);
    const isCancelled = order.status === 'cancelled';

    const retryPayment = () => {
        setRetrying(true);

        router.post(
            CheckoutRetryController.url(order.id),
            {},
            {
                preserveScroll: true,
                onFinish: () => setRetrying(false),
            },
        );
    };

    return (
        <>
            <PageMeta
                title={`Order ${order.number}`}
                description={`Details for SHOPIT order ${order.number}.`}
                noIndex
            />

            <section className="container-shop py-10 lg:py-14">
                <Link
                    href={ordersIndex.url()}
                    className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                >
                    <CaretLeft size={13} aria-hidden="true" />
                    All orders
                </Link>

                <div className="mt-5 flex flex-wrap items-start justify-between gap-5">
                    <div>
                        <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                            Order
                        </p>
                        <h1 className="mt-1 text-[clamp(2.4rem,5vw,4.2rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                            {order.number}
                        </h1>
                        <p className="mt-3 text-[13px] text-soft">
                            Placed {formatDate(order.created_at)}
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge tone={orderStatusTone(order.status)}>
                            {order.status_label}
                        </Badge>
                        <Badge tone={paymentStatusTone(order.payment_status)}>
                            {order.payment_status_label}
                        </Badge>
                    </div>
                </div>

                <div className="mt-9 grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start lg:gap-12">
                    <OrderReceipt order={order} />

                    <aside className="space-y-5 lg:sticky lg:top-24">
                        <div className="rounded-sm border border-line bg-surface p-5">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                Progress
                            </h2>

                            {isCancelled ? (
                                <p className="mt-4 text-[13px] leading-relaxed text-soft">
                                    This order was cancelled. If you were
                                    charged, the refund is handled manually from
                                    the store.
                                </p>
                            ) : (
                                <ol className="mt-5 space-y-0">
                                    {TIMELINE.map((step, index) => {
                                        const reached = index <= currentStep;

                                        return (
                                            <li
                                                key={step.key}
                                                className="flex gap-3"
                                            >
                                                <div className="flex flex-col items-center">
                                                    {reached ? (
                                                        <CheckCircle
                                                            size={17}
                                                            weight="fill"
                                                            className="text-success"
                                                            aria-hidden="true"
                                                        />
                                                    ) : (
                                                        <Circle
                                                            size={17}
                                                            className="text-line"
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                    {index <
                                                        TIMELINE.length - 1 && (
                                                        <span
                                                            className={`my-1 h-6 w-px ${
                                                                index <
                                                                currentStep
                                                                    ? 'bg-success/40'
                                                                    : 'bg-line'
                                                            }`}
                                                            aria-hidden="true"
                                                        />
                                                    )}
                                                </div>
                                                <p
                                                    className={`pb-3 text-[12px] ${
                                                        reached
                                                            ? 'font-medium text-ink'
                                                            : 'text-muted'
                                                    }`}
                                                >
                                                    {step.label}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ol>
                            )}
                        </div>

                        <div className="rounded-sm border border-line bg-surface p-5">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                Payment
                            </h2>
                            <p className="mt-3 text-[13px] text-soft">
                                {order.payment_method_label}
                            </p>
                            <p className="mt-1 text-[12px] text-muted">
                                {order.payment_status_label}
                            </p>

                            {order.payment_method === 'stripe' &&
                                order.payment_status === 'pending' && (
                                    <>
                                        {order.can_retry_payment ? (
                                            <Button
                                                type="button"
                                                size="sm"
                                                fullWidth
                                                className="mt-4"
                                                loading={retrying}
                                                onClick={retryPayment}
                                                endIcon={
                                                    <ArrowRight
                                                        size={13}
                                                        aria-hidden="true"
                                                    />
                                                }
                                            >
                                                Complete payment
                                            </Button>
                                        ) : (
                                            <p className="mt-4 text-[11px] leading-relaxed text-sun">
                                                This payment window has closed.
                                                Place a new order from the
                                                store.
                                            </p>
                                        )}
                                    </>
                                )}

                            {order.payment_method === 'cod' &&
                                order.payment_status === 'pending' && (
                                    <p className="mt-4 text-[11px] leading-relaxed text-muted">
                                        Pay in cash when the order is delivered.
                                    </p>
                                )}
                        </div>

                        <ButtonLink
                            href={productsIndex.url()}
                            variant="secondary"
                            fullWidth
                            endIcon={
                                <ArrowRight size={14} aria-hidden="true" />
                            }
                        >
                            Continue shopping
                        </ButtonLink>
                    </aside>
                </div>
            </section>
        </>
    );
}
