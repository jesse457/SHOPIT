import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight, Check } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import {
    update as updateAccount,
    updatePassword,
} from '@/actions/App/Http/Controllers/Storefront/AccountController';
import PageMeta from '@/components/common/PageMeta';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import PasswordInput from '@/components/form/PasswordInput';
import { Button, ButtonLink } from '@/components/ui/button/Button';
import { formatDate } from '@/lib/utils';
import { dashboard as adminDashboard } from '@/routes/admin';
import { index as ordersIndex } from '@/routes/orders';
import { index as productsIndex } from '@/routes/products';
import type { PageProps } from '@/types';

interface AccountSummary {
    orders_count: number;
    member_since: string | null;
}

export default function Account({ summary }: { summary: AccountSummary }) {
    const { auth } = usePage<PageProps>().props;
    const user = auth.user;

    const profile = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
    });

    const password = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const saveProfile = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        profile.patch(updateAccount.url(), { preserveScroll: true });
    };

    const savePassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        password.patch(updatePassword.url(), {
            preserveScroll: true,
            onSuccess: () => password.reset(),
        });
    };

    return (
        <>
            <PageMeta
                title="Your account"
                description="Manage your SHOPIT account."
                noIndex
            />

            <section className="container-shop py-10 lg:py-14">
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-[clamp(2.4rem,5vw,4.4rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                            Your account
                        </h1>
                        <p className="mt-3 text-[13px] text-soft">
                            {user?.name}
                            {summary.member_since
                                ? ` · Member since ${formatDate(summary.member_since)}`
                                : ''}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <ButtonLink
                            href={ordersIndex.url()}
                            variant="secondary"
                            size="sm"
                            endIcon={
                                <ArrowRight size={13} aria-hidden="true" />
                            }
                        >
                            My orders ({summary.orders_count})
                        </ButtonLink>
                        {user?.is_admin && (
                            <ButtonLink href={adminDashboard.url()} size="sm">
                                Admin dashboard
                            </ButtonLink>
                        )}
                    </div>
                </div>

                <div className="mt-10 grid gap-6 lg:grid-cols-2">
                    <section className="rounded-sm border border-line bg-surface p-6">
                        <h2 className="font-display text-[26px] leading-none font-medium">
                            Profile
                        </h2>
                        <p className="mt-2 text-[12px] text-muted">
                            The name and email used on your orders.
                        </p>

                        <form onSubmit={saveProfile} className="mt-5 space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    required
                                    value={profile.data.name}
                                    onChange={(event) =>
                                        profile.setData(
                                            'name',
                                            event.target.value,
                                        )
                                    }
                                    error={profile.errors.name}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={profile.data.email}
                                    onChange={(event) =>
                                        profile.setData(
                                            'email',
                                            event.target.value,
                                        )
                                    }
                                    error={profile.errors.email}
                                />
                            </div>

                            <Button
                                type="submit"
                                loading={profile.processing}
                                startIcon={
                                    <Check size={14} aria-hidden="true" />
                                }
                            >
                                Save profile
                            </Button>
                        </form>
                    </section>

                    <section className="rounded-sm border border-line bg-surface p-6">
                        <h2 className="font-display text-[26px] leading-none font-medium">
                            Password
                        </h2>
                        <p className="mt-2 text-[12px] text-muted">
                            Use at least eight characters. You will stay signed
                            in.
                        </p>

                        <form
                            onSubmit={savePassword}
                            className="mt-5 space-y-4"
                        >
                            <div className="space-y-2">
                                <Label htmlFor="current_password">
                                    Current password
                                </Label>
                                <PasswordInput
                                    id="current_password"
                                    autoComplete="current-password"
                                    required
                                    value={password.data.current_password}
                                    onChange={(event) =>
                                        password.setData(
                                            'current_password',
                                            event.target.value,
                                        )
                                    }
                                    error={password.errors.current_password}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="new_password">
                                    New password
                                </Label>
                                <PasswordInput
                                    id="new_password"
                                    autoComplete="new-password"
                                    required
                                    value={password.data.password}
                                    onChange={(event) =>
                                        password.setData(
                                            'password',
                                            event.target.value,
                                        )
                                    }
                                    error={password.errors.password}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm new password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    autoComplete="new-password"
                                    required
                                    value={password.data.password_confirmation}
                                    onChange={(event) =>
                                        password.setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                />
                            </div>

                            <Button
                                type="submit"
                                loading={password.processing}
                                startIcon={
                                    <Check size={14} aria-hidden="true" />
                                }
                            >
                                Update password
                            </Button>
                        </form>
                    </section>
                </div>

                <div className="mt-8 flex flex-wrap gap-4">
                    <Link
                        href={productsIndex.url()}
                        className="link-underline text-[12px] font-medium text-soft hover:text-ink"
                    >
                        Continue shopping
                    </Link>
                </div>
            </section>
        </>
    );
}
