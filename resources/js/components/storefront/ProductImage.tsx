import { useState } from 'react';

import { cn } from '@/lib/utils';

const PLACEHOLDER = '/images/product-placeholder.svg';

interface ProductImageProps {
    src: string | null | undefined;
    alt: string;
    className?: string;
    priority?: boolean;
}

function ImageSource({ src, alt, className, priority }: ProductImageProps) {
    const [failed, setFailed] = useState(false);

    return (
        <img
            src={failed || !src ? PLACEHOLDER : src}
            alt={alt}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding="async"
            onError={() => setFailed(true)}
            className={cn('h-full w-full object-cover', className)}
        />
    );
}

export default function ProductImage(props: ProductImageProps) {
    return <ImageSource key={props.src ?? 'placeholder'} {...props} />;
}
