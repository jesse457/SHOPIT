import { Link, usePage } from '@inertiajs/react';

import ProductImage from '@/components/storefront/ProductImage';
import { formatCurrency, formatDate } from '@/lib/utils';
import { show as productShow } from '@/routes/products';
import type { Order, PageProps } from '@/types';

export default function OrderReceipt({ order }: { order: Order }) {
    const { shop } = usePage<PageProps>().props;
    const money = (value: string) =>
        formatCurrency(value, shop.currency, shop.currency_locale);
    const subtotal = order.items.reduce(
        (total, item) => total + Number.parseFloat(item.total_amount),
        0,
    );

    return (
        <div className="rounded-sm border border-line bg-surface">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4 sm:px-6">
                <div>
                    <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                        Order
                    </p>
                    <p className="mt-1 font-display text-[25px] leading-none font-medium">
                        {order.number}
                    </p>
                </div>
                <div className="text-right text-[12px] text-soft">
                    <p>{formatDate(order.created_at)}</p>
                    <p className="mt-0.5 text-muted">
                        {order.payment_method_label}
                    </p>
                </div>
            </div>

            <div className="divide-y divide-line px-5 sm:px-6">
                {order.items.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4">
                        <div className="h-20 w-16 shrink-0 overflow-hidden rounded-sm border border-line bg-raised">
                            <ProductImage
                                src={item.product_image_url}
                                alt={item.product_name}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            {item.product_slug ? (
                                <Link
                                    href={productShow.url(item.product_slug)}
                                    className="font-display text-[19px] leading-tight font-medium hover:text-clay"
                                >
                                    {item.product_name}
                                </Link>
                            ) : (
                                <p className="font-display text-[19px] leading-tight font-medium">
                                    {item.product_name}
                                </p>
                            )}
                            <p className="tabular mt-1 text-[11px] text-muted">
                                {item.quantity} x {money(item.unit_amount)}
                            </p>
                        </div>
                        <p className="tabular shrink-0 text-[13px] font-medium text-ink">
                            {money(item.total_amount)}
                        </p>
                    </div>
                ))}
            </div>

            <div className="border-t border-line px-5 py-4 sm:px-6">
                <dl className="space-y-2 text-[13px]">
                    <div className="flex items-center justify-between gap-4">
                        <dt className="text-soft">Subtotal</dt>
                        <dd className="tabular text-ink">
                            {money(String(subtotal))}
                        </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                        <dt className="text-soft">Delivery</dt>
                        <dd className="tabular text-ink">
                            {Number.parseFloat(order.shipping_amount) === 0
                                ? 'Free'
                                : money(order.shipping_amount)}
                        </dd>
                    </div>
                    {Number.parseFloat(order.discount_amount) > 0 && (
                        <div className="flex items-center justify-between gap-4">
                            <dt className="text-soft">
                                Discount
                                {order.coupon_code
                                    ? ` (${order.coupon_code})`
                                    : ''}
                            </dt>
                            <dd className="tabular text-success">
                                - {money(order.discount_amount)}
                            </dd>
                        </div>
                    )}
                    <div className="flex items-baseline justify-between gap-4 border-t border-line pt-3">
                        <dt className="font-display text-[21px] font-medium">
                            Total
                        </dt>
                        <dd className="tabular text-[15px] font-medium text-ink">
                            {money(order.grand_total)}
                        </dd>
                    </div>
                </dl>
            </div>

            {order.address && (
                <div className="border-t border-line px-5 py-4 sm:px-6">
                    <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">
                        Delivery address
                    </p>
                    <p className="mt-2 text-[13px] leading-relaxed text-soft">
                        {order.address.full_name}
                        <br />
                        {order.address.street_address}
                        <br />
                        {order.address.city}, {order.address.state}{' '}
                        {order.address.zip_code}
                        <br />
                        {order.address.phone}
                    </p>
                </div>
            )}
        </div>
    );
}
