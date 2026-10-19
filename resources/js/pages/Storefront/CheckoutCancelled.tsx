import { router } from '@inertiajs/react';
import { ArrowRight, WarningCircle } from '@phosphor-icons/react';
import { useState } from 'react';

import CheckoutRetryController from '@/actions/App/Http/Controllers/Storefront/CheckoutRetryController';
import PageMeta from '@/components/common/PageMeta';
import OrderReceipt from '@/components/storefront/OrderReceipt';
import { Button, ButtonLink } from '@/components/ui/button/Button';
import { show as orderShow } from '@/routes/orders';
import { index as productsIndex } from '@/routes/products';
import type { Order } from '@/types';

export default function CheckoutCancelled({ order }: { order: Order }) {
    const [retrying, setRetrying] = useState(false);

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
                title="Payment cancelled"
                description={`Payment for SHOPIT order ${order.number} was not completed.`}
                noIndex
            />

            <section className="container-shop py-12 lg:py-20">
                <div className="mx-auto max-w-3xl">
                    <div className="flex items-start gap-4">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sun/10 text-sun">
                            <WarningCircle
                                size={25}
                                weight="fill"
                                aria-hidden="true"
                            />
                        </span>
                        <div>
                            <h1 className="text-[clamp(2.2rem,5vw,4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                                Payment was not completed.
                            </h1>
                            <p className="mt-3 max-w-xl text-[14px] leading-relaxed text-soft">
                                Your order is saved. You can try the card
                                payment again, or return to the store and start
                                a new order.
                            </p>
                        </div>
                    </div>

                    <div className="mt-10">
                        <OrderReceipt order={order} />
                    </div>

                    {order.can_retry_payment ? (
                        <div className="mt-6 flex flex-wrap items-center gap-3">
                            <Button
                                type="button"
                                onClick={retryPayment}
                                loading={retrying}
                                endIcon={
                                    <ArrowRight size={14} aria-hidden="true" />
                                }
                            >
                                Try payment again
                            </Button>
                            <p className="text-[11px] text-muted">
                                The reserved stock is still held for this order.
                            </p>
                        </div>
                    ) : (
                        <p className="mt-6 text-[12px] leading-relaxed text-sun">
                            This payment window has closed and the reserved
                            stock has been released. Place a new order from the
                            store.
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
