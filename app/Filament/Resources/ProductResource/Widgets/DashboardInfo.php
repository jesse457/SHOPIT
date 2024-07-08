<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class DashboardInfo extends BaseWidget
{
    protected function getStats(): array
    {

        $currentTotal = Order::count();
        $previousTotal = Order::where('created_at', '<', Carbon::now()->subWeek())->count();

        $difference = $currentTotal - $previousTotal;
        $percentageChange = $previousTotal > 0 ? ($difference / $previousTotal) * 100 : 0;

        $description = abs($percentageChange) > 0
            ? number_format(abs($percentageChange), 1) . '% ' . ($difference >= 0 ? 'increase' : 'decrease')
            : 'No change';

        $icon = $difference >= 0
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';

        $color = $difference >= 0 ? 'success' : 'danger';


        $transCurrentTotal = Order::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->sum('grand_total');
        $transpreviousTotal = Order::where('created_at', '<', Carbon::now()->subWeek())->sum('grand_total');

        $transdifference = $transCurrentTotal - $transpreviousTotal;
        $transpercentageChange = $transpreviousTotal > 0 ? ($transdifference / $transpreviousTotal) * 100 : 0;

        $transdescription = abs($transpercentageChange) > 0
            ? number_format(abs($transpercentageChange), 1) . '% ' . ($transdifference >= 0 ? 'increase' : 'decrease')
            : 'No change';

        $transicon = $transdifference >= 0
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';

        $transcolor = $difference >= 0 ? 'success' : 'danger';
        return [
            Stat::make('Total Orders', $currentTotal)
            ->description($description)
            ->descriptionIcon($icon)
            ->color($color),
            Stat::make('Weekly Transactions', $transCurrentTotal)
            ->description($transdescription)
            ->descriptionIcon($transicon)
            ->color($transcolor),
        ];
    }
}
