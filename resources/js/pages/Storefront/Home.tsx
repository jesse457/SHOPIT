import { Link, usePage } from '@inertiajs/react';
import {
    ArrowRight,
    CreditCard,
    Package,
    Truck,
} from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import Reveal from '@/components/common/Reveal';
import ProductCard from '@/components/storefront/ProductCard';
import ProductImage from '@/components/storefront/ProductImage';
import { ButtonLink } from '@/components/ui/button/Button';
import { formatCurrency } from '@/lib/utils';
import { index as categoriesIndex, show as categoryShow } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import type { Brand, Category, PageProps, Product } from '@/types';

const HERO_IMAGE =
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80';

const STORY_IMAGE =
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1400&q=80';

const CATEGORY_FALLBACKS = [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1000&q=80',
    'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1000&q=80',
];

const PRINCIPLES = [
    {
        title: 'Useful first',
        copy: 'Every piece earns its place by doing a job well, not by following a trend.',
    },
    {
        title: 'Honest materials',
        copy: 'We favour natural fibres, solid hardware and finishes that age with use.',
    },
    {
        title: 'Made to be kept',
        copy: 'The edit stays small on purpose. Fewer, better things, chosen to last.',
    },
];

function DepartmentCard({
    category,
    index,
    featured,
}: {
    category: Category;
    index: number;
    featured: boolean;
}) {
    const image =
        category.image_url ??
        CATEGORY_FALLBACKS[index % CATEGORY_FALLBACKS.length] ??
        CATEGORY_FALLBACKS[0];

    return (
        <Link
            href={categoryShow.url(category.slug)}
            className={`group relative flex min-h-52 overflow-hidden rounded-sm border border-line bg-raised ${
                featured ? 'md:col-span-2 md:min-h-72' : ''
            }`}
        >
            <ProductImage
                src={image}
                alt={category.name}
                className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#171410]/80 via-[#171410]/15 to-transparent" />
            <div className="relative mt-auto flex w-full items-end justify-between gap-4 p-5 text-[#f6f2ea]">
                <span className="font-display text-[27px] leading-none font-medium tracking-[-0.01em]">
                    {category.name}
                </span>
                <ArrowRight
                    size={17}
                    className="translate-x-0 transition-transform duration-300 group-hover:translate-x-1"
                    aria-hidden="true"
                />
            </div>
        </Link>
    );
}

interface HomeProps {
    departments: Category[];
    newArrivals: Product[];
    brands: Brand[];
}

export default function Home({ departments, newArrivals, brands }: HomeProps) {
    const { shop } = usePage<PageProps>().props;
    const freeShipping = formatCurrency(
        shop.shipping.free_threshold,
        shop.currency,
        shop.currency_locale,
    );

    return (
        <>
            <PageMeta
                title="A considered edit of everyday things"
                description="Apparel, objects and technology chosen for how they live, not how they sell. Complimentary delivery over 50,000 FCFA."
                image={HERO_IMAGE}
            />

            <section className="container-shop grid gap-10 pt-10 pb-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:pt-16 lg:pb-24">
                <div className="max-w-2xl">
                    <p className="eyebrow">The considered edit</p>
                    <h1 className="mt-5 text-[clamp(2.9rem,6vw,5.6rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                        Objects for the way you live.
                    </h1>
                    <p className="mt-6 max-w-[46ch] text-[16px] leading-relaxed text-soft">
                        A tight edit of apparel, objects and technology. Chosen for
                        how they live, not how they sell.
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-3">
                        <ButtonLink
                            href={productsIndex.url()}
                            size="lg"
                            endIcon={<ArrowRight size={16} aria-hidden="true" />}
                        >
                            Shop the edit
                        </ButtonLink>
                        <ButtonLink
                            href={categoriesIndex.url()}
                            variant="secondary"
                            size="lg"
                        >
                            Browse departments
                        </ButtonLink>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute -right-3 -bottom-3 h-full w-full rounded-sm bg-raised" aria-hidden="true" />
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-raised">
                        <img
                            src={HERO_IMAGE}
                            alt="A warm, considered retail interior with clothes and objects on display"
                            fetchPriority="high"
                            className="h-full w-full object-cover"
                        />
                    </div>
                </div>
            </section>

            <Reveal>
                <section className="border-y border-line bg-surface">
                    <div className="container-shop grid divide-y divide-line py-2 md:grid-cols-3 md:divide-x md:divide-y-0">
                        {[
                            {
                                icon: Truck,
                                title: 'Delivery that is worth it',
                                copy: `Complimentary over ${freeShipping}.`,
                            },
                            {
                                icon: CreditCard,
                                title: 'Pay how you prefer',
                                copy: 'Secure card checkout or cash on delivery.',
                            },
                            {
                                icon: Package,
                                title: 'Stock you can trust',
                                copy: 'Live inventory, checked again at checkout.',
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-4 px-1 py-6 md:px-7"
                                >
                                    <Icon
                                        size={21}
                                        className="mt-0.5 shrink-0 text-clay"
                                        aria-hidden="true"
                                    />
                                    <div>
                                        <p className="text-[13px] font-medium text-ink">
                                            {item.title}
                                        </p>
                                        <p className="mt-1 text-[12px] leading-relaxed text-muted">
                                            {item.copy}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section className="container-shop py-20 lg:py-28">
                    <div className="flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <h2 className="max-w-xl text-[clamp(2rem,4vw,3.4rem)] leading-[0.98] font-medium">
                                Six departments, one point of view.
                            </h2>
                        </div>
                        <Link
                            href={categoriesIndex.url()}
                            className="link-underline flex items-center gap-2 text-[13px] font-medium text-soft transition-colors hover:text-ink"
                        >
                            View all departments
                            <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                        {departments.length > 0 ? (
                            departments.map((category, index) => (
                                <DepartmentCard
                                    key={category.id}
                                    category={category}
                                    index={index}
                                    featured={index < 2}
                                />
                            ))
                        ) : (
                            <Link
                                href={productsIndex.url()}
                                className="group relative flex min-h-64 flex-col justify-end rounded-sm border border-line bg-raised p-6 sm:col-span-2 md:col-span-4"
                            >
                                <span className="font-display text-[34px] leading-none font-medium">
                                    The full collection
                                </span>
                                <span className="mt-2 text-sm text-soft">
                                    The first pieces are on their way.
                                </span>
                                <ArrowRight
                                    size={18}
                                    className="mt-6 text-clay transition-transform duration-300 group-hover:translate-x-1"
                                    aria-hidden="true"
                                />
                            </Link>
                        )}
                    </div>
                </section>
            </Reveal>

            {newArrivals.length > 0 && (
                <Reveal>
                    <section className="container-shop py-20 lg:py-28">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <h2 className="text-[clamp(2rem,4vw,3.4rem)] leading-[0.98] font-medium">
                                New this week.
                            </h2>
                            <Link
                                href={productsIndex.url({ query: { sort: 'latest' } })}
                                className="link-underline flex items-center gap-2 text-[13px] font-medium text-soft transition-colors hover:text-ink"
                            >
                                Shop all products
                                <ArrowRight size={14} aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
                            {newArrivals.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </section>
                </Reveal>
            )}

            {brands.length > 0 && (
                <Reveal>
                    <section className="border-y border-line bg-surface">
                        <div className="container-shop py-10 lg:py-12">
                            <h2 className="font-display text-[24px] leading-none font-medium">
                                The makers
                            </h2>
                            <div className="mt-6 flex flex-wrap items-center gap-x-10 gap-y-4">
                                {brands.map((brand) => (
                                    <Link
                                        key={brand.id}
                                        href={productsIndex.url({
                                            query: { brand: brand.slug },
                                        })}
                                        className="font-display text-[26px] leading-none font-medium text-soft transition-colors hover:text-clay"
                                    >
                                        {brand.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                </Reveal>
            )}

            <Reveal>
                <section className="border-y border-line bg-surface">
                    <div className="container-shop grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-20 lg:py-24">
                        <div className="order-2 lg:order-1">
                            <h2 className="text-[clamp(2.1rem,4vw,3.8rem)] leading-[0.98] font-medium">
                                Bought once. Kept for years.
                            </h2>
                            <p className="mt-6 max-w-[52ch] text-[15px] leading-relaxed text-soft">
                                SHOPIT began as a reaction to the endless feed: a
                                small store with a clear point of view. We stock what
                                we would use ourselves, and we stop when the edit is
                                complete.
                            </p>
                            <div className="mt-9">
                                <ButtonLink
                                    href={productsIndex.url()}
                                    variant="secondary"
                                    endIcon={<ArrowRight size={15} aria-hidden="true" />}
                                >
                                    Shop all products
                                </ButtonLink>
                            </div>
                        </div>
                        <div className="order-1 aspect-[5/4] overflow-hidden rounded-sm border border-line bg-raised lg:order-2">
                            <img
                                src={STORY_IMAGE}
                                alt="Neatly folded clothing in neutral tones"
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section className="container-shop py-20 lg:py-28">
                    <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
                        <div>
                            <p className="eyebrow">How we choose</p>
                            <h2 className="mt-4 text-[clamp(2.1rem,4vw,3.6rem)] leading-[0.98] font-medium">
                                Three rules, no exceptions.
                            </h2>
                        </div>
                        <div className="divide-y divide-line border-t border-line">
                            {PRINCIPLES.map((principle) => (
                                <div key={principle.title} className="py-6">
                                    <h3 className="font-sans text-[15px] font-medium tracking-normal text-ink">
                                        {principle.title}
                                    </h3>
                                    <p className="mt-2 max-w-[48ch] text-[14px] leading-relaxed text-soft">
                                        {principle.copy}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </Reveal>

            <Reveal>
                <section className="border-t border-line bg-ink text-canvas">
                    <div className="container-shop flex flex-col items-start justify-between gap-8 py-16 md:flex-row md:items-end lg:py-20">
                        <div>
                            <h2 className="max-w-xl font-display text-[clamp(2.2rem,4vw,3.8rem)] leading-[0.98] font-medium text-canvas">
                                Find the one thing you will use every day.
                            </h2>
                        </div>
                        <ButtonLink
                            href={productsIndex.url()}
                            size="lg"
                            className="bg-canvas text-ink hover:bg-clay hover:text-canvas"
                            endIcon={<ArrowRight size={16} aria-hidden="true" />}
                        >
                            Browse the collection
                        </ButtonLink>
                    </div>
                </section>
            </Reveal>
        </>
    );
}
