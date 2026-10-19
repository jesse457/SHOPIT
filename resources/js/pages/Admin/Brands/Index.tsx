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
import {
    create as adminBrandCreate,
    destroy as adminBrandDestroy,
    edit as adminBrandEdit,
    index as adminBrandsIndex,
} from '@/routes/admin/brands';
import type { Brand, Paginated } from '@/types';

interface BrandFilters {
    q: string;
    status: string | null;
}

interface BrandsIndexProps {
    brands: Paginated<Brand>;
    filters: BrandFilters;
}

export default function BrandsIndex({ brands, filters }: BrandsIndexProps) {
    const { apply } = useAdminFilters(
        adminBrandsIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['brands', 'filters'],
    );

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        apply({ q: String(form.get('q') ?? '') });
    };

    return (
        <>
            <PageMeta
                title="Brands"
                description="Manage the store brands."
                noIndex
            />

            <PageHeader
                title="Brands"
                description="The makers behind the catalog."
                action={
                    <ButtonLink
                        href={adminBrandCreate.url()}
                        size="sm"
                        startIcon={<Plus size={14} aria-hidden="true" />}
                    >
                        New brand
                    </ButtonLink>
                }
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="relative"
                >
                    <label htmlFor="brand-search" className="sr-only">
                        Search brands
                    </label>
                    <MagnifyingGlass
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                    />
                    <input
                        id="brand-search"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Search brands"
                        className="h-9 w-52 rounded-sm border border-line bg-surface pr-3 pl-8 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                </form>

                <label htmlFor="brand-status" className="sr-only">
                    Status
                </label>
                <select
                    id="brand-status"
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

            {brands.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Brand',
                                        'Slug',
                                        'Products',
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
                                {brands.data.map((brand) => (
                                    <tr
                                        key={brand.id}
                                        className="transition-colors hover:bg-raised/60"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-line bg-raised">
                                                    <img
                                                        src={
                                                            brand.image_url ??
                                                            '/images/product-placeholder.svg'
                                                        }
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <p className="font-medium text-ink">
                                                    {brand.name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {brand.slug}
                                        </td>
                                        <td className="tabular px-4 py-3 text-soft">
                                            {brand.products_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={
                                                    brand.is_active
                                                        ? 'success'
                                                        : 'neutral'
                                                }
                                            >
                                                {brand.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={adminBrandEdit.url(
                                                        brand.slug,
                                                    )}
                                                    className="text-[11px] font-medium text-clay hover:text-ink"
                                                >
                                                    Edit
                                                </Link>
                                                <ConfirmDelete
                                                    url={adminBrandDestroy.url(
                                                        brand.slug,
                                                    )}
                                                    description="Delete brand?"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={brands.current_page}
                        lastPage={brands.last_page}
                        total={brands.total}
                        from={brands.from}
                        to={brands.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No brands match"
                    description="Adjust the filters or add a brand."
                    action={
                        <ButtonLink href={adminBrandCreate.url()} size="sm">
                            New brand
                        </ButtonLink>
                    }
                />
            )}
        </>
    );
}
