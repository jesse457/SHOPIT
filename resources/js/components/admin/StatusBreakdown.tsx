export interface StatusCount {
    status: string;
    label: string;
    count: number;
}

export default function StatusBreakdown({ data }: { data: StatusCount[] }) {
    const max = Math.max(...data.map((item) => item.count), 1);
    const total = data.reduce((sum, item) => sum + item.count, 0);

    return (
        <div>
            <div className="space-y-3">
                {data.map((item) => (
                    <div
                        key={item.status}
                        className="grid grid-cols-[84px_1fr_32px] items-center gap-3"
                    >
                        <span className="truncate text-[11px] text-soft">
                            {item.label}
                        </span>
                        <div
                            className="h-2 overflow-hidden rounded-full bg-raised"
                            role="presentation"
                        >
                            <div
                                className="h-full rounded-full bg-clay"
                                style={{
                                    width: `${(item.count / max) * 100}%`,
                                }}
                            />
                        </div>
                        <span className="tabular text-right text-[11px] text-ink">
                            {item.count}
                        </span>
                    </div>
                ))}
            </div>
            <p className="mt-4 border-t border-line pt-3 text-[11px] text-muted">
                {total} {total === 1 ? 'order' : 'orders'} in total.
            </p>
        </div>
    );
}
