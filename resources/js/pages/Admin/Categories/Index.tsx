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
    create as adminCategoryCreate,
    destroy as adminCategoryDestroy,
    edit as adminCategoryEdit,
    index as adminCategoriesIndex,
} from '@/routes/admin/categories';
import type { Category, Paginated } from '@/types';

interface CategoryFilters {
    q: string;
    status: string | null;
}

interface CategoriesIndexProps {
    categories: Paginated<Category>;
    filters: CategoryFilters;
}

export default function CategoriesIndex({
    categories,
    filters,
}: CategoriesIndexProps) {
    const { apply } = useAdminFilters(
        adminCategoriesIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['categories', 'filters'],
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
                title="Categories"
                description="Manage the store departments."
                noIndex
            />

            <PageHeader
                title="Categories"
                description="The departments shoppers browse in the storefront."
                action={
                    <ButtonLink
                        href={adminCategoryCreate.url()}
                        size="sm"
                        startIcon={<Plus size={14} aria-hidden="true" />}
                    >
                        New category
                    </ButtonLink>
                }
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="relative"
                >
                    <label htmlFor="category-search" className="sr-only">
                        Search categories
                    </label>
                    <MagnifyingGlass
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                    />
                    <input
                        id="category-search"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Search categories"
                        className="h-9 w-52 rounded-sm border border-line bg-surface pr-3 pl-8 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                </form>

                <label htmlFor="category-status" className="sr-only">
                    Status
                </label>
                <select
                    id="category-status"
                    value={filters.status ?? ''}
                    onChange={(event) =>
                        apply({ status: event.target.value || null })
                    }
                    className={selectClass}
                >
                    <option value="">Any status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </div>

            {categories.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Category',
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
                                {categories.data.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="transition-colors hover:bg-raised/60"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-sm border border-line bg-raised">
                                                    <img
                                                        src={
                                                            category.image_url ??
                                                            '/images/product-placeholder.svg'
                                                        }
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <p className="font-medium text-ink">
                                                    {category.name}
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-muted">
                                            {category.slug}
                                        </td>
                                        <td className="tabular px-4 py-3 text-soft">
                                            {category.products_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={
                                                    category.is_active
                                                        ? 'success'
                                                        : 'neutral'
                                                }
                                            >
                                                {category.is_active
                                                    ? 'Active'
                                                    : 'Inactive'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={adminCategoryEdit.url(
                                                        category.slug,
                                                    )}
                                                    className="text-[11px] font-medium text-clay hover:text-ink"
                                                >
                                                    Edit
                                                </Link>
                                                <ConfirmDelete
                                                    url={adminCategoryDestroy.url(
                                                        category.slug,
                                                    )}
                                                    description="Delete category?"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={categories.current_page}
                        lastPage={categories.last_page}
                        total={categories.total}
                        from={categories.from}
                        to={categories.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No categories match"
                    description="Adjust the filters or create a department."
                    action={
                        <ButtonLink href={adminCategoryCreate.url()} size="sm">
                            New category
                        </ButtonLink>
                    }
                />
            )}
        </>
    );
}
