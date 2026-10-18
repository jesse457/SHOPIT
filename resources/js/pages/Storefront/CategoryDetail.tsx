import { Link, router } from '@inertiajs/react';
import { ArrowRight, SlidersHorizontal } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import Reveal from '@/components/common/Reveal';
import ProductCard from '@/components/storefront/ProductCard';
import ProductImage from '@/components/storefront/ProductImage';
import { ButtonLink } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import { home } from '@/routes';
import { index as categoriesIndex, show as categoryShow } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import type { Category, Paginated, Product } from '@/types';

const FALLBACK =
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80';

interface CategoryDetailProps {
    category: Category;
    products: Paginated<Product>;
}

export default function CategoryDetail({ category, products }: CategoryDetailProps) {
    const meta = products.meta;
    const total = meta?.total ?? products.data.length;

    const goToPage = (page: number) => {
        router.get(
            categoryShow.url(category.slug),
            page > 1 ? { page } : {},
            {
                preserveState: true,
                preserveScroll: true,
                only: ['products'],
            },
        );
    };

    return (
        <>
            <PageMeta
                title={category.name}
                description={`Shop the ${category.name} department from the SHOPIT edit.`}
                image={category.image_url ?? FALLBACK}
            />

            <div className="container-shop pt-6">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[11px] text-muted">
                    <Link href={home.url()} className="hover:text-ink">
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    <Link href={categoriesIndex.url()} className="hover:text-ink">
                        Departments
                    </Link>
                    <span aria-hidden="true">/</span>
                    <span className="text-soft">{category.name}</span>
                </nav>
            </div>

            <section className="container-shop grid gap-8 py-10 lg:grid-cols-[1fr_0.9fr] lg:items-end lg:gap-16 lg:py-14">
                <div>
                    <h1 className="text-[clamp(2.6rem,6vw,5rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                        {category.name}
                    </h1>
                    <p className="mt-4 max-w-[50ch] text-[14px] leading-relaxed text-soft">
                        The {category.name.toLowerCase()} department, edited down to
                        the pieces worth keeping. {total}{' '}
                        {total === 1 ? 'piece' : 'pieces'} in the current edit.
                    </p>
                    <div className="mt-6 flex flex-wrap gap-3">
                        <ButtonLink
                            href={`${productsIndex.url()}?category=${category.slug}`}
                            variant="secondary"
                            size="sm"
                            startIcon={<SlidersHorizontal size={14} aria-hidden="true" />}
                        >
                            Filter and sort
                        </ButtonLink>
                        <Link
                            href={productsIndex.url()}
                            className="flex h-9 items-center gap-1.5 px-1 text-[12px] font-medium text-soft hover:text-ink"
                        >
                            All products
                            <ArrowRight size={13} aria-hidden="true" />
                        </Link>
                    </div>
                </div>

                <div className="aspect-[5/3] overflow-hidden rounded-sm border border-line bg-raised">
                    <ProductImage
                        src={category.image_url ?? FALLBACK}
                        alt={category.name}
                        priority
                    />
                </div>
            </section>

            <div className="container-shop pb-20">
                {products.data.length > 0 ? (
                    <>
                        <Reveal>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
                                {products.data.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </Reveal>

                        <Pagination
                            currentPage={meta?.current_page ?? 1}
                            lastPage={meta?.last_page ?? 1}
                            total={total}
                            from={meta?.from ?? null}
                            to={meta?.to ?? null}
                            onPageChange={goToPage}
                        />
                    </>
                ) : (
                    <EmptyState
                        title="This department is being restocked"
                        description="The next pieces are on their way. Browse the full collection in the meantime."
                        action={
                            <ButtonLink href={productsIndex.url()} size="sm">
                                Shop all products
                            </ButtonLink>
                        }
                    />
                )}
            </div>
        </>
    );
}
