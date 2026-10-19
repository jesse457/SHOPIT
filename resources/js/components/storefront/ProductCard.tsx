import { Link } from '@inertiajs/react';
import { Star } from '@phosphor-icons/react';

import ProductImage from '@/components/storefront/ProductImage';
import Badge from '@/components/ui/badge/Badge';
import { formatCurrency } from '@/lib/utils';
import { show as productShow } from '@/routes/products';
import type { Product } from '@/types';

export default function ProductCard({ product }: { product: Product }) {
    const hasComparePrice =
        product.compare_at_price !== null &&
        Number.parseFloat(product.compare_at_price) >
            Number.parseFloat(product.price);

    return (
        <Link
            href={productShow.url(product.slug)}
            className="group block"
            aria-label={`View ${product.name}`}
        >
            <div className="relative aspect-[4/5] overflow-hidden rounded-sm border border-line bg-raised">
                <ProductImage
                    src={product.image_url}
                    alt={product.name}
                    className="transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                {!product.in_stock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-canvas/55">
                        <span className="rounded-sm bg-ink px-3 py-1.5 text-[10px] font-medium tracking-[0.14em] text-canvas uppercase">
                            Sold out
                        </span>
                    </div>
                )}
            </div>

            <div className="mt-3.5">
                <div className="flex items-center justify-between gap-3">
                    <p className="truncate text-[11px] font-medium tracking-[0.1em] text-muted uppercase">
                        {product.brand?.name ??
                            product.category?.name ??
                            'SHOPIT'}
                    </p>
                    <div className="flex shrink-0 items-center gap-1.5">
                        {product.on_sale && hasComparePrice && (
                            <Badge tone="clay">Sale</Badge>
                        )}
                        {product.in_stock && product.is_low_stock && (
                            <span className="tabular text-[10px] font-medium tracking-[0.08em] text-sun">
                                {product.stock_quantity} left
                            </span>
                        )}
                    </div>
                </div>

                <h3 className="mt-1.5 font-display text-[22px] leading-[1.1] font-medium tracking-[-0.01em] text-ink transition-colors duration-200 group-hover:text-clay">
                    {product.name}
                </h3>

                <div className="mt-1.5 flex flex-wrap items-baseline gap-2">
                    <span className="tabular text-[13px] font-medium text-ink">
                        {formatCurrency(product.price)}
                    </span>
                    {hasComparePrice && (
                        <span className="tabular text-[12px] text-muted line-through">
                            {formatCurrency(product.compare_at_price)}
                        </span>
                    )}
                    {(product.reviews_count ?? 0) > 0 && (
                        <span className="ml-auto flex items-center gap-1 text-[11px] text-muted">
                            <Star
                                size={11}
                                weight="fill"
                                className="text-sun"
                                aria-hidden="true"
                            />
                            {product.rating_average?.toFixed(1)}
                            <span>({product.reviews_count})</span>
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}
