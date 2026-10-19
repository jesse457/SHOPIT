import { Link } from '@inertiajs/react';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import ConfirmDelete from '@/components/admin/ConfirmDelete';
import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Badge from '@/components/ui/badge/Badge';
import { ButtonLink } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import { useAdminFilters } from '@/hooks/useAdminFilters';
import { formatCurrency, formatDate } from '@/lib/utils';
import {
    create as adminCouponCreate,
    destroy as adminCouponDestroy,
    edit as adminCouponEdit,
    index as adminCouponsIndex,
} from '@/routes/admin/coupons';
import type { AdminCoupon, Paginated } from '@/types';

interface CouponFilters {
    q: string;
    status: string | null;
}

interface CouponsIndexProps {
    coupons: Paginated<AdminCoupon>;
    filters: CouponFilters;
}

export default function CouponsIndex({ coupons, filters }: CouponsIndexProps) {
    const { apply } = useAdminFilters(
        adminCouponsIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['coupons', 'filters'],
    );

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        apply({ q: String(form.get('q') ?? '') });
    };

    return (
        <>
            <PageMeta
                title="Coupons"
                description="Manage store discounts."
                noIndex
            />

            <PageHeader
                title="Coupons"
                description="Percentage and fixed-amount discounts for checkout."
                action={
                    <ButtonLink
                        href={adminCouponCreate.url()}
                        size="sm"
                        startIcon={<Plus size={14} aria-hidden="true" />}
                    >
                        New coupon
                    </ButtonLink>
                }
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="relative"
                >
                    <label htmlFor="coupon-search" className="sr-only">
                        Search coupons
                    </label>
                    <MagnifyingGlass
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                    />
                    <input
                        id="coupon-search"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Search codes"
                        className="h-9 w-52 rounded-sm border border-line bg-surface pr-3 pl-8 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                </form>

                <label htmlFor="coupon-status" className="sr-only">
                    Status
                </label>
                <select
                    id="coupon-status"
                    value={filters.status ?? ''}
                    onChange={(event) =>
                        apply({ status: event.target.value || null })
                    }
                    className="h-9 rounded-sm border border-line bg-surface px-2.5 text-[12px] text-ink focus:border-ink focus:outline-none"
                >
                    <option value="">Any status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {coupons.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Code',
                                        'Type',
                                        'Value',
                                        'Minimum',
                                        'Uses',
                                        'Expires',
                                        'Status',
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
                                {coupons.data.map((coupon) => (
                                    <tr
                                        key={coupon.id}
                                        className="transition-colors hover:bg-raised/60"
                                    >
                                        <td className="px-4 py-3 font-medium whitespace-nowrap">
                                            {coupon.code}
                                        </td>
                                        <td className="px-4 py-3 text-soft">
                                            {coupon.type_label}
                                        </td>
                                        <td className="tabular px-4 py-3 whitespace-nowrap">
                                            {coupon.type === 'percentage'
                                                ? `${coupon.value}%`
                                                : formatCurrency(coupon.value)}
                                        </td>
                                        <td className="tabular px-4 py-3 whitespace-nowrap text-soft">
                                            {coupon.min_order_amount
                                                ? formatCurrency(
                                                      coupon.min_order_amount,
                                                  )
                                                : '-'}
                                        </td>
                                        <td className="tabular px-4 py-3 text-soft">
                                            {coupon.used_count}
                                            {coupon.max_uses
                                                ? ` / ${coupon.max_uses}`
                                                : ''}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-muted">
                                            {coupon.expires_at
                                                ? formatDate(coupon.expires_at)
                                                : 'No expiry'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={
                                                    coupon.is_active
                                                        ? 'success'
                                                        : 'neutral'
                                                }
                                            >
                                                {coupon.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={adminCouponEdit.url(
                                                        coupon.code,
                                                    )}
                                                    className="text-[11px] font-medium text-clay hover:text-ink"
                                                >
                                                    Edit
                                                </Link>
                                                <ConfirmDelete
                                                    url={adminCouponDestroy.url(
                                                        coupon.code,
                                                    )}
                                                    description="Delete coupon?"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={coupons.current_page}
                        lastPage={coupons.last_page}
                        total={coupons.total}
                        from={coupons.from}
                        to={coupons.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No coupons match"
                    description="Create a discount code for the next campaign."
                    action={
                        <ButtonLink href={adminCouponCreate.url()} size="sm">
                            New coupon
                        </ButtonLink>
                    }
                />
            )}
        </>
    );
}
