import { Link } from '@inertiajs/react';
import { MagnifyingGlass } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Badge from '@/components/ui/badge/Badge';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import { useAdminFilters } from '@/hooks/useAdminFilters';
import {
    formatCurrency,
    formatDate,
    orderStatusTone,
    paymentStatusTone,
} from '@/lib/utils';
import {
    index as adminOrdersIndex,
    show as adminOrderShow,
} from '@/routes/admin/orders';
import type { AdminOrderSummary, Paginated } from '@/types';

interface OrderFilters {
    q: string;
    status: string | null;
    payment_status: string | null;
}

interface StatusOption {
    value: string;
    label: string;
}

interface OrdersIndexProps {
    orders: Paginated<AdminOrderSummary>;
    filters: OrderFilters;
    statuses: StatusOption[];
    paymentStatuses: StatusOption[];
}

export default function OrdersIndex({
    orders,
    filters,
    statuses,
    paymentStatuses,
}: OrdersIndexProps) {
    const { apply } = useAdminFilters(
        adminOrdersIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['orders', 'filters'],
    );

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        apply({ q: String(form.get('q') ?? '') });
    };

    const selectClass =
        'h-9 rounded-sm border border-line bg-surface px-2.5 text-[12px] text-ink focus:border-ink focus:outline-none';

    return (
        <>
            <PageMeta
                title="Orders"
                description="Review and update store orders."
                noIndex
            />

            <PageHeader
                title="Orders"
                description="Every order, its payment state and its fulfillment state."
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="relative"
                >
                    <label htmlFor="order-search" className="sr-only">
                        Search orders
                    </label>
                    <MagnifyingGlass
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                    />
                    <input
                        id="order-search"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Order number or customer"
                        className="h-9 w-60 rounded-sm border border-line bg-surface pr-3 pl-8 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                </form>

                <label htmlFor="order-status" className="sr-only">
                    Status
                </label>
                <select
                    id="order-status"
                    value={filters.status ?? ''}
                    onChange={(event) =>
                        apply({ status: event.target.value || null })
                    }
                    className={selectClass}
                >
                    <option value="">Any status</option>
                    {statuses.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>

                <label htmlFor="order-payment-status" className="sr-only">
                    Payment status
                </label>
                <select
                    id="order-payment-status"
                    value={filters.payment_status ?? ''}
                    onChange={(event) =>
                        apply({
                            payment_status: event.target.value || null,
                        })
                    }
                    className={selectClass}
                >
                    <option value="">Any payment</option>
                    {paymentStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                            {status.label}
                        </option>
                    ))}
                </select>
            </div>

            {orders.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Order',
                                        'Customer',
                                        'Date',
                                        'Status',
                                        'Payment',
                                        'Total',
                                        '',
                                    ].map((heading) => (
                                        <th
                                            key={heading || 'actions'}
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
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                                            {order.number}
                                        </td>
                                        <td className="max-w-[200px] px-4 py-3">
                                            <p className="truncate text-ink">
                                                {order.user?.name ?? 'Guest'}
                                            </p>
                                            <p className="truncate text-[10px] text-muted">
                                                {order.user?.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-soft">
                                            {formatDate(order.created_at)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={orderStatusTone(
                                                    order.status,
                                                )}
                                            >
                                                {order.status_label}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={paymentStatusTone(
                                                    order.payment_status,
                                                )}
                                            >
                                                {order.payment_status_label}
                                            </Badge>
                                        </td>
                                        <td className="tabular px-4 py-3 whitespace-nowrap">
                                            {formatCurrency(order.grand_total)}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <Link
                                                href={adminOrderShow.url(
                                                    order.id,
                                                )}
                                                className="text-[11px] font-medium text-clay hover:text-ink"
                                            >
                                                View
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={orders.current_page}
                        lastPage={orders.last_page}
                        total={orders.total}
                        from={orders.from}
                        to={orders.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No orders match"
                    description="Adjust the filters to see more orders."
                />
            )}
        </>
    );
}
