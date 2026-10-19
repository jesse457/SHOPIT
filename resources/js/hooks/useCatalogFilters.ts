import { router } from '@inertiajs/react';

import { index as productsIndex } from '@/routes/products';
import type { CatalogFilters } from '@/types';

interface ApplyOptions {
    page?: number;
}

export function useCatalogFilters(filters: CatalogFilters) {
    const apply = (
        patch: Partial<CatalogFilters>,
        options: ApplyOptions = {},
    ) => {
        const next = { ...filters, ...patch };
        const query: Record<string, string | number> = {};

        if (next.q.trim() !== '') {
            query.q = next.q.trim();
        }

        if (next.categories.length > 0) {
            query.category = next.categories.join(',');
        }

        if (next.brands.length > 0) {
            query.brand = next.brands.join(',');
        }

        if (next.featured) {
            query.featured = 1;
        }

        if (next.on_sale) {
            query.on_sale = 1;
        }

        if (next.min_price !== null) {
            query.min_price = next.min_price;
        }

        if (next.max_price !== null) {
            query.max_price = next.max_price;
        }

        if (next.sort !== 'latest') {
            query.sort = next.sort;
        }

        if (options.page !== undefined && options.page > 1) {
            query.page = options.page;
        }

        router.get(productsIndex.url(), query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only: ['products', 'filters'],
        });
    };

    return { apply };
}
