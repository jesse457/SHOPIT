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
    create as adminProductCreate,
    destroy as adminProductDestroy,
    edit as adminProductEdit,
    index as adminProductsIndex,
} from '@/routes/admin/products';
import type { AdminProduct, Brand, Category, Paginated } from '@/types';

interface ProductFilters {
    q: string;
    category: number | null;
    brand: number | null;
    status: string | null;
    stock: string | null;
    sort: string;
}

interface ProductsIndexProps {
    products: Paginated<AdminProduct>;
    categories: Array<Pick<Category, 'id' | 'name' | 'slug'>>;
    brands: Array<Pick<Brand, 'id' | 'name' | 'slug'>>;
    filters: ProductFilters;
}

export default function ProductsIndex({
    products,
    categories,
    brands,
    filters,
}: ProductsIndexProps) {
    const { apply } = useAdminFilters(
        adminProductsIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['products', 'filters'],
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
                title="Products"
                description="Manage the store catalog."
                noIndex
            />

            <PageHeader
                title="Products"
                description="Create, edit and retire the pieces in the catalog."
                action={
                    <ButtonLink
                        href={adminProductCreate.url()}
                        size="sm"
                        startIcon={<Plus size={14} aria-hidden="true" />}
                    >
                        New product
                    </ButtonLink>
                }
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <form
                    onSubmit={submitSearch}
                    role="search"
                    className="relative"
                >
                    <label htmlFor="product-search" className="sr-only">
                        Search products
                    </label>
                    <MagnifyingGlass
                        size={15}
                        className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted"
                        aria-hidden="true"
                    />
                    <input
                        id="product-search"
                        name="q"
                        type="search"
                        defaultValue={filters.q}
                        placeholder="Search products"
                        className="h-9 w-52 rounded-sm border border-line bg-surface pr-3 pl-8 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                    />
                </form>

                <label htmlFor="product-category" className="sr-only">
                    Category
                </label>
                <select
                    id="product-category"
                    value={filters.category ?? ''}
                    onChange={(event) =>
                        apply({
                            category: event.target.value || null,
                        })
                    }
                    className={selectClass}
                >
                    <option value="">All categories</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="product-brand" className="sr-only">
                    Brand
                </label>
                <select
                    id="product-brand"
                    value={filters.brand ?? ''}
                    onChange={(event) =>
                        apply({ brand: event.target.value || null })
                    }
                    className={selectClass}
                >
                    <option value="">All brands</option>
                    {brands.map((brand) => (
                        <option key={brand.id} value={brand.id}>
                            {brand.name}
                        </option>
                    ))}
                </select>

                <label htmlFor="product-status" className="sr-only">
                    Status
                </label>
                <select
                    id="product-status"
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

                <label htmlFor="product-stock" className="sr-only">
                    Stock
                </label>
                <select
                    id="product-stock"
                    value={filters.stock ?? ''}
                    onChange={(event) =>
                        apply({ stock: event.target.value || null })
                    }
                    className={selectClass}
                >
                    <option value="">Any stock</option>
                    <option value="low">Low stock</option>
                    <option value="out">Out of stock</option>
                </select>

                <label htmlFor="product-sort" className="sr-only">
                    Sort
                </label>
                <select
                    id="product-sort"
                    value={filters.sort}
                    onChange={(event) => apply({ sort: event.target.value })}
                    className={selectClass}
                >
                    <option value="latest">Latest</option>
                    <option value="name">Name</option>
                    <option value="price_asc">Price: low to high</option>
                    <option value="price_desc">Price: high to low</option>
                </select>
            </div>

            {products.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Product',
                                        'Category',
                                        'Price',
                                        'Stock',
                                        'Status',
                                        'Updated',
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
                                {products.data.map((product) => (
                                    <tr
                                        key={product.id}
                                        className="transition-colors hover:bg-raised/60"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-10 shrink-0 overflow-hidden rounded-sm border border-line bg-raised">
                                                    <img
                                                        src={
                                                            product.image_url ??
                                                            '/images/product-placeholder.svg'
                                                        }
                                                        alt=""
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="truncate font-medium text-ink">
                                                        {product.name}
                                                    </p>
                                                    <p className="truncate text-[10px] text-muted">
                                                        {product.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-soft">
                                            {product.category?.name ?? '-'}
                                        </td>
                                        <td className="tabular px-4 py-3 whitespace-nowrap">
                                            {formatCurrency(product.price)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={
                                                    product.stock_quantity === 0
                                                        ? 'tabular font-medium text-danger'
                                                        : product.is_low_stock
                                                          ? 'tabular font-medium text-sun'
                                                          : 'tabular text-soft'
                                                }
                                            >
                                                {product.stock_quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1.5">
                                                <Badge
                                                    tone={
                                                        product.is_active
                                                            ? 'success'
                                                            : 'neutral'
                                                    }
                                                >
                                                    {product.is_active
                                                        ? 'Active'
                                                        : 'Inactive'}
                                                </Badge>
                                                {product.is_featured && (
                                                    <Badge tone="clay">
                                                        Featured
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 whitespace-nowrap text-muted">
                                            {formatDate(product.updated_at)}
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <Link
                                                    href={adminProductEdit.url(
                                                        product.slug,
                                                    )}
                                                    className="text-[11px] font-medium text-clay hover:text-ink"
                                                >
                                                    Edit
                                                </Link>
                                                <ConfirmDelete
                                                    url={adminProductDestroy.url(
                                                        product.slug,
                                                    )}
                                                    description="Delete product?"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={products.current_page}
                        lastPage={products.last_page}
                        total={products.total}
                        from={products.from}
                        to={products.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No products match"
                    description="Adjust the filters or create the first product in the catalog."
                    action={
                        <ButtonLink href={adminProductCreate.url()} size="sm">
                            New product
                        </ButtonLink>
                    }
                />
            )}
        </>
    );
}
