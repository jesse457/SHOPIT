import { useForm } from '@inertiajs/react';
import { Star } from '@phosphor-icons/react';
import type { FormEvent } from 'react';

import Input from '@/components/form/Input';
import Label from '@/components/form/Label';
import Textarea from '@/components/form/Textarea';
import { Button } from '@/components/ui/button/Button';
import { store as reviewStore } from '@/routes/reviews';
import type { Product } from '@/types';

export default function ReviewForm({ product }: { product: Product }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        rating: 5,
        title: '',
        body: '',
    });

    const reviewError = (errors as Record<string, string | undefined>).review;

    const submit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(reviewStore.url(product.slug), {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form
            onSubmit={submit}
            className="mt-6 rounded-sm border border-line bg-surface p-5"
        >
            <h3 className="font-display text-[22px] leading-none font-medium">
                Write a review
            </h3>
            <p className="mt-1.5 text-[11px] text-muted">
                Reviews are published after a quick moderation pass.
            </p>

            <div className="mt-4">
                <Label>Rating</Label>
                <div className="mt-1.5 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => setData('rating', value)}
                            aria-label={`${value} star${value === 1 ? '' : 's'}`}
                            aria-pressed={data.rating === value}
                            className="p-0.5"
                        >
                            <Star
                                size={22}
                                weight={
                                    value <= data.rating ? 'fill' : 'regular'
                                }
                                className={
                                    value <= data.rating
                                        ? 'text-sun'
                                        : 'text-line'
                                }
                                aria-hidden="true"
                            />
                        </button>
                    ))}
                </div>
                {errors.rating && (
                    <p className="mt-1.5 text-[11px] text-danger">
                        {errors.rating}
                    </p>
                )}
            </div>

            <div className="mt-4 space-y-2">
                <Label htmlFor="review-title">Title (optional)</Label>
                <Input
                    id="review-title"
                    value={data.title}
                    onChange={(event) => setData('title', event.target.value)}
                    error={errors.title}
                />
            </div>

            <div className="mt-4 space-y-2">
                <Label htmlFor="review-body">Your review</Label>
                <Textarea
                    id="review-body"
                    rows={4}
                    required
                    value={data.body}
                    onChange={(event) => setData('body', event.target.value)}
                    error={errors.body}
                    placeholder="What did you notice about the material, fit or finish?"
                />
            </div>

            {reviewError && (
                <p className="mt-3 text-[11px] text-danger">{reviewError}</p>
            )}

            <Button
                type="submit"
                size="sm"
                className="mt-4"
                loading={processing}
            >
                Submit review
            </Button>
        </form>
    );
}
