import { Link } from '@inertiajs/react';
import { ArrowRight } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import Reveal from '@/components/common/Reveal';
import ProductImage from '@/components/storefront/ProductImage';
import EmptyState from '@/components/ui/table/EmptyState';
import { ButtonLink } from '@/components/ui/button/Button';
import { show as categoryShow } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import type { Category } from '@/types';

const FALLBACKS = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
];

function categoryImage(category: Category, index: number): string {
    return category.image_url ?? FALLBACKS[index % FALLBACKS.length] ?? FALLBACKS[0];
}

export default function Categories({ categories }: { categories: Category[] }) {
    return (
        <>
            <PageMeta
                title="Departments"
                description="Shop the SHOPIT edit by department: apparel, footwear, accessories, home, technology and beauty."
            />

            <section className="container-shop pt-10 pb-8 lg:pt-14">
                <h1 className="max-w-3xl text-[clamp(2.6rem,6vw,5rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                    Six departments, one point of view.
                </h1>
                <p className="mt-4 max-w-[54ch] text-[14px] leading-relaxed text-soft">
                    Each department is edited down to the pieces we would use
                    ourselves. Start where you need something, or browse the whole
                    collection.
                </p>
                <div className="mt-6">
                    <ButtonLink
                        href={productsIndex.url()}
                        variant="secondary"
                        size="sm"
                        endIcon={<ArrowRight size={14} aria-hidden="true" />}
                    >
                        Shop all products
                    </ButtonLink>
                </div>
            </section>

            <div className="container-shop pb-20">
                {categories.length > 0 ? (
                    <Reveal>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {categories.map((category, index) => (
                                <Link
                                    key={category.id}
                                    href={categoryShow.url(category.slug)}
                                    className={`group relative flex min-h-64 overflow-hidden rounded-sm border border-line bg-raised ${
                                        index < 2
                                            ? 'lg:col-span-2 lg:min-h-80'
                                            : ''
                                    }`}
                                >
                                    <ProductImage
                                        src={categoryImage(category, index)}
                                        alt={category.name}
                                        className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#171410]/85 via-[#171410]/20 to-transparent" />
                                    <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 text-[#f6f2ea]">
                                        <div>
                                            <p className="font-display text-[30px] leading-none font-medium">
                                                {category.name}
                                            </p>
                                            <p className="mt-1.5 text-[11px] text-[#f6f2ea]/70 tabular">
                                                {category.products_count ?? 0}{' '}
                                                {(category.products_count ?? 0) === 1
                                                    ? 'piece'
                                                    : 'pieces'}
                                            </p>
                                        </div>
                                        <ArrowRight
                                            size={17}
                                            className="transition-transform duration-300 group-hover:translate-x-1"
                                            aria-hidden="true"
                                        />
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </Reveal>
                ) : (
                    <EmptyState
                        title="The departments are being prepared"
                        description="The first pieces are on their way. In the meantime, browse the full collection."
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
