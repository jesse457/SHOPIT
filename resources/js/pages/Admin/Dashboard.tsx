import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    Clock,
    Money,
    Receipt,
    TrendDown,
    TrendUp,
    Users,
    WarningCircle,
} from '@phosphor-icons/react';

import PageHeader from '@/components/admin/PageHeader';
import RevenueChart from '@/components/admin/RevenueChart';
import StatCard from '@/components/admin/StatCard';
import StatusBreakdown from '@/components/admin/StatusBreakdown';
import VisitorChart from '@/components/admin/VisitorChart';
import PageMeta from '@/components/common/PageMeta';
import Badge from '@/components/ui/badge/Badge';
import { formatCurrency, orderStatusTone } from '@/lib/utils';
import {
    index as adminOrdersIndex,
    show as adminOrderShow,
} from '@/routes/admin/orders';
import { index as adminProductsIndex } from '@/routes/admin/products';
import type { PageProps } from '@/types';

interface DashboardStats {
    revenue_this_month: number;
    revenue_last_month: number;
    revenue_change_percent: number | null;
    orders_this_month: number;
    pending_orders: number;
    customers: number;
    low_stock: number;
}

interface RecentOrder {
    id: number;
    number: string;
    status: string;
    status_label: string;
    payment_status: string;
    grand_total: string;
    created_at: string;
    user?: { id: number; name: string; email: string } | null;
}

interface LowStockProduct {
    id: number;
    name: string;
    stock_quantity: number;
    low_stock_threshold: number;
}

interface DashboardProps {
    stats: DashboardStats;
    revenueSeries: Array<{ month: string; label: string; revenue: number }>;
    statusBreakdown: Array<{ status: string; label: string; count: number }>;
    visitorSeries: Array<{ date: string; label: string; count: number }>;
    recentOrders: RecentOrder[];
    lowStockProducts: LowStockProduct[];
}

export default function Dashboard({
    stats,
    revenueSeries,
    statusBreakdown,
    visitorSeries,
    recentOrders,
    lowStockProducts,
}: DashboardProps) {
    const { shop } = usePage<PageProps>().props;
    const money = (value: number | string) =>
        formatCurrency(value, shop.currency, shop.currency_locale);
    const change = stats.revenue_change_percent;
    const changeUp = change !== null && change >= 0;

    return (
        <>
            <PageMeta
                title="Store overview"
                description="Sales, orders and store activity."
                noIndex
            />

            <PageHeader
                title="Store overview"
                description={new Intl.DateTimeFormat('en-GB', {
                    dateStyle: 'long',
                }).format(new Date())}
            />

            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                <StatCard
                    label="Revenue this month"
                    value={money(stats.revenue_this_month)}
                    icon={<Money size={19} aria-hidden="true" />}
                    meta={
                        change === null
                            ? 'No prior month to compare'
                            : `${changeUp ? '+' : ''}${change}% vs last month`
                    }
                    className="sm:col-span-2 xl:col-span-1"
                />
                <StatCard
                    label="Orders this month"
                    value={stats.orders_this_month}
                    icon={<Receipt size={19} aria-hidden="true" />}
                    meta="Paid and unpaid"
                />
                <StatCard
                    label="Awaiting payment"
                    value={stats.pending_orders}
                    icon={<Clock size={19} aria-hidden="true" />}
                    meta="Pending orders"
                />
                <StatCard
                    label="Customers"
                    value={stats.customers}
                    icon={<Users size={19} aria-hidden="true" />}
                    meta="Non-admin accounts"
                />
                <StatCard
                    label="Low stock"
                    value={stats.low_stock}
                    icon={<WarningCircle size={19} aria-hidden="true" />}
                    meta="At or below threshold"
                />
            </div>

            {change !== null && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-muted">
                    {changeUp ? (
                        <TrendUp
                            size={13}
                            className="text-success"
                            aria-hidden="true"
                        />
                    ) : (
                        <TrendDown
                            size={13}
                            className="text-danger"
                            aria-hidden="true"
                        />
                    )}
                    Revenue moved {changeUp ? 'up' : 'down'} {Math.abs(change)}%
                    from last month.
                </p>
            )}

            <div className="mt-6 grid gap-4 xl:grid-cols-3">
                <section className="rounded-sm border border-line bg-surface p-5 xl:col-span-2">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="font-display text-[23px] leading-none font-medium">
                                Revenue
                            </h2>
                            <p className="mt-1.5 text-[11px] text-muted">
                                Paid orders, last twelve months.
                            </p>
                        </div>
                        <p className="tabular text-[11px] text-muted">
                            {money(stats.revenue_this_month)} this month
                        </p>
                    </div>

                    <div className="mt-5">
                        <RevenueChart data={revenueSeries} />
                    </div>

                    <details className="mt-4 border-t border-line pt-3">
                        <summary className="cursor-pointer text-[11px] font-medium text-muted hover:text-ink">
                            View data
                        </summary>
                        <table className="mt-3 w-full text-[11px]">
                            <thead>
                                <tr className="text-left text-muted">
                                    <th className="py-1 font-medium">Month</th>
                                    <th className="py-1 text-right font-medium">
                                        Revenue
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {revenueSeries.map((point) => (
                                    <tr key={point.month}>
                                        <td className="py-1.5 text-soft">
                                            {point.label}{' '}
                                            {point.month.slice(0, 4)}
                                        </td>
                                        <td className="tabular py-1.5 text-right text-ink">
                                            {money(point.revenue)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </details>
                </section>

                <section className="rounded-sm border border-line bg-surface p-5">
                    <h2 className="font-display text-[23px] leading-none font-medium">
                        Orders by status
                    </h2>
                    <p className="mt-1.5 text-[11px] text-muted">
                        Every order in the store.
                    </p>
                    <div className="mt-5">
                        <StatusBreakdown data={statusBreakdown} />
                    </div>
                </section>
            </div>

            <div className="mt-4 grid gap-4 xl:grid-cols-3">
                <section className="overflow-hidden rounded-sm border border-line bg-surface xl:col-span-2">
                    <div className="flex items-center justify-between gap-4 border-b border-line px-5 py-4">
                        <h2 className="font-display text-[23px] leading-none font-medium">
                            Recent orders
                        </h2>
                        <Link
                            href={adminOrdersIndex.url()}
                            className="flex items-center gap-1.5 text-[11px] font-medium text-clay hover:text-ink"
                        >
                            All orders
                            <ArrowRight size={12} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Order',
                                        'Customer',
                                        'Status',
                                        'Total',
                                        '',
                                    ].map((heading) => (
                                        <th
                                            key={heading || 'action'}
                                            scope="col"
                                            className="px-5 py-2.5 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-muted uppercase"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {recentOrders.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="px-5 py-8 text-center text-[12px] text-muted"
                                        >
                                            No orders yet.
                                        </td>
                                    </tr>
                                ) : (
                                    recentOrders.map((order) => (
                                        <tr
                                            key={order.id}
                                            className="transition-colors hover:bg-raised/60"
                                        >
                                            <td className="px-5 py-3 font-medium whitespace-nowrap">
                                                {order.number}
                                            </td>
                                            <td className="max-w-[180px] truncate px-5 py-3 text-soft">
                                                {order.user?.name ?? 'Guest'}
                                            </td>
                                            <td className="px-5 py-3">
                                                <Badge
                                                    tone={orderStatusTone(
                                                        order.status,
                                                    )}
                                                >
                                                    {order.status_label}
                                                </Badge>
                                            </td>
                                            <td className="tabular px-5 py-3 whitespace-nowrap">
                                                {money(order.grand_total)}
                                            </td>
                                            <td className="px-5 py-3 text-right whitespace-nowrap">
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
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="space-y-4">
                    <section className="rounded-sm border border-line bg-surface p-5">
                        <h2 className="font-display text-[23px] leading-none font-medium">
                            Store visits
                        </h2>
                        <p className="mt-1.5 text-[11px] text-muted">
                            Last fourteen days.
                        </p>
                        <div className="mt-4">
                            <VisitorChart data={visitorSeries} />
                        </div>

                        <details className="mt-3 border-t border-line pt-3">
                            <summary className="cursor-pointer text-[11px] font-medium text-muted hover:text-ink">
                                View data
                            </summary>
                            <table className="mt-2 w-full text-[11px]">
                                <thead>
                                    <tr className="text-left text-muted">
                                        <th className="py-1 font-medium">
                                            Day
                                        </th>
                                        <th className="py-1 text-right font-medium">
                                            Visits
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-line">
                                    {visitorSeries.map((point) => (
                                        <tr key={point.date}>
                                            <td className="py-1 text-soft">
                                                {point.label}
                                            </td>
                                            <td className="tabular py-1 text-right text-ink">
                                                {point.count}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </details>
                    </section>

                    <section className="rounded-sm border border-line bg-surface p-5">
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="font-display text-[23px] leading-none font-medium">
                                Low stock
                            </h2>
                            <Link
                                href={adminProductsIndex.url({
                                    query: { stock: 'low' },
                                })}
                                className="text-[11px] font-medium text-clay hover:text-ink"
                            >
                                View
                            </Link>
                        </div>

                        {lowStockProducts.length > 0 ? (
                            <ul className="mt-4 divide-y divide-line border-t border-line">
                                {lowStockProducts.map((product) => (
                                    <li
                                        key={product.id}
                                        className="flex items-center justify-between gap-3 py-2.5 text-[12px]"
                                    >
                                        <span className="truncate text-soft">
                                            {product.name}
                                        </span>
                                        <span className="tabular shrink-0 font-medium text-sun">
                                            {product.stock_quantity} left
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="mt-4 text-[12px] text-muted">
                                Every active product is above its threshold.
                            </p>
                        )}
                    </section>
                </div>
            </div>

            <p className="mt-5 text-[11px] text-muted">
                Revenue is counted from paid orders. Unpaid card orders release
                their reserved stock automatically after the hold window.
            </p>
        </>
    );
}
