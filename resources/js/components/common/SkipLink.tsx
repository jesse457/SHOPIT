export default function SkipLink({
    targetId = 'main-content',
}: {
    targetId?: string;
}) {
    return (
        <a
            href={`#${targetId}`}
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[80] focus:rounded-sm focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-canvas"
        >
            Skip to content
        </a>
    );
}
