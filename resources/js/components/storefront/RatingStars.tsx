import { Star } from '@phosphor-icons/react';

interface RatingStarsProps {
    rating: number;
    size?: number;
    className?: string;
}

export default function RatingStars({
    rating,
    size = 13,
    className = '',
}: RatingStarsProps) {
    const rounded = Math.round(rating);

    return (
        <span
            className={`inline-flex items-center gap-0.5 ${className}`}
            aria-label={`${rating} out of 5 stars`}
        >
            {[1, 2, 3, 4, 5].map((value) => (
                <Star
                    key={value}
                    size={size}
                    weight={value <= rounded ? 'fill' : 'regular'}
                    className={value <= rounded ? 'text-sun' : 'text-line'}
                    aria-hidden="true"
                />
            ))}
        </span>
    );
}
