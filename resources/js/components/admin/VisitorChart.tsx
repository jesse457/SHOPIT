import { formatNumber } from '@/lib/utils';

export interface VisitorPoint {
    date: string;
    label: string;
    count: number;
}

export default function VisitorChart({ data }: { data: VisitorPoint[] }) {
    const total = data.reduce((sum, point) => sum + point.count, 0);
    const max = Math.max(...data.map((point) => point.count), 1);

    if (total === 0) {
        return (
            <p className="py-8 text-center text-[12px] text-muted">
                No visits recorded yet.
            </p>
        );
    }

    return (
        <div>
            <div
                className="flex h-24 items-end gap-1"
                role="img"
                aria-label="Store visits over the last fourteen days"
            >
                {data.map((point) => (
                    <div
                        key={point.date}
                        className="flex h-full flex-1 items-end"
                        title={`${point.label}: ${point.count} visits`}
                    >
                        <div
                            className="w-full rounded-t-xs bg-moss/70 transition-colors hover:bg-moss"
                            style={{
                                height: `${Math.max(
                                    4,
                                    (point.count / max) * 100,
                                )}%`,
                            }}
                        />
                    </div>
                ))}
            </div>
            <div className="mt-2 flex justify-between text-[10px] text-muted">
                <span>{data[0]?.label}</span>
                <span>{data[data.length - 1]?.label}</span>
            </div>
            <p className="mt-3 border-t border-line pt-3 text-[11px] text-muted">
                {formatNumber(total)} visits in the last 14 days.
            </p>
        </div>
    );
}
