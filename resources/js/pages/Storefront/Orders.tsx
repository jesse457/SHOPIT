import { Link, router, usePage } from '@inertiajs/react';
import { ArrowRight, Package } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import Badge from '@/components/ui/badge/Badge';
import { ButtonLink } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import {
    formatCurrency,
    formatDate,
    orderStatusTone,
    paymentStatusTone,
} from '@/lib/utils';
import { index as ordersIndex, show as orderShow } from '@/routes/orders';
import { index as productsIndex } from '@/routes/products';
import type { Order, PageProps, Paginated } from '@/types';

interface OrdersProps {
    orders: Paginated<Order>;
}

export default function Orders({ orders }: OrdersProps) {
    const { shop } = usePage<PageProps>().props;
    const money = (value: string) =>
        formatCurrency(value, shop.currency, shop.currency_locale);
    const total = orders.total ?? orders.data.length;

    const goToPage = (page: number) => {
        router.get(ordersIndex.url(), page > 1 ? { page } : {}, {
            preserveState: true,
            preserveScroll: true,
            only: ['orders'],
        });
    };

    return (
        <>
            <PageMeta
                title="Your orders"
                description="Track and review your SHOPIT orders."
                noIndex
            />

            <section className="container-shop py-10 lg:py-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                            Your orders
                        </h1>
                        <p className="tabular mt-3 text-[13px] text-muted">
                            {total} {total === 1 ? 'order' : 'orders'}
                        </p>
                    </div>
                    <Link
                        href={productsIndex.url()}
                        className="link-underline flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                    >
                        Continue shopping
                        <ArrowRight size={13} aria-hidden="true" />
                    </Link>
                </div>

                {orders.data.length > 0 ? (
                    <>
                        <div className="mt-8 overflow-x-auto rounded-sm border border-line bg-surface">
                            <table className="min-w-full text-left text-[12px]">
                                <thead className="border-b border-line">
                                    <tr>
                                        {[
                                            'Order',
                                            'Date',
                                            'Status',
                                            'Payment',
                                            'Pieces',
                                            'Total',
                                            '',
                                        ].map((heading) => (
                                            <th
                                                key={heading || 'action'}
                                                scope="col"
                                                className="px-4 py-3 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-muted uppercase"
                                            >
                                                {heading}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {orders.data.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-raised/60"
                                        >
                                            <td className="px-4 py-4 font-medium whitespace-nowrap text-ink">
                                                {order.number}
                                            </td>
                                            <td className="px-4 py-4 whitespace-nowrap text-soft">
                                                {formatDate(order.created_at)}
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    tone={orderStatusTone(
                                                        order.status,
                                                    )}
                                                >
                                                    {order.status_label}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-4">
                                                <Badge
                                                    tone={paymentStatusTone(
                                                        order.payment_status,
                                                    )}
                                                >
                                                    {order.payment_status_label}
                                                </Badge>
                                            </td>
                                            <td className="tabular px-4 py-4 text-soft">
                                                {order.items.length}
                                            </td>
                                            <td className="tabular px-4 py-4 whitespace-nowrap text-ink">
                                                {money(order.grand_total)}
                                            </td>
                                            <td className="px-4 py-4 text-right whitespace-nowrap">
                                                <Link
                                                    href={orderShow.url(
                                                        order.id,
                                                    )}
                                                    className="inline-flex items-center gap-1.5 text-[11px] font-medium text-clay hover:text-ink"
                                                >
                                                    View order
                                                    <ArrowRight
                                                        size={12}
                                                        aria-hidden="true"
                                                    />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <Pagination
                            currentPage={orders.current_page ?? 1}
                            lastPage={orders.last_page ?? 1}
                            total={total}
                            from={orders.from ?? null}
                            to={orders.to ?? null}
                            onPageChange={goToPage}
                        />
                    </>
                ) : (
                    <EmptyState
                        className="mt-8"
                        icon={<Package size={28} weight="regular" />}
                        title="No orders yet"
                        description="When you place an order it will appear here with its delivery and payment status."
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
                )}
            </section>
        </>
    );
}
