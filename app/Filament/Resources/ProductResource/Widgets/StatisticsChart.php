<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use Carbon\Carbon;
use Filament\Widgets\ChartWidget;
use Illuminate\Support\Facades\DB;

class StatisticsChart extends ChartWidget
{
    protected static ?string $heading = 'Yearly Total Amount';

    public ?string $filter;

    protected int $currentYear;
    protected int $startYear;

    public function __construct($id = null)
    {

        $this->currentYear = Carbon::now()->year;
        $this->startYear = $this->currentYear - 4;
        $this->filter = (string)$this->currentYear; // Set initial filter to current year
    }

    protected function getFilters(): ?array
    {
        $filters = ['all' => 'All Years'];
        for ($year = $this->startYear; $year <= $this->currentYear; $year++) {
            $filters[$year] = (string)$year;
        }
        return $filters;
    }

    protected function getData(): array
    {
        $yearlyData = DB::table('order_items')
            ->select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as total')
            )
            ->whereYear('created_at', '>=', $this->startYear)
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get();

        $datasets = [];
        $years = $this->filter === 'all'
            ? range($this->startYear, $this->currentYear)
            : [$this->filter];
        $colors = ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40', '#9966FF'];

        foreach ($years as $index => $year) {
            $yearData = array_fill(1, 12, 0);
            foreach ($yearlyData as $data) {
                if ($data->year == $year) {
                    $yearData[$data->month] = round($data->total, 2);
                }
            }

            $datasets[] = [
                'label' => "Total Amount $year",
                'data' => array_values($yearData),
                'borderColor' => $colors[$index % count($colors)],
                'tension' => 0.1,
            ];
        }

        return [
            'datasets' => $datasets,
            'labels' => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        ];
    }

    protected function getOptions(): array
    {
        return [
            'plugins' => [
                'legend' => [
                    'display' => true,
                ],
            ],
            'scales' => [
                'y' => [
                    'beginAtZero' => true,
                    'title' => [
                        'display' => true,
                        'text' => 'Total Amount'.' '.'(FCFA)',
                    ],
                ],
            ],
        ];
    }


    protected function getType(): string
    {
        return 'bar';
    }

}
