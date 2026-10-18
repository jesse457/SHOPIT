import { ArrowRight, ArrowsClockwise } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import { Button, ButtonLink } from '@/components/ui/button/Button';

export default function ServerError() {
    return (
        <>
            <PageMeta
                title="Something went wrong"
                description="The store hit an unexpected error."
                noIndex
            />

            <section className="container-shop flex min-h-[70dvh] flex-col justify-center py-20">
                <p className="font-display text-[clamp(7rem,20vw,15rem)] leading-[0.8] font-medium text-clay">
                    500
                </p>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <h1 className="max-w-2xl text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.96] font-medium">
                        Something gave way.
                    </h1>
                    <div>
                        <p className="max-w-[44ch] text-[15px] leading-relaxed text-soft">
                            The store hit an unexpected error. Nothing in your cart was
                            lost. Try the page again, or head back to the collection.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                                type="button"
                                onClick={() => window.location.reload()}
                                startIcon={<ArrowsClockwise size={15} aria-hidden="true" />}
                            >
                                Try again
                            </Button>
                            <ButtonLink
                                href="/products"
                                variant="secondary"
                                endIcon={<ArrowRight size={15} aria-hidden="true" />}
                            >
                                Shop the edit
                            </ButtonLink>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
