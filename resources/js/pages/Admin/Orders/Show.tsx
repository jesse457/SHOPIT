import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Label from '@/components/form/Label';
import Textarea from '@/components/form/Textarea';
import OrderReceipt from '@/components/storefront/OrderReceipt';
import Badge from '@/components/ui/badge/Badge';
import { Button } from '@/components/ui/button/Button';
import { formatDate, orderStatusTone, paymentStatusTone } from '@/lib/utils';
import { edit as adminCustomerEdit } from '@/routes/admin/customers';
import {
    index as adminOrdersIndex,
    update as adminOrderUpdate,
} from '@/routes/admin/orders';
import type { AdminOrder } from '@/types';

interface StatusOption {
    value: string;
    label: string;
}

interface OrderShowProps {
    order: AdminOrder;
    statuses: StatusOption[];
    paymentStatuses: StatusOption[];
}

export default function OrderShow({
    order,
    statuses,
    paymentStatuses,
}: OrderShowProps) {
    const { data, setData, patch, processing, errors } = useForm({
        status: order.status,
        payment_status: order.payment_status,
        notes: order.notes ?? '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        patch(adminOrderUpdate.url(order.id), { preserveScroll: true });
    };

    const selectClass =
        'h-11 w-full rounded-sm border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none';

    return (
        <>
            <PageMeta
                title={`Order ${order.number}`}
                description={`Manage order ${order.number}.`}
                noIndex
            />

            <Link
                href={adminOrdersIndex.url()}
                className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
            >
                <ArrowLeft size={13} aria-hidden="true" />
                All orders
            </Link>

            <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
                <PageHeader
                    title={order.number}
                    description={`Placed ${formatDate(order.created_at)}`}
                />
                <div className="flex flex-wrap items-center gap-2">
                    <Badge tone={orderStatusTone(order.status)}>
                        {order.status_label}
                    </Badge>
                    <Badge tone={paymentStatusTone(order.payment_status)}>
                        {order.payment_status_label}
                    </Badge>
                </div>
            </div>

            <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_340px] lg:items-start">
                <OrderReceipt order={order} />

                <aside className="space-y-4 lg:sticky lg:top-24">
                    <section className="rounded-sm border border-line bg-surface p-5">
                        <h2 className="font-display text-[23px] leading-none font-medium">
                            Customer
                        </h2>

                        {order.user ? (
                            <div className="mt-3">
                                <p className="text-[13px] font-medium text-ink">
                                    {order.user.name}
                                </p>
                                <p className="mt-0.5 text-[11px] text-muted">
                                    {order.user.email}
                                </p>
                                <Link
                                    href={adminCustomerEdit.url(order.user.id)}
                                    className="mt-3 inline-flex text-[11px] font-medium text-clay hover:text-ink"
                                >
                                    Edit customer
                                </Link>
                            </div>
                        ) : (
                            <p className="mt-3 text-[12px] text-muted">
                                This order has no customer record.
                            </p>
                        )}
                    </section>

                    <form
                        onSubmit={submit}
                        className="rounded-sm border border-line bg-surface p-5"
                    >
                        <h2 className="font-display text-[23px] leading-none font-medium">
                            Fulfillment
                        </h2>

                        <div className="mt-4 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="status">Order status</Label>
                                <select
                                    id="status"
                                    value={data.status}
                                    onChange={(event) =>
                                        setData('status', event.target.value)
                                    }
                                    className={selectClass}
                                >
                                    {statuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.status && (
                                    <p className="text-[11px] text-danger">
                                        {errors.status}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="payment_status">
                                    Payment status
                                </Label>
                                <select
                                    id="payment_status"
                                    value={data.payment_status}
                                    onChange={(event) =>
                                        setData(
                                            'payment_status',
                                            event.target.value,
                                        )
                                    }
                                    className={selectClass}
                                >
                                    {paymentStatuses.map((status) => (
                                        <option
                                            key={status.value}
                                            value={status.value}
                                        >
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.payment_status && (
                                    <p className="text-[11px] text-danger">
                                        {errors.payment_status}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="notes">Internal notes</Label>
                                <Textarea
                                    id="notes"
                                    rows={3}
                                    value={data.notes}
                                    onChange={(event) =>
                                        setData('notes', event.target.value)
                                    }
                                    error={errors.notes}
                                    placeholder="Visible to staff only."
                                />
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                loading={processing}
                                startIcon={
                                    <Check size={15} aria-hidden="true" />
                                }
                            >
                                Save changes
                            </Button>

                            <p className="text-[10px] leading-relaxed text-muted">
                                Cancelling releases reserved stock. Refunds are
                                handled manually from the payment provider.
                            </p>
                        </div>
                    </form>

                    <section className="rounded-sm border border-line bg-surface p-5">
                        <h2 className="font-display text-[23px] leading-none font-medium">
                            Record
                        </h2>
                        <dl className="mt-3 space-y-2 text-[11px]">
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted">Payment</dt>
                                <dd className="text-soft">
                                    {order.payment_method_label}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted">Paid</dt>
                                <dd className="text-soft">
                                    {order.paid_at
                                        ? formatDate(order.paid_at)
                                        : '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted">Hold expires</dt>
                                <dd className="text-soft">
                                    {order.expires_at
                                        ? formatDate(order.expires_at)
                                        : '-'}
                                </dd>
                            </div>
                            <div className="flex justify-between gap-3">
                                <dt className="text-muted">Stock released</dt>
                                <dd className="text-soft">
                                    {order.stock_released_at
                                        ? formatDate(order.stock_released_at)
                                        : '-'}
                                </dd>
                            </div>
                        </dl>
                    </section>
                </aside>
            </div>
        </>
    );
}
