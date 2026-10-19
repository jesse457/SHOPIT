import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import { store as forgotStore } from '@/actions/App/Http/Controllers/Auth/ForgotPasswordController';
import { create as loginCreate } from '@/actions/App/Http/Controllers/Auth/LoginController';
import PageMeta from '@/components/common/PageMeta';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import Alert from '@/components/ui/alert/Alert';
import { Button } from '@/components/ui/button/Button';
import type { PageProps } from '@/types';

export default function ForgotPassword() {
    const { status } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(forgotStore.url());
    };

    return (
        <>
            <PageMeta
                title="Reset your password"
                description="Request a password reset link for your SHOPIT account."
                noIndex
            />

            <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                    Reset your password.
                </h1>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-soft">
                    Enter the email on your account and we will send a reset
                    link if it matches a customer.
                </p>

                {status && (
                    <Alert variant="success" className="mt-6">
                        {status}
                    </Alert>
                )}

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            autoComplete="email"
                            autoFocus
                            required
                            value={data.email}
                            onChange={(event) =>
                                setData('email', event.target.value)
                            }
                            error={errors.email}
                        />
                    </div>

                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        loading={processing}
                        endIcon={<ArrowRight size={15} aria-hidden="true" />}
                    >
                        Send reset link
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
