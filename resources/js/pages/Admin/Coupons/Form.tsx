import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Checkbox from '@/components/form/Checkbox';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import { Button } from '@/components/ui/button/Button';
import {
    index as adminCouponsIndex,
    store as adminCouponStore,
    update as adminCouponUpdate,
} from '@/routes/admin/coupons';
import type { AdminCoupon } from '@/types';

interface CouponFormProps {
    coupon: AdminCoupon | null;
}

export default function CouponForm({ coupon }: CouponFormProps) {
    const { data, setData, post, put, processing, errors } = useForm({
        code: coupon?.code ?? '',
        type: coupon?.type ?? 'percentage',
        value: coupon?.value ?? '10',
        min_order_amount: coupon?.min_order_amount ?? '',
        max_uses: coupon?.max_uses?.toString() ?? '',
        starts_at: coupon?.starts_at?.slice(0, 10) ?? '',
        expires_at: coupon?.expires_at?.slice(0, 10) ?? '',
        is_active: coupon?.is_active ?? true,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (coupon) {
            put(adminCouponUpdate.url(coupon.code));
        } else {
            post(adminCouponStore.url());
        }
    };

    const selectClass =
        'h-11 w-full rounded-sm border border-line bg-surface px-3 text-[14px] text-ink focus:border-ink focus:outline-none';

    return (
        <>
            <PageMeta
                title={coupon ? 'Edit coupon' : 'New coupon'}
                description="Manage a checkout discount."
                noIndex
            />

            <PageHeader
                title={coupon ? 'Edit coupon' : 'New coupon'}
                description={
                    coupon
                        ? 'Update the discount, limits or availability window.'
                        : 'Create a discount code for checkout.'
                }
                action={
                    <Link
                        href={adminCouponsIndex.url()}
                        className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                    >
                        <ArrowLeft size={13} aria-hidden="true" />
                        All coupons
                    </Link>
                }
            />

            <form onSubmit={submit} className="mt-6 max-w-2xl">
                <div className="space-y-4">
                    <section className="rounded-sm border border-line bg-surface p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="code">Code</Label>
                                <Input
                                    id="code"
                                    required
                                    value={data.code}
                                    onChange={(event) =>
                                        setData(
                                            'code',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    error={errors.code}
                                    hint="Letters, numbers, dashes and underscores."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <select
                                    id="type"
                                    value={data.type}
                                    onChange={(event) =>
                                        setData(
                                            'type',
                                            event.target
                                                .value as AdminCoupon['type'],
                                        )
                                    }
                                    className={selectClass}
                                >
                                    <option value="percentage">
                                        Percentage
                                    </option>
                                    <option value="fixed">Fixed amount</option>
                                </select>
                                {errors.type && (
                                    <p className="text-[11px] text-danger">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="value">
                                    {data.type === 'percentage'
                                        ? 'Percentage off'
                                        : 'Amount off (XAF)'}
                                </Label>
                                <Input
                                    id="value"
                                    type="number"
                                    min="0.01"
                                    step={
                                        data.type === 'percentage'
                                            ? '0.01'
                                            : '1'
                                    }
                                    required
                                    value={data.value}
                                    onChange={(event) =>
                                        setData('value', event.target.value)
                                    }
                                    error={errors.value}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="min_order_amount">
                                    Minimum order (XAF)
                                </Label>
                                <Input
                                    id="min_order_amount"
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={data.min_order_amount}
                                    onChange={(event) =>
                                        setData(
                                            'min_order_amount',
                                            event.target.value,
                                        )
                                    }
                                    error={errors.min_order_amount}
                                    hint="Optional."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="max_uses">Maximum uses</Label>
                                <Input
                                    id="max_uses"
                                    type="number"
                                    min="1"
                                    step="1"
                                    value={data.max_uses}
                                    onChange={(event) =>
                                        setData('max_uses', event.target.value)
                                    }
                                    error={errors.max_uses}
                                    hint="Optional. Leave blank for unlimited."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="starts_at">Starts</Label>
                                <Input
                                    id="starts_at"
                                    type="date"
                                    value={data.starts_at}
                                    onChange={(event) =>
                                        setData('starts_at', event.target.value)
                                    }
                                    error={errors.starts_at}
                                    hint="Optional."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="expires_at">Expires</Label>
                                <Input
                                    id="expires_at"
                                    type="date"
                                    value={data.expires_at}
                                    onChange={(event) =>
                                        setData(
                                            'expires_at',
                                            event.target.value,
                                        )
                                    }
                                    error={errors.expires_at}
                                    hint="Optional."
                                />
                            </div>

                            <div className="flex items-end sm:col-span-2">
                                <Checkbox
                                    id="is_active"
                                    label="Available at checkout"
                                    checked={data.is_active}
                                    onChange={(checked) =>
                                        setData('is_active', checked)
                                    }
                                />
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="submit"
                            loading={processing}
                            startIcon={<Check size={15} aria-hidden="true" />}
                        >
                            {coupon ? 'Save coupon' : 'Create coupon'}
                        </Button>
                        <Link
                            href={adminCouponsIndex.url()}
                            className="text-[12px] font-medium text-soft hover:text-ink"
                        >
                            Cancel
                        </Link>
                    </div>
                </div>
            </form>
        </>
    );
}
