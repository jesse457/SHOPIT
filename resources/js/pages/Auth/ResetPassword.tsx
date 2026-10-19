import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import { create as loginCreate } from '@/actions/App/Http/Controllers/Auth/LoginController';
import { store as resetStore } from '@/actions/App/Http/Controllers/Auth/ResetPasswordController';
import PageMeta from '@/components/common/PageMeta';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import PasswordInput from '@/components/form/PasswordInput';
import { Button } from '@/components/ui/button/Button';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(resetStore.url());
    };

    return (
        <>
            <PageMeta
                title="Set a new password"
                description="Choose a new password for your SHOPIT account."
                noIndex
            />

            <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                    Set a new password.
                </h1>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-soft">
                    Choose something you have not used here before. Reset links
                    expire after one hour.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            error={errors.email}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">New password</Label>
                        <PasswordInput
                            id="password"
                            autoComplete="new-password"
                            autoFocus
                            required
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                            error={errors.password}
                            hint="At least 8 characters."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">
                            Confirm password
                        </Label>
                        <PasswordInput
                            id="password_confirmation"
                            autoComplete="new-password"
                            required
                            value={data.password_confirmation}
                            onChange={(event) =>
                                setData(
                                    'password_confirmation',
                                    event.target.value,
                                )
                            }
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        loading={processing}
                        endIcon={<ArrowRight size={15} aria-hidden="true" />}
                    >
                        Update password
                    </Button>
                </form>

                <Link
                    href={loginCreate.url()}
                    className="mt-7 inline-flex items-center gap-2 text-[12px] font-medium text-soft hover:text-ink"
                >
                    <ArrowLeft size={13} aria-hidden="true" />
                    Back to sign in
                </Link>
            </div>
        </>
    );
}
