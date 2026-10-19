import { Link, useForm, usePage } from '@inertiajs/react';
import {
    CaretLeft,
    CaretRight,
    CreditCard,
    Minus,
    Plus,
    Truck,
} from '@phosphor-icons/react';
import { useState } from 'react';
import type { FormEvent } from 'react';

import PageMeta from '@/components/common/PageMeta';
import ProductCard from '@/components/storefront/ProductCard';
import ProductImage from '@/components/storefront/ProductImage';
import Badge from '@/components/ui/badge/Badge';
import { Button } from '@/components/ui/button/Button';
import { formatCurrency } from '@/lib/utils';
import { home } from '@/routes';
import { store as cartStore } from '@/routes/cart/items';
import { show as categoryShow } from '@/routes/categories';
import { index as productsIndex } from '@/routes/products';
import type { PageProps, Product } from '@/types';

interface ProductDetailProps {
    product: Product;
    related: Product[];
}

export default function ProductDetail(props: ProductDetailProps) {
    return <ProductDetailContent key={props.product.id} {...props} />;
}

function ProductDetailContent({ product, related }: ProductDetailProps) {
    const { shop } = usePage<PageProps>().props;
    const firstImage = product.images[0] ?? null;
    const [activeImage, setActiveImage] = useState<string | null>(firstImage);
    const { data, setData, post, processing, errors } = useForm({
        product_id: product.id,
        quantity: 1,
    });

    const maxQuantity = Math.max(1, product.stock_quantity);
    const hasComparePrice =
        product.compare_at_price !== null &&
        Number.parseFloat(product.compare_at_price) >
            Number.parseFloat(product.price);

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(cartStore.url(), { preserveScroll: true });
    };

    const decrease = () => {
        setData('quantity', Math.max(1, data.quantity - 1));
    };

    const increase = () => {
        setData('quantity', Math.min(maxQuantity, data.quantity + 1));
    };

    return (
        <>
            <PageMeta
                title={product.name}
                description={
                    product.description ??
                    `Shop ${product.name} from the SHOPIT edit.`
                }
                image={product.image_url ?? undefined}
            />

            <div className="container-shop pt-6">
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center gap-1.5 text-[11px] text-muted"
                >
                    <Link href={home.url()} className="hover:text-ink">
                        Home
                    </Link>
                    <span aria-hidden="true">/</span>
                    {product.category ? (
                        <>
                            <Link
                                href={categoryShow.url(product.category.slug)}
                                className="hover:text-ink"
                            >
                                {product.category.name}
                            </Link>
                            <span aria-hidden="true">/</span>
                        </>
                    ) : (
                        <>
                            <Link
                                href={productsIndex.url()}
                                className="hover:text-ink"
                            >
                                Shop
                            </Link>
                            <span aria-hidden="true">/</span>
                        </>
                    )}
                    <span className="truncate text-soft">{product.name}</span>
                </nav>
            </div>

            <section className="container-shop grid gap-10 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:py-14">
                <div>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-raised">
                        <ProductImage
                            src={activeImage}
                            alt={product.name}
                            priority
                        />
                    </div>

                    {product.images.length > 1 && (
                        <div className="mt-3 grid grid-cols-5 gap-2">
                            {product.images.map((image, index) => (
                                <button
                                    key={`${image}-${index}`}
                                    type="button"
                                    onClick={() => setActiveImage(image)}
                                    aria-label={`View image ${index + 1} of ${product.name}`}
                                    aria-pressed={activeImage === image}
                                    className={`aspect-square overflow-hidden rounded-sm border bg-raised transition-colors ${
                                        activeImage === image
                                            ? 'border-ink'
                                            : 'border-line hover:border-soft'
                                    }`}
                                >
                                    <ProductImage src={image} alt="" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="lg:sticky lg:top-24 lg:self-start">
                    <div className="flex items-center gap-2">
                        {product.brand && (
                            <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                                {product.brand.name}
                            </p>
                        )}
                        {product.on_sale && hasComparePrice && (
                            <Badge tone="clay">Sale</Badge>
                        )}
                    </div>

                    <h1 className="mt-3 text-[clamp(2.4rem,4.5vw,4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                        {product.name}
                    </h1>

                    <div className="mt-5 flex items-baseline gap-3">
                        <span className="tabular text-[22px] font-medium text-ink">
                            {formatCurrency(product.price)}
                        </span>
                        {hasComparePrice && (
                            <span className="tabular text-[15px] text-muted line-through">
                                {formatCurrency(product.compare_at_price)}
                            </span>
                        )}
                    </div>

                    {product.description && (
                        <p className="mt-5 max-w-[52ch] text-[14px] leading-relaxed text-soft">
                            {product.description}
                        </p>
                    )}

                    <div className="mt-6 flex items-center gap-2 text-[12px]">
                        {!product.in_stock ? (
                            <span className="font-medium text-danger">
                                Sold out
                            </span>
                        ) : product.is_low_stock ? (
                            <span className="font-medium text-sun">
                                Only {product.stock_quantity} left
                            </span>
                        ) : (
                            <span className="font-medium text-success">
                                In stock
                            </span>
                        )}
                        <span className="text-muted" aria-hidden="true">
                            /
                        </span>
                        <span className="text-muted">Tracked delivery</span>
                    </div>

                    {product.in_stock && (
                        <form onSubmit={submit} className="mt-7">
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex h-11 items-center rounded-sm border border-line">
                                    <button
                                        type="button"
                                        onClick={decrease}
                                        disabled={data.quantity <= 1}
                                        aria-label="Decrease quantity"
                                        className="flex h-full w-10 items-center justify-center text-soft transition-colors hover:text-ink disabled:opacity-40"
                                    >
                                        <Minus size={13} aria-hidden="true" />
                                    </button>
                                    <span
                                        className="tabular w-9 text-center text-[13px] font-medium text-ink"
                                        aria-live="polite"
                                    >
                                        {data.quantity}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={increase}
                                        disabled={data.quantity >= maxQuantity}
                                        aria-label="Increase quantity"
                                        className="flex h-full w-10 items-center justify-center text-soft transition-colors hover:text-ink disabled:opacity-40"
                                    >
                                        <Plus size={13} aria-hidden="true" />
                                    </button>
                                </div>

                                <Button
                                    type="submit"
                                    size="lg"
                                    loading={processing}
                                    disabled={!product.in_stock}
                                    className="flex-1 sm:flex-none"
                                >
                                    Add to cart
                                </Button>
                            </div>

                            {errors.quantity && (
                                <p className="mt-2 text-[12px] text-danger">
                                    {errors.quantity}
                                </p>
                            )}
                            {errors.product_id && (
                                <p className="mt-2 text-[12px] text-danger">
                                    {errors.product_id}
                                </p>
                            )}
                        </form>
                    )}

                    <div className="mt-7 space-y-3 border-t border-line pt-5 text-[12px] text-soft">
                        <p className="flex items-start gap-2.5">
                            <Truck
                                size={16}
                                className="mt-0.5 shrink-0 text-clay"
                                aria-hidden="true"
                            />
                            Complimentary delivery over{' '}
                            {formatCurrency(
                                shop.shipping.free_threshold,
                                shop.currency,
                                shop.currency_locale,
                            )}
                            . Flat rate below that.
                        </p>
                        <p className="flex items-start gap-2.5">
                            <CreditCard
                                size={16}
                                className="mt-0.5 shrink-0 text-clay"
                                aria-hidden="true"
                            />
                            Secure card checkout or cash on delivery.
                        </p>
                    </div>

                    <div className="mt-7 divide-y divide-line border-t border-line">
                        <details className="group py-4" open>
                            <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-medium text-ink">
                                Details
                                <CaretRight
                                    size={13}
                                    className="text-muted transition-transform group-open:rotate-90"
                                    aria-hidden="true"
                                />
                            </summary>
                            <p className="mt-3 text-[13px] leading-relaxed whitespace-pre-line text-soft">
                                {product.description ??
                                    'A considered piece from the SHOPIT edit.'}
                            </p>
                        </details>

                        <details className="group py-4">
                            <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-medium text-ink">
                                Delivery and payment
                                <CaretRight
                                    size={13}
                                    className="text-muted transition-transform group-open:rotate-90"
                                    aria-hidden="true"
                                />
                            </summary>
                            <p className="mt-3 text-[13px] leading-relaxed text-soft">
                                Orders are prepared within one business day.
                                Delivery is complimentary over{' '}
                                {formatCurrency(
                                    shop.shipping.free_threshold,
                                    shop.currency,
                                    shop.currency_locale,
                                )}
                                , otherwise a flat{' '}
                                {formatCurrency(
                                    shop.shipping.flat_rate,
                                    shop.currency,
                                    shop.currency_locale,
                                )}{' '}
                                applies. Card payments are processed by Stripe.
                                Cash on delivery is also available.
                            </p>
                        </details>

                        <details className="group py-4">
                            <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-medium text-ink">
                                Stock
                                <CaretRight
                                    size={13}
                                    className="text-muted transition-transform group-open:rotate-90"
                                    aria-hidden="true"
                                />
                            </summary>
                            <p className="mt-3 text-[13px] leading-relaxed text-soft">
                                Inventory is live and checked again at checkout.
                                {product.stock_quantity > 0
                                    ? ` ${product.stock_quantity} available today.`
                                    : ' This piece is currently sold out.'}
                            </p>
                        </details>
                    </div>
                </div>
            </section>

            {related.length > 0 && (
                <section className="container-shop border-t border-line py-16 lg:py-20">
                    <div className="flex items-end justify-between gap-4">
                        <h2 className="text-[clamp(1.9rem,3.5vw,3rem)] leading-[0.98] font-medium">
                            More from {product.category?.name ?? 'the edit'}
                        </h2>
                        {product.category && (
                            <Link
                                href={categoryShow.url(product.category.slug)}
                                className="link-underline flex items-center gap-1.5 text-[12px] font-medium text-soft hover:text-ink"
                            >
                                View department
                                <CaretRight size={12} aria-hidden="true" />
                            </Link>
                        )}
                    </div>

                    <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 lg:grid-cols-4">
                        {related.map((item) => (
                            <ProductCard key={item.id} product={item} />
                        ))}
                    </div>
                </section>
            )}

            <div className="container-shop pb-16">
                <Link
                    href={productsIndex.url()}
                    className="link-underline inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                >
                    <CaretLeft size={13} aria-hidden="true" />
                    Back to the collection
                </Link>
            </div>
        </>
    );
}
