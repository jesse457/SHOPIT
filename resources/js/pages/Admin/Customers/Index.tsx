import { Link } from '@inertiajs/react';
import { MagnifyingGlass, Plus } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Badge from '@/components/ui/badge/Badge';
import { ButtonLink } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import { useAdminFilters } from '@/hooks/useAdminFilters';
import { formatDate } from '@/lib/utils';
import {
    create as adminCustomerCreate,
    edit as adminCustomerEdit,
    index as adminCustomersIndex,
} from '@/routes/admin/customers';
import type { AdminCustomer, Paginated } from '@/types';

interface CustomerFilters {
    q: string;
    role: string | null;
}

interface CustomersIndexProps {
    customers: Paginated<AdminCustomer>;
    filters: CustomerFilters;
}

export default function CustomersIndex({
    customers,
    filters,
}: CustomersIndexProps) {
    const { apply } = useAdminFilters(
        adminCustomersIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['customers', 'filters'],
    );

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        apply({ q: String(form.get('q') ?? '') });
    };

    return (
        <>
            <PageMeta
                title="Customers"
                description="Manage customer and staff accounts."
                noIndex
            />

            <PageHeader
                title="Customers"
                description="Customer accounts, staff accounts and their order counts."
                action={
                    <ButtonLink
                        href={adminCustomerCreate.url()}
                        size="sm"
                        startIcon={<Plus size={14} aria-hidden="true" />}
                    >
                        New customer
                    </ButtonLink>
                }
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="relative"
                >
                    <label htmlFor="customer-search" className="sr-only">
                        Search customers
                    </label>
                    <MagnifyingGlass
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                    />
                    <input
                        id="customer-search"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Name or email"
                        className="h-9 w-56 rounded-sm border border-line bg-surface pr-3 pl-8 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                </form>

                <label htmlFor="customer-role" className="sr-only">
                    Role
                </label>
                <select
                    id="customer-role"
                    value={filters.role ?? ''}
                    onChange={(event) =>
                        apply({ role: event.target.value || null })
                    }
                    className="h-9 rounded-sm border border-line bg-surface px-2.5 text-[12px] text-ink focus:border-ink focus:outline-none"
                >
                    <option value="">All accounts</option>
                    <option value="customers">Customers</option>
                    <option value="admins">Admins</option>
                </select>
            </div>

            {customers.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Customer',
                                        'Role',
                                        'Orders',
                                        'Joined',
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
                                {customers.data.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        className="transition-colors hover:bg-raised/60"
                                    >
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-ink">
                                                {customer.name}
                                            </p>
                                            <p className="text-[10px] text-muted">
                                                {customer.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={
                                                    customer.is_admin
                                                        ? 'clay'
                                                        : 'neutral'
                                                }
                                            >
                                                {customer.is_admin
                                                    ? 'Admin'
                                                    : 'Customer'}
                                            </Badge>
                                        </td>
                                        <td className="tabular px-4 py-3 text-soft">
                                            {customer.orders_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-muted">
                                            {formatDate(customer.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <Link
                                                href={adminCustomerEdit.url(
                                                    customer.id,
                                                )}
                                                className="text-[11px] font-medium text-clay hover:text-ink"
                                            >
                                                Edit
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={customers.current_page}
                        lastPage={customers.last_page}
                        total={customers.total}
                        from={customers.from}
                        to={customers.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No customers match"
                    description="Adjust the filters or create an account."
                    action={
                        <ButtonLink href={adminCustomerCreate.url()} size="sm">
                            New customer
                        </ButtonLink>
                    }
                />
            )}
        </>
    );
}
