import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import { ButtonLink } from '@/components/ui/button/Button';
import { home } from '@/routes';
import { index as productsIndex } from '@/routes/products';

export default function NotFound() {
    return (
        <>
            <PageMeta
                title="Page not found"
                description="The page you were looking for is no longer here."
                noIndex
            />

            <section className="container-shop flex min-h-[70dvh] flex-col justify-center py-20">
                <p className="font-display text-[clamp(7rem,20vw,15rem)] leading-[0.8] font-medium text-clay">
                    404
                </p>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <h1 className="max-w-2xl text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.96] font-medium">
                        This page has moved on.
                    </h1>
                    <div>
                        <p className="max-w-[44ch] text-[15px] leading-relaxed text-soft">
                            The link may be old, or the piece may have sold out
                            and left the edit. Everything current is one click
                            away.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <ButtonLink
                                href={productsIndex.url()}
                                endIcon={
                                    <ArrowRight size={15} aria-hidden="true" />
                                }
                            >
                                Shop the edit
                            </ButtonLink>
                            <Link
                                href={home.url()}
                                className="flex h-11 items-center gap-2 px-1 text-[13px] font-medium text-soft transition-colors hover:text-ink"
                            >
                                <ArrowLeft size={14} aria-hidden="true" />
                                Back home
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
