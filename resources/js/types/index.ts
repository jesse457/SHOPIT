export type Theme = 'light' | 'dark';

export type ToastType = 'success' | 'info' | 'error';

export interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
}

export interface NavCategory {
    id: number;
    name: string;
    slug: string;
}

export interface ShopConfig {
    currency: string;
    currency_locale: string;
    shipping: {
        free_threshold: number;
        flat_rate: number;
    };
    orders: {
        stripe_hold_minutes: number;
    };
    products: {
        page_size: number;
        low_stock_threshold: number;
    };
}

export interface Paginated<T> {
    data: T[];
    meta?: {
        current_page: number;
        from: number | null;
        last_page: number;
        per_page: number;
        to: number | null;
        total: number;
    };
}

export type CatalogSort = 'latest' | 'price_asc' | 'price_desc' | 'name_asc';

export interface CatalogFilters {
    q: string;
    categories: string[];
    brands: string[];
    featured: boolean;
    on_sale: boolean;
    min_price: number | null;
    max_price: number | null;
    sort: CatalogSort;
}

export interface PriceBounds {
    min: number;
    max: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    image_url: string | null;
    is_active: boolean;
    products_count?: number;
}

export interface Brand {
    id: number;
    name: string;
    slug: string;
    image: string | null;
    image_url: string | null;
    is_active: boolean;
    products_count?: number;
}

export interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    price: string;
    compare_at_price: string | null;
    images: string[];
    image_url: string | null;
    category: Pick<Category, 'id' | 'name' | 'slug'> | null;
    brand: Pick<Brand, 'id' | 'name' | 'slug'> | null;
    is_active: boolean;
    is_featured: boolean;
    in_stock: boolean;
    on_sale: boolean;
    stock_quantity: number;
    low_stock_threshold: number;
    is_low_stock: boolean;
    created_at: string;
}

export interface CartLine {
    product_id: number;
    name: string;
    slug: string;
    image_url: string | null;
    quantity: number;
    unit_amount: string;
    total_amount: string;
    stock_quantity: number;
}

export interface CartSummary {
    items: CartLine[];
    count: number;
    subtotal: string;
    shipping: string;
    grand_total: string;
    free_shipping_threshold: string;
    remaining_for_free_shipping: string;
    qualifies_for_free_shipping: boolean;
}

export interface Address {
    first_name: string;
    last_name: string;
    phone: string;
    street_address: string;
    city: string;
    state: string;
    zip_code: string;
}

export interface OrderItem {
    id: number;
    product_id: number | null;
    product_name: string;
    product_image_url: string | null;
    quantity: number;
    unit_amount: string;
    total_amount: string;
    product_slug: string | null;
}

export interface Order {
    id: number;
    number: string;
    status: string;
    status_label: string;
    payment_status: string;
    payment_status_label: string;
    payment_method: string;
    payment_method_label: string;
    grand_total: string;
    shipping_amount: string;
    currency: string;
    notes: string | null;
    created_at: string;
    paid_at: string | null;
    items: OrderItem[];
    address: (Address & { full_name: string }) | null;
    user?: {
        id: number;
        name: string;
        email: string;
    };
}

export interface ToastMessage {
    type: ToastType;
    message: string;
}

export interface FlashProps {
    success: string | null;
    error: string | null;
}

export interface PageProps {
    name: string;
    shop: ShopConfig;
    auth: {
        user: User | null;
    };
    cart: {
        count: number;
    };
    navCategories: NavCategory[];
    toast: ToastMessage | null;
    status: string | null;
    flash: FlashProps;
    [key: string]: unknown;
}
