import { Link } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';

import PageMeta from '@/components/common/PageMeta';
import { ButtonLink } from '@/components/ui/button/Button';

export default function Forbidden() {
    return (
        <>
            <PageMeta
                title="Access denied"
                description="You do not have permission to view this page."
                noIndex
            />

            <section className="container-shop flex min-h-[70dvh] flex-col justify-center py-20">
                <p className="font-display text-[clamp(7rem,20vw,15rem)] leading-[0.8] font-medium text-clay">
                    403
                </p>
                <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
                    <h1 className="max-w-2xl text-[clamp(2.2rem,5vw,4.4rem)] leading-[0.96] font-medium">
                        That door is locked.
                    </h1>
                    <div>
                        <p className="max-w-[44ch] text-[15px] leading-relaxed text-soft">
                            This area belongs to store staff. If you think you should
                            have access, sign in with the right account.
                        </p>
                        <div className="mt-6 flex flex-wrap gap-3">
                            <ButtonLink
                                href="/"
                                endIcon={<ArrowRight size={15} aria-hidden="true" />}
                            >
                                Back to the store
                            </ButtonLink>
                            <Link
                                href="/account"
                                className="flex h-11 items-center gap-2 px-1 text-[13px] font-medium text-soft transition-colors hover:text-ink"
                            >
                                <ArrowLeft size={14} aria-hidden="true" />
                                Your account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
