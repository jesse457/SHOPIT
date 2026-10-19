import { router } from '@inertiajs/react';
import { ArrowRight, Heart, Trash } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import ProductCard from '@/components/storefront/ProductCard';
import { ButtonLink } from '@/components/ui/button/Button';
import EmptyState from '@/components/ui/table/EmptyState';
import { index as productsIndex } from '@/routes/products';
import { destroy as wishlistDestroy } from '@/routes/wishlist';
import type { Product } from '@/types';

export default function Wishlist({ products }: { products: Product[] }) {
    return (
        <>
            <PageMeta
                title="Your wishlist"
                description="Pieces you have saved for later."
                noIndex
            />

            <section className="container-shop py-10 lg:py-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                            Your wishlist
                        </h1>
                        <p className="tabular mt-3 text-[13px] text-muted">
                            {products.length}{' '}
                            {products.length === 1 ? 'piece' : 'pieces'}
                        </p>
                    </div>
                    <ButtonLink
                        href={productsIndex.url()}
                        variant="secondary"
                        size="sm"
                        endIcon={<ArrowRight size={13} aria-hidden="true" />}
                    >
                        Continue shopping
                    </ButtonLink>
                </div>

                {products.length > 0 ? (
                    <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
                        {products.map((product) => (
                            <div key={product.id}>
                                <ProductCard product={product} />
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.delete(
                                            wishlistDestroy.url(product.slug),
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="mt-3 flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-danger"
                                >
                                    <Trash size={12} aria-hidden="true" />
                                    Remove from wishlist
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <EmptyState
                        className="mt-10"
                        icon={<Heart size={28} weight="regular" />}
                        title="Your wishlist is empty"
                        description="Save the pieces you want to come back to. They will wait here."
                        action={
                            <ButtonLink
                                href={productsIndex.url()}
                                size="sm"
                                endIcon={
                                    <ArrowRight size={14} aria-hidden="true" />
                                }
                            >
                                Browse the edit
                            </ButtonLink>
                        }
                    />
                )}
            </section>
        </>
    );
}
