import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

const PLACEHOLDER = '/images/product-placeholder.svg';

interface ProductImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    priority?: boolean;
}

export default function ProductImage({
    src,
    alt,
    className,
    priority = false,
}: ProductImageProps) {
    const [current, setCurrent] = useState(src || PLACEHOLDER);

    useEffect(() => {
        setCurrent(src || PLACEHOLDER);
    }, [src]);

    return (
        <img
            src={current}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onError={() => setCurrent(PLACEHOLDER)}
            className={cn('h-full w-full object-cover', className)}
        />
    );
}
