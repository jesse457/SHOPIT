import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import type { ReactNode } from 'react';

import { ThemeProvider } from './context/ThemeContext';
import AdminLayout from './layouts/AdminLayout';
import AuthLayout from './layouts/AuthLayout';
import StorefrontLayout from './layouts/StorefrontLayout';

const appName = import.meta.env.VITE_APP_NAME || 'SHOPIT';

type LayoutFn = (page: ReactNode) => ReactNode;

const withStorefront: LayoutFn = (page) => <StorefrontLayout>{page}</StorefrontLayout>;
const withAdmin: LayoutFn = (page) => <AdminLayout>{page}</AdminLayout>;
const withAuth: LayoutFn = (page) => <AuthLayout>{page}</AuthLayout>;

function layoutFor(name: string): LayoutFn {
    if (name.startsWith('Admin/')) {
        return withAdmin;
    }

    if (name.startsWith('Auth/')) {
        return withAuth;
    }

    return withStorefront;
}

type PageModule = {
    default: React.ComponentType & { layout?: LayoutFn };
};

const pages = import.meta.glob<PageModule>('./pages/**/*.tsx');

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const loader = pages[`./pages/${name}.tsx`];

        if (!loader) {
            throw new Error(`Inertia page not found: ${name}`);
        }

        const module = await loader();
        const page = module.default;
        page.layout = layoutFor(name);

        return page;
    },
    setup({ el, App, props }) {
        createRoot(el).render(
            <ThemeProvider>
                <App {...props} />
            </ThemeProvider>,
        );
    },
    progress: {
        color: '#9c451f',
    },
});
