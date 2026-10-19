import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, Check } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import PageHeader from '@/components/admin/PageHeader';
import PageMeta from '@/components/common/PageMeta';
import Checkbox from '@/components/form/Checkbox';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import { Button } from '@/components/ui/button/Button';
import {
    index as adminCustomersIndex,
    store as adminCustomerStore,
    update as adminCustomerUpdate,
} from '@/routes/admin/customers';
import type { AdminCustomer, PageProps } from '@/types';

interface CustomerFormProps {
    customer: AdminCustomer | null;
}

export default function CustomerForm({ customer }: CustomerFormProps) {
    const { auth } = usePage<PageProps>().props;
    const isSelf = customer !== null && auth.user?.id === customer.id;

    const { data, setData, post, patch, processing, errors } = useForm({
        name: customer?.name ?? '',
        email: customer?.email ?? '',
        password: '',
        is_admin: customer?.is_admin ?? false,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (customer) {
            patch(adminCustomerUpdate.url(customer.id), {
                preserveScroll: true,
            });
        } else {
            post(adminCustomerStore.url());
        }
    };

    return (
        <>
            <PageMeta
                title={customer ? 'Edit customer' : 'New customer'}
                description="Manage a customer account."
                noIndex
            />

            <PageHeader
                title={customer ? 'Edit customer' : 'New customer'}
                description={
                    customer
                        ? 'Update the account details and access level.'
                        : 'Create a customer or staff account.'
                }
                action={
                    <Link
                        href={adminCustomersIndex.url()}
                        className="inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                    >
                        <ArrowLeft size={13} aria-hidden="true" />
                        All customers
                    </Link>
                }
            />

            <form onSubmit={submit} className="mt-6 max-w-2xl">
                <div className="space-y-4">
                    <section className="rounded-sm border border-line bg-surface p-5">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={data.name}
                                    onChange={(event) =>
                                        setData('name', event.target.value)
                                    }
                                    error={errors.name}
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(event) =>
                                        setData('email', event.target.value)
                                    }
                                    error={errors.email}
                                />
                            </div>

                            <div className="space-y-2 sm:col-span-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required={!customer}
                                    value={data.password}
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                    error={errors.password}
                                    hint={
                                        customer
                                            ? 'Leave blank to keep the current password.'
                                            : 'At least 8 characters.'
                                    }
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <Checkbox
                                    id="is_admin"
                                    label="Administrator access"
                                    checked={data.is_admin}
                                    onChange={(checked) =>
                                        setData('is_admin', checked)
                                    }
                                    disabled={isSelf}
                                />
                                {isSelf && (
                                    <p className="mt-1.5 text-[11px] text-muted">
                                        You cannot remove your own admin access.
                                    </p>
                                )}
                                {errors.is_admin && (
                                    <p className="mt-1.5 text-[11px] text-danger">
                                        {errors.is_admin}
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>

                    <div className="flex flex-wrap items-center gap-3">
                        <Button
                            type="submit"
                            loading={processing}
                            startIcon={<Check size={15} aria-hidden="true" />}
                        >
                            {customer ? 'Save customer' : 'Create customer'}
                        </Button>
                        <Link
                            href={adminCustomersIndex.url()}
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
