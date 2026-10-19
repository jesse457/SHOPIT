import { Link, useForm, usePage } from '@inertiajs/react';
import { ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import { create as forgotCreate } from '@/actions/App/Http/Controllers/Auth/ForgotPasswordController';
import { store as loginStore } from '@/actions/App/Http/Controllers/Auth/LoginController';
import { create as registerCreate } from '@/actions/App/Http/Controllers/Auth/RegisterController';
import PageMeta from '@/components/common/PageMeta';
import Checkbox from '@/components/form/Checkbox';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import PasswordInput from '@/components/form/PasswordInput';
import Alert from '@/components/ui/alert/Alert';
import { Button } from '@/components/ui/button/Button';
import type { PageProps } from '@/types';

export default function Login() {
    const { status } = usePage<PageProps>().props;
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(loginStore.url());
    };

    return (
        <>
            <PageMeta
                title="Sign in"
                description="Sign in to your SHOPIT account."
                noIndex
            />

            <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                    Welcome back.
                </h1>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-soft">
                    Sign in to track orders, keep your details together and
                    check out faster.
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

                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <Label htmlFor="password">Password</Label>
                            <Link
                                href={forgotCreate.url()}
                                className="text-[11px] font-medium text-clay hover:text-ink"
                            >
                                Forgot password?
                            </Link>
                        </div>
                        <PasswordInput
                            id="password"
                            autoComplete="current-password"
                            required
                            value={data.password}
                            onChange={(event) =>
                                setData('password', event.target.value)
                            }
                            error={errors.password}
                        />
                    </div>

                    <Checkbox
                        id="remember"
                        label="Keep me signed in"
                        checked={data.remember}
                        onChange={(checked) => setData('remember', checked)}
                    />

                    <Button
                        type="submit"
                        size="lg"
                        fullWidth
                        loading={processing}
                        endIcon={<ArrowRight size={15} aria-hidden="true" />}
                    >
                        Sign in
                    </Button>
                </form>

                <p className="mt-7 text-[12px] text-soft">
                    New to SHOPIT?{' '}
                    <Link
                        href={registerCreate.url()}
                        className="link-underline font-medium text-ink"
                    >
                        Create an account
                    </Link>
                </p>
            </div>
        </>
    );
}
