import { Head } from '@inertiajs/react';

interface PageMetaProps {
    title: string;
    description?: string;
    image?: string;
    noIndex?: boolean;
}

const DEFAULT_DESCRIPTION =
    'A considered edit of apparel, objects and technology for everyday life.';

export default function PageMeta({
    title,
    description = DEFAULT_DESCRIPTION,
    image,
    noIndex = false,
}: PageMetaProps) {
    return (
        <Head title={title}>
            <meta name="description" content={description} />
            {noIndex && <meta name="robots" content="noindex, nofollow" />}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:type" content="website" />
            {image && <meta property="og:image" content={image} />}
            <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
        </Head>
    );
}
