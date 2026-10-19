import { Link, router } from '@inertiajs/react';
import { Check, X } from '@phosphor-icons/react';

import ConfirmDelete from '@/components/admin/ConfirmDelete';
import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import RatingStars from '@/components/storefront/RatingStars';
import Badge from '@/components/ui/badge/Badge';
import EmptyState from '@/components/ui/table/EmptyState';
import Pagination from '@/components/ui/table/Pagination';
import { useAdminFilters } from '@/hooks/useAdminFilters';
import { formatDate } from '@/lib/utils';
import {
    destroy as adminReviewDestroy,
    index as adminReviewsIndex,
    update as adminReviewUpdate,
} from '@/routes/admin/reviews';
import { show as productShow } from '@/routes/products';
import type { AdminReview, Paginated } from '@/types';

interface ReviewFilters {
    status: string | null;
}

interface ReviewsIndexProps {
    reviews: Paginated<AdminReview>;
    filters: ReviewFilters;
}

export default function ReviewsIndex({ reviews, filters }: ReviewsIndexProps) {
    const { apply } = useAdminFilters(
        adminReviewsIndex.url(),
        filters as unknown as Record<string, unknown>,
        ['reviews', 'filters'],
    );

    const toggleApproval = (review: AdminReview) => {
        router.patch(
            adminReviewUpdate.url(review.id),
            { is_approved: !review.is_approved },
            { preserveScroll: true },
        );
    };

    return (
        <>
            <PageMeta
                title="Reviews"
                description="Moderate product reviews."
                noIndex
            />

            <PageHeader
                title="Reviews"
                description="Approve or reject the reviews customers leave after receiving a piece."
            />

            <div className="mt-6 flex flex-wrap items-center gap-2">
                <label htmlFor="review-status" className="sr-only">
                    Status
                </label>
                <select
                    id="review-status"
                    value={filters.status ?? ''}
                    onChange={(event) =>
                        apply({ status: event.target.value || null })
                    }
                    className="h-9 rounded-sm border border-line bg-surface px-2.5 text-[12px] text-ink focus:border-ink focus:outline-none"
                >
                    <option value="">All reviews</option>
                    <option value="pending">Awaiting moderation</option>
                    <option value="approved">Published</option>
                </select>
            </div>

            {reviews.data.length > 0 ? (
                <>
                    <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
                        <table className="min-w-full text-left text-[12px]">
                            <thead className="border-b border-line">
                                <tr>
                                    {[
                                        'Product',
                                        'Customer',
                                        'Rating',
                                        'Review',
                                        'Status',
                                        '',
                                    ].map((heading) => (
                                        <th
                                            key={heading || 'actions'}
                                            scope="col"
                                            className="px-4 py-3 text-[10px] font-medium tracking-[0.12em] whitespace-nowrap text-muted uppercase"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-line">
                                {reviews.data.map((review) => (
                                    <tr
                                        key={review.id}
                                        className="transition-colors hover:bg-raised/60"
                                    >
                                        <td className="max-w-[180px] px-4 py-3">
                                            {review.product ? (
                                                <Link
                                                    href={productShow.url(
                                                        review.product.slug,
                                                    )}
                                                    className="font-medium text-ink hover:text-clay"
                                                >
                                                    {review.product.name}
                                                </Link>
                                            ) : (
                                                <span className="text-muted">
                                                    Removed product
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="text-ink">
                                                {review.user?.name ??
                                                    'Deleted customer'}
                                            </p>
                                            <p className="text-[10px] text-muted">
                                                {review.user?.email}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <RatingStars
                                                rating={review.rating}
                                                size={12}
                                            />
                                        </td>
                                        <td className="max-w-[320px] px-4 py-3">
                                            {review.title && (
                                                <p className="truncate font-medium text-ink">
                                                    {review.title}
                                                </p>
                                            )}
                                            <p className="line-clamp-2 text-[11px] leading-relaxed text-soft">
                                                {review.body}
                                            </p>
                                            <p className="mt-1 text-[10px] text-muted">
                                                {formatDate(review.created_at)}
                                            </p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge
                                                tone={
                                                    review.is_approved
                                                        ? 'success'
                                                        : 'warning'
                                                }
                                            >
                                                {review.is_approved
                                                    ? 'Published'
                                                    : 'Pending'}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        toggleApproval(review)
                                                    }
                                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-clay hover:text-ink"
                                                >
                                                    {review.is_approved ? (
                                                        <>
                                                            <X
                                                                size={12}
                                                                aria-hidden="true"
                                                            />
                                                            Reject
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Check
                                                                size={12}
                                                                aria-hidden="true"
                                                            />
                                                            Approve
                                                        </>
                                                    )}
                                                </button>
                                                <ConfirmDelete
                                                    url={adminReviewDestroy.url(
                                                        review.id,
                                                    )}
                                                    description="Delete review?"
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <Pagination
                        currentPage={reviews.current_page}
                        lastPage={reviews.last_page}
                        total={reviews.total}
                        from={reviews.from}
                        to={reviews.to}
                        onPageChange={(page) => apply({ page })}
                    />
                </>
            ) : (
                <EmptyState
                    className="mt-6"
                    title="No reviews match"
                    description="Reviews will appear here as customers submit them."
                />
            )}
        </>
    );
}
