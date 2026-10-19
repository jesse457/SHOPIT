import { router } from '@inertiajs/react';
import { ArrowRight, CheckCircle, Clock } from '@phosphor-icons/react';
import { useState } from 'react';

import CheckoutRetryController from '@/actions/App/Http/Controllers/Storefront/CheckoutRetryController';
import PageMeta from '@/components/common/PageMeta';
import OrderReceipt from '@/components/storefront/OrderReceipt';
import { Button, ButtonLink } from '@/components/ui/button/Button';
import { show as orderShow } from '@/routes/orders';
import { index as productsIndex } from '@/routes/products';
import type { Order } from '@/types';

export default function CheckoutSuccess({ order }: { order: Order }) {
    const [retrying, setRetrying] = useState(false);
    const isPaid = order.payment_status === 'paid';
    const isCash = order.payment_method === 'cod';

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
                title="Order confirmation"
                description={`Confirmation for SHOPIT order ${order.number}.`}
                noIndex
            />

            <section className="container-shop py-12 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                            {isPaid || isCash ? (
                                <CheckCircle
                                    size={25}
                                    weight="fill"
                                    aria-hidden="true"
                                />
                            ) : (
                                <Clock size={25} aria-hidden="true" />
                            )}
                        </span>
                        <div>
                            <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                                {isPaid
                                    ? 'Payment received.'
                                    : isCash
                                      ? 'Order placed.'
                                      : 'Order received.'}
                            </h1>
                            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-soft">
                                {isPaid
                                    ? 'Your order is confirmed and is being prepared.'
                                    : isCash
                                      ? 'Your order is confirmed. Pay in cash when it arrives.'
                                      : 'We are waiting for the payment to confirm. This page updates once Stripe reports the payment.'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <OrderReceipt order={order} />
                    </div>

                    {!isPaid &&
                        !isCash &&
                        order.payment_status === 'pending' &&
                        order.can_retry_payment && (
                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <Button
                                    type="button"
                                    onClick={retryPayment}
                                    loading={retrying}
                                    endIcon={
                                        <ArrowRight
                                            size={14}
                                            aria-hidden="true"
                                        />
                                    }
                                >
                                    Complete payment
                                </Button>
                                <p className="text-[11px] text-muted">
                                    The card payment did not finish.
                                </p>
                            </div>
                        )}

                    {!isPaid && !isCash && !order.can_retry_payment && (
                        <p className="mt-6 text-[12px] leading-relaxed text-sun">
                            This payment window has closed. If you were charged,
                            the payment is being reconciled. Otherwise, place a
                            new order from the store.
                        </p>
                    )}

                    <div className="mt-8 flex flex-wrap gap-3">
                        <ButtonLink
                            href={orderShow.url(order.id)}
                            variant="secondary"
                            endIcon={
                                <ArrowRight size={14} aria-hidden="true" />
                            }
                        >
                            View order
                        </ButtonLink>
                        <ButtonLink href={productsIndex.url()} variant="ghost">
                            Continue shopping
                        </ButtonLink>
                    </div>
                </div>
            </section>
        </>
    );
}
