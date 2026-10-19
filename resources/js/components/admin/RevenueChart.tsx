import { usePage } from '@inertiajs/react';
import { useRef, useState } from 'react';
import type { MouseEvent } from 'react';

import { formatCurrency } from '@/lib/utils';
import type { PageProps } from '@/types';

export interface RevenuePoint {
    month: string;
    label: string;
    revenue: number;
}

const WIDTH = 720;
const HEIGHT = 260;
const PAD_X = 44;
const PAD_Y = 24;

function compact(value: number): string {
    return new Intl.NumberFormat('en', {
        notation: 'compact',
        maximumFractionDigits: 1,
    }).format(value);
}

export default function RevenueChart({ data }: { data: RevenuePoint[] }) {
    const { shop } = usePage<PageProps>().props;
    const [hovered, setHovered] = useState<number | null>(null);
    const svgRef = useRef<SVGSVGElement>(null);

    if (data.length === 0) {
        return null;
    }

    const maxRevenue = Math.max(...data.map((point) => point.revenue), 1);
    const yMax = maxRevenue * 1.15;
    const x = (index: number) =>
        PAD_X + (index * (WIDTH - PAD_X * 2)) / Math.max(1, data.length - 1);
    const y = (value: number) =>
        HEIGHT - PAD_Y - (value / yMax) * (HEIGHT - PAD_Y * 2);

    const line = data
        .map(
            (point, index) =>
                `${index === 0 ? 'M' : 'L'}${x(index)},${y(point.revenue)}`,
        )
        .join(' ');
    const area = `${line} L${x(data.length - 1)},${HEIGHT - PAD_Y} L${x(0)},${HEIGHT - PAD_Y} Z`;

    const onMove = (event: MouseEvent<SVGSVGElement>) => {
        const rect = svgRef.current?.getBoundingClientRect();

        if (!rect) {
            return;
        }

        const ratio = (event.clientX - rect.left) / rect.width;
        const index = Math.round(ratio * (data.length - 1));

        setHovered(Math.max(0, Math.min(data.length - 1, index)));
    };

    const active = hovered !== null ? data[hovered] : null;
    const ticks = [0, 0.5, 1].map((fraction) => ({
        value: yMax * fraction,
        y: y(yMax * fraction),
    }));

    return (
        <div className="relative">
            <svg
                ref={svgRef}
                viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
                className="h-auto w-full"
                role="img"
                aria-label="Revenue over the last twelve months"
                onMouseMove={onMove}
                onMouseLeave={() => setHovered(null)}
            >
                <defs>
                    <linearGradient
                        id="revenue-fill"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                    >
                        <stop
                            offset="0%"
                            style={{
                                stopColor: 'var(--color-clay)',
                                stopOpacity: 0.22,
                            }}
                        />
                        <stop
                            offset="100%"
                            style={{
                                stopColor: 'var(--color-clay)',
                                stopOpacity: 0,
                            }}
                        />
                    </linearGradient>
                </defs>

                {ticks.map((tick) => (
                    <g key={tick.value}>
                        <line
                            x1={PAD_X}
                            x2={WIDTH - PAD_X}
                            y1={tick.y}
                            y2={tick.y}
                            style={{ stroke: 'var(--color-line)' }}
                            strokeWidth="1"
                            strokeDasharray="3 4"
                        />
                        <text
                            x={PAD_X - 8}
                            y={tick.y + 3}
                            textAnchor="end"
                            fontSize="10"
                            style={{ fill: 'var(--color-muted)' }}
                        >
                            {compact(tick.value)}
                        </text>
                    </g>
                ))}

                <path d={area} fill="url(#revenue-fill)" />
                <path
                    d={line}
                    fill="none"
                    style={{ stroke: 'var(--color-clay)' }}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {hovered !== null && (
                    <line
                        x1={x(hovered)}
                        x2={x(hovered)}
                        y1={PAD_Y}
                        y2={HEIGHT - PAD_Y}
                        style={{ stroke: 'var(--color-line)' }}
                        strokeWidth="1"
                    />
                )}

                {data.map((point, index) => (
                    <circle
                        key={point.month}
                        cx={x(index)}
                        cy={y(point.revenue)}
                        r={hovered === index ? 4 : 0}
                        style={{
                            fill: 'var(--color-clay)',
                            stroke: 'var(--color-surface)',
                        }}
                        strokeWidth="2"
                    />
                ))}

                {data.map((point, index) =>
                    index % 2 === 0 || index === data.length - 1 ? (
                        <text
                            key={point.month}
                            x={x(index)}
                            y={HEIGHT - 6}
                            textAnchor="middle"
                            fontSize="10"
                            style={{ fill: 'var(--color-muted)' }}
                        >
                            {point.label}
                        </text>
                    ) : null,
                )}
            </svg>

            {active && (
                <div className="pointer-events-none absolute top-2 right-2 rounded-sm border border-line bg-surface px-3 py-2 text-[11px] shadow-soft">
                    <p className="font-medium text-ink">{active.label}</p>
                    <p className="tabular mt-0.5 text-soft">
                        {formatCurrency(
                            active.revenue,
                            shop.currency,
                            shop.currency_locale,
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
