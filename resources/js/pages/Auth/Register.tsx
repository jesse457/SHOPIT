import { Link, useForm } from '@inertiajs/react';
import { ArrowRight } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import { create as loginCreate } from '@/actions/App/Http/Controllers/Auth/LoginController';
import { store as registerStore } from '@/actions/App/Http/Controllers/Auth/RegisterController';
import PageMeta from '@/components/common/PageMeta';
import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import PasswordInput from '@/components/form/PasswordInput';
import { Button } from '@/components/ui/button/Button';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        post(registerStore.url());
    };

    return (
        <>
            <PageMeta
                title="Create an account"
                description="Create a SHOPIT account to track orders and check out faster."
                noIndex
            />

            <div>
                <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] leading-[0.95] font-medium tracking-[-0.03em]">
                    Create your account.
                </h1>
                <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-soft">
                    One account for orders, addresses and a faster checkout. No
                    noise, no marketing list.
                </p>

                <form onSubmit={submit} className="mt-8 space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            type="text"
                            autoComplete="name"
                            autoFocus
                            required
                            value={data.name}
                            onChange={(event) =>
                                setData('name', event.target.value)
                            }
                            error={errors.name}
                        />
                    </div>

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
                        <Label htmlFor="password">Password</Label>
                        <PasswordInput
                            id="password"
                            autoComplete="new-password"
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
                        Create account
                    </Button>
                </form>

                <p className="mt-7 text-[12px] text-soft">
                    Already have an account?{' '}
                    <Link
                        href={loginCreate.url()}
                        className="link-underline font-medium text-ink"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </>
    );
}
