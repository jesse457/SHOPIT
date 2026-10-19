import { router } from '@inertiajs/react';

export function useAdminFilters(
    baseUrl: string,
    filters: Record<string, unknown>,
    only: string[],
) {
    const apply = (patch: Record<string, unknown>) => {
        const next = { ...filters, ...patch };
        const query: Record<string, string | number | boolean> = {};

        Object.entries(next).forEach(([key, value]) => {
            if (
                value === null ||
                value === undefined ||
                value === '' ||
                value === false
            ) {
                return;
            }

            query[key] = value as string | number | boolean;
        });

        router.get(baseUrl, query, {
            preserveState: true,
            preserveScroll: true,
            replace: true,
            only,
        });
    };

    return { apply };
}
