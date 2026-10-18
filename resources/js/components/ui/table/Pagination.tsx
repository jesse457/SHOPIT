import { CaretLeft, CaretRight } from '@phosphor-icons/react';

import { cn } from '@/lib/utils';

interface PaginationProps {
    currentPage: number;
    lastPage: number;
    total: number;
    from: number | null;
    to: number | null;
    onPageChange: (page: number) => void;
    className?: string;
}

function pageNumbers(current: number, last: number): Array<number | 'ellipsis'> {
    const visible = new Set(
        [1, last, current - 1, current, current + 1].filter(
            (page) => page >= 1 && page <= last,
        ),
    );

    const sorted = Array.from(visible).sort((a, b) => a - b);
    const result: Array<number | 'ellipsis'> = [];
    let previous = 0;

    for (const page of sorted) {
        if (previous > 0 && page - previous > 1) {
            result.push('ellipsis');
        }

        result.push(page);
        previous = page;
    }

    return result;
}

export default function Pagination({
    currentPage,
    lastPage,
    total,
    from,
    to,
    onPageChange,
    className,
}: PaginationProps) {
    if (lastPage <= 1) {
        return null;
    }

    const pages = pageNumbers(currentPage, lastPage);
    const buttonBase =
        'flex h-9 min-w-9 items-center justify-center rounded-sm border px-2 text-[12px] font-medium tabular transition-colors disabled:pointer-events-none disabled:opacity-40';

    return (
        <nav
            aria-label="Pagination"
            className={cn(
                'mt-12 flex flex-col gap-4 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between',
                className,
            )}
        >
            <p className="text-[12px] text-muted tabular">
                {from !== null && to !== null
                    ? `Showing ${from}-${to} of ${total}`
                    : `${total} items`}
            </p>

            <div className="flex items-center gap-1.5">
                <button
                    type="button"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage <= 1}
                    aria-label="Previous page"
                    className={cn(
                        buttonBase,
                        'border-line text-soft hover:border-ink hover:text-ink',
                    )}
                >
                    <CaretLeft size={14} aria-hidden="true" />
                </button>

                {pages.map((page, index) =>
                    page === 'ellipsis' ? (
                        <span
                            key={`ellipsis-${index}`}
                            className="px-1 text-[12px] text-muted"
                            aria-hidden="true"
                        >
                            ...
                        </span>
                    ) : (
                        <button
                            key={page}
                            type="button"
                            onClick={() => onPageChange(page)}
                            aria-label={`Page ${page}`}
                            aria-current={page === currentPage ? 'page' : undefined}
                            className={cn(
                                buttonBase,
                                page === currentPage
                                    ? 'border-ink bg-ink text-canvas'
                                    : 'border-line text-soft hover:border-ink hover:text-ink',
                            )}
                        >
                            {page}
                        </button>
                    ),
                )}

                <button
                    type="button"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage >= lastPage}
                    aria-label="Next page"
                    className={cn(
                        buttonBase,
                        'border-line text-soft hover:border-ink hover:text-ink',
                    )}
                >
                    <CaretRight size={14} aria-hidden="true" />
                </button>
            </div>
        </nav>
    );
}
