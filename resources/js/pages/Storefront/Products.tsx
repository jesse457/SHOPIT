import { FunnelSimple, MagnifyingGlass, X } from '@phosphor-icons/react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';

import PageMeta from '@/components/common/PageMeta';
import Reveal from '@/components/common/Reveal';
import ProductCard from '@/components/storefront/ProductCard';
import { Button } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import { useCatalogFilters } from '@/hooks/useCatalogFilters';
import { cn, formatCurrency } from '@/lib/utils';
import type {
    Brand,
    CatalogFilters,
    Category,
    Paginated,
    PriceBounds,
    Product,
} from '@/types';

interface ProductsProps {
    products: Paginated<Product>;
    categories: Category[];
    brands: Brand[];
    filters: CatalogFilters;
    priceBounds: PriceBounds;
}

interface FilterChip {
    key: string;
    label: string;
    onRemove: () => void;
}

export default function Products({
    products,
    categories,
    brands,
    filters,
    priceBounds,
}: ProductsProps) {
    const { apply } = useCatalogFilters(filters);
    const [search, setSearch] = useState(filters.q);
    const [minPrice, setMinPrice] = useState(filters.min_price?.toString() ?? '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price?.toString() ?? '');
    const [isFiltersOpen, setIsFiltersOpen] = useState(false);

    useEffect(() => {
        setSearch(filters.q);
        setMinPrice(filters.min_price?.toString() ?? '');
        setMaxPrice(filters.max_price?.toString() ?? '');
    }, [filters]);

    const meta = products.meta;
    const currentPage = meta?.current_page ?? 1;
    const lastPage = meta?.last_page ?? 1;
    const total = meta?.total ?? products.data.length;

    const activeCount =
        filters.categories.length +
        filters.brands.length +
        (filters.featured ? 1 : 0) +
        (filters.on_sale ? 1 : 0) +
        (filters.min_price !== null || filters.max_price !== null ? 1 : 0) +
        (filters.q !== '' ? 1 : 0);

    const toggleCategory = (slug: string) => {
        apply({
            categories: filters.categories.includes(slug)
                ? filters.categories.filter((item) => item !== slug)
                : [...filters.categories, slug],
        });
    };

    const toggleBrand = (slug: string) => {
        apply({
            brands: filters.brands.includes(slug)
                ? filters.brands.filter((item) => item !== slug)
                : [...filters.brands, slug],
        });
    };

    const submitSearch = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        apply({ q: search });
    };

    const submitPrice = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        apply({
            min_price: minPrice === '' ? null : Number(minPrice),
            max_price: maxPrice === '' ? null : Number(maxPrice),
        });
    };

    const clearAll = () => {
        apply({
            q: '',
            categories: [],
            brands: [],
            featured: false,
            on_sale: false,
            min_price: null,
            max_price: null,
            sort: 'latest',
        });
    };

    const chips: FilterChip[] = [];

    filters.categories.forEach((slug) => {
        const category = categories.find((item) => item.slug === slug);
        chips.push({
            key: `category-${slug}`,
            label: category?.name ?? slug,
            onRemove: () =>
                apply({
                    categories: filters.categories.filter((item) => item !== slug),
                }),
        });
    });

    filters.brands.forEach((slug) => {
        const brand = brands.find((item) => item.slug === slug);
        chips.push({
            key: `brand-${slug}`,
            label: brand?.name ?? slug,
            onRemove: () =>
                apply({
                    brands: filters.brands.filter((item) => item !== slug),
                }),
        });
    });

    if (filters.featured) {
        chips.push({
            key: 'featured',
            label: 'Featured',
            onRemove: () => apply({ featured: false }),
        });
    }

    if (filters.on_sale) {
        chips.push({
            key: 'on-sale',
            label: 'On sale',
            onRemove: () => apply({ on_sale: false }),
        });
    }

    if (filters.min_price !== null || filters.max_price !== null) {
        const from = filters.min_price !== null ? formatCurrency(filters.min_price) : 'Any';
        const to = filters.max_price !== null ? formatCurrency(filters.max_price) : 'Any';
        chips.push({
            key: 'price',
            label: `${from} to ${to}`,
            onRemove: () => apply({ min_price: null, max_price: null }),
        });
    }

    if (filters.q !== '') {
        chips.push({
            key: 'query',
            label: `Search: ${filters.q}`,
            onRemove: () => apply({ q: '' }),
        });
    }

    return (
        <>
            <PageMeta
                title="Shop the collection"
                description="Browse the full SHOPIT edit. Filter by department, brand, price and availability."
            />

            <section className="container-shop pt-10 pb-8 lg:pt-14">
                <div className="flex flex-wrap items-end justify-between gap-5">
                    <div>
                        <h1 className="text-[clamp(2.6rem,6vw,5rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                            The collection
                        </h1>
                        <p className="mt-4 max-w-[52ch] text-[14px] leading-relaxed text-soft">
                            A tight edit across apparel, objects and technology.
                            Filter it down to the few things worth keeping.
                        </p>
                    </div>
                    <p className="text-[12px] text-muted tabular">
                        {total} {total === 1 ? 'piece' : 'pieces'}
                    </p>
                </div>
            </section>

            <div className="container-shop pb-20">
                <div className="grid gap-8 lg:grid-cols-[240px_1fr] lg:gap-12">
                    <aside
                        className={cn(
                            'lg:sticky lg:top-24 lg:self-start',
                            isFiltersOpen ? 'block' : 'hidden lg:block',
                        )}
                    >
                        <div className="flex items-center justify-between border-b border-line pb-3">
                            <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                                Filters
                            </p>
                            {activeCount > 0 && (
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="text-[11px] font-medium text-clay hover:text-ink"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        <form onSubmit={submitSearch} role="search" className="relative mt-5">
                            <label htmlFor="catalog-search" className="sr-only">
                                Search products
                            </label>
                            <MagnifyingGlass
                                size={15}
                                className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 text-muted"
                                aria-hidden="true"
                            />
                            <input
                                id="catalog-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search the edit"
                                className="h-10 w-full border-b border-line bg-transparent pr-2 pl-5 text-[13px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                            />
                        </form>

                        <div className="mt-7 border-t border-line pt-5">
                            <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                                Department
                            </p>
                            <div className="mt-3 space-y-0.5">
                                {categories.map((category) => (
                                    <label
                                        key={category.id}
                                        className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-soft transition-colors hover:text-ink"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.categories.includes(category.slug)}
                                            onChange={() => toggleCategory(category.slug)}
                                            className="h-4 w-4 rounded-xs border-line accent-clay"
                                        />
                                        <span>{category.name}</span>
                                        <span className="ml-auto text-[11px] text-muted tabular">
                                            {category.products_count ?? 0}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-7 border-t border-line pt-5">
                            <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                                Brand
                            </p>
                            <div className="mt-3 space-y-0.5">
                                {brands.map((brand) => (
                                    <label
                                        key={brand.id}
                                        className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-soft transition-colors hover:text-ink"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={filters.brands.includes(brand.slug)}
                                            onChange={() => toggleBrand(brand.slug)}
                                            className="h-4 w-4 rounded-xs border-line accent-clay"
                                        />
                                        <span>{brand.name}</span>
                                        <span className="ml-auto text-[11px] text-muted tabular">
                                            {brand.products_count ?? 0}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="mt-7 border-t border-line pt-5">
                            <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                                Availability
                            </p>
                            <div className="mt-3 space-y-0.5">
                                <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-soft transition-colors hover:text-ink">
                                    <input
                                        type="checkbox"
                                        checked={filters.featured}
                                        onChange={() =>
                                            apply({ featured: !filters.featured })
                                        }
                                        className="h-4 w-4 rounded-xs border-line accent-clay"
                                    />
                                    <span>Featured</span>
                                </label>
                                <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-[13px] text-soft transition-colors hover:text-ink">
                                    <input
                                        type="checkbox"
                                        checked={filters.on_sale}
                                        onChange={() =>
                                            apply({ on_sale: !filters.on_sale })
                                        }
                                        className="h-4 w-4 rounded-xs border-line accent-clay"
                                    />
                                    <span>On sale</span>
                                </label>
                            </div>
                        </div>

                        <form onSubmit={submitPrice} className="mt-7 border-t border-line pt-5">
                            <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">
                                Price
                            </p>
                            <div className="mt-3 flex items-center gap-2">
                                <label htmlFor="min-price" className="sr-only">
                                    Minimum price
                                </label>
                                <input
                                    id="min-price"
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={priceBounds.max}
                                    value={minPrice}
                                    onChange={(event) => setMinPrice(event.target.value)}
                                    placeholder={String(Math.floor(priceBounds.min))}
                                    className="h-10 w-full rounded-sm border border-line bg-transparent px-2.5 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                                />
                                <span className="text-muted" aria-hidden="true">
                                    to
                                </span>
                                <label htmlFor="max-price" className="sr-only">
                                    Maximum price
                                </label>
                                <input
                                    id="max-price"
                                    type="number"
                                    inputMode="numeric"
                                    min={0}
                                    max={priceBounds.max}
                                    value={maxPrice}
                                    onChange={(event) => setMaxPrice(event.target.value)}
                                    placeholder={String(Math.ceil(priceBounds.max))}
                                    className="h-10 w-full rounded-sm border border-line bg-transparent px-2.5 text-[12px] text-ink placeholder:text-muted focus:border-ink focus:outline-none"
                                />
                            </div>
                            <Button
                                type="submit"
                                variant="secondary"
                                size="sm"
                                fullWidth
                                className="mt-3"
                            >
                                Apply price
                            </Button>
                        </form>
                    </aside>

                    <div>
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line pb-4">
                            <button
                                type="button"
                                onClick={() => setIsFiltersOpen((open) => !open)}
                                aria-expanded={isFiltersOpen}
                                className="flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink lg:hidden"
                            >
                                <FunnelSimple size={16} aria-hidden="true" />
                                Filters
                                {activeCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-clay px-1 text-[10px] text-canvas tabular">
                                        {activeCount}
                                    </span>
                                )}
                            </button>

                            <div className="ml-auto flex items-center gap-2">
                                <label
                                    htmlFor="catalog-sort"
                                    className="text-[11px] font-medium tracking-[0.1em] text-muted uppercase"
                                >
                                    Sort
                                </label>
                                <select
                                    id="catalog-sort"
                                    value={filters.sort}
                                    onChange={(event) =>
                                        apply({
                                            sort: event.target.value as CatalogFilters['sort'],
                                        })
                                    }
                                    className="h-9 rounded-sm border border-line bg-transparent px-2.5 text-[12px] text-ink focus:border-ink focus:outline-none"
                                >
                                    <option value="latest">Latest</option>
                                    <option value="price_asc">Price: low to high</option>
                                    <option value="price_desc">Price: high to low</option>
                                    <option value="name_asc">Name: A to Z</option>
                                </select>
                            </div>
                        </div>

                        {chips.length > 0 && (
                            <div className="flex flex-wrap items-center gap-2 pt-4">
                                {chips.map((chip) => (
                                    <button
                                        key={chip.key}
                                        type="button"
                                        onClick={chip.onRemove}
                                        className="flex items-center gap-1.5 rounded-full border border-line bg-raised px-2.5 py-1 text-[11px] font-medium text-soft transition-colors hover:border-ink hover:text-ink"
                                    >
                                        {chip.label}
                                        <X size={11} aria-hidden="true" />
                                    </button>
                                ))}
                                <button
                                    type="button"
                                    onClick={clearAll}
                                    className="ml-1 text-[11px] font-medium text-clay hover:text-ink"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}

                        <Reveal>
                            {products.data.length > 0 ? (
                                <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4">
                                    {products.data.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                            ) : (
                                <EmptyState
                                    className="mt-8"
                                    title="Nothing matches that edit"
                                    description="Try a broader price range or clear a filter to see more of the collection."
                                    action={
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={clearAll}
                                        >
                                            Clear filters
                                        </Button>
                                    }
                                />
                            )}
                        </Reveal>

                        {products.data.length > 0 && (
                            <Pagination
                                currentPage={currentPage}
                                lastPage={lastPage}
                                total={total}
                                from={meta?.from ?? null}
                                to={meta?.to ?? null}
                                onPageChange={(page) => apply({}, { page })}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
