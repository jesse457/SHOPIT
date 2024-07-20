<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\Order;
use Carbon\Carbon;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Number;

class DashboardInfo extends BaseWidget
{
    /**
     * Get the stats for the dashboard.
     *
     * @return array The stats as an array of Stats objects.
     */
    protected function getStats(): array
    {
        // Get the current total of orders within the current week
        $currentTotal =  Order::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->count();

        // Get the previous total of orders within the previous week
        $previousTotal = Order::where('created_at', '<', Carbon::now()->subWeek())->count();

        // Calculate the difference between the current and previous total of orders
        $difference = $currentTotal - $previousTotal;

        // Calculate the percentage change between the current and previous total of orders
        $percentageChange = $previousTotal > 0 ? ($difference / $previousTotal) * 100 : 0;

        // Generate a description for the percentage change
        $description = abs($percentageChange) > 0
            ? number_format(abs($percentageChange), 1) . '% ' . ($difference >= 0 ? 'increase' : 'decrease')
            : 'No change';

        $color = $difference >= 0 ? 'success' : 'danger';



        $icon = $difference >= 0
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';


        // Get the current total of transactions within the current week
        $transCurrentTotal =  Order::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->sum('grand_total');

        // Get the previous total of transactions within the previous week
        $transpreviousTotal = Order::where('created_at', '<', Carbon::now()->subWeek())->sum('grand_total');

        // Calculate the difference between the current and previous total of transactions
        $transdifference = $transCurrentTotal - $transpreviousTotal;

        // Calculate the percentage change between the current and previous total of transactions
        $transpercentageChange = $transpreviousTotal > 0 ? ($transdifference / $transpreviousTotal) * 100 : 0;

        // Generate a description for the percentage change of transactions
        $transdescription = abs($transpercentageChange) > 0
            ? number_format(abs($transpercentageChange), 1) . '% ' . ($transdifference >= 0 ? 'increase' : 'decrease')
            : 'No change';

        // Generate an icon based on the difference between the current and previous total of transactions
        $transicon = $transdifference >= 0
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';

        // Generate a color based on the difference between the current and previous total of transactions
        $transcolor = $transdifference >= 0 ? 'success' : 'danger';


        // Get the current total of pending transactions within the current week
        $pendCurrentTotal =  Order::whereBetween('created_at', [
            Carbon::now()->startOfWeek(),
            Carbon::now()->endOfWeek()
        ])->where('payment_status', 'pending')->count();

        // Get the previous total of pending transactions within the previous week
        $pendPreviousTotal = Order::where('created_at', '<', Carbon::now()->subWeek())->count();

        // Calculate the difference between the current and previous total of pending transactions
        $pendDifference = $pendCurrentTotal - $pendPreviousTotal;

        // Calculate the percentage change between the current and previous total of pending transactions
        $pendPercentageChange = $pendPreviousTotal > 0 ? ($pendDifference / $pendPreviousTotal) * 100 : 0;

        // Generate a description for the percentage change of pending transactions
        $pendDescription = abs($pendPercentageChange) > 0
            ? number_format(abs($pendPercentageChange), 1) . '% ' . ($pendDifference >= 0 ? 'increase' : 'decrease')
            : 'No change';

        // Generate an icon based on the difference between the current and previous total of pending transactions
        $pendIcon = $pendDifference >= 0
            ? 'heroicon-m-arrow-trending-up'
            : 'heroicon-m-arrow-trending-down';

        // Generate a color based on the difference between the current and previous total of pending transactions
        $pendColor = $pendDifference >= 0 ? 'success' : 'danger';

        // Return the stats as an array of Stats objects
        return [
            Stat::make('Weekly Orders', $currentTotal)
                ->description($description)
                ->descriptionIcon($icon)
                ->color($color),
            Stat::make('Weekly Transactions', Number::currency($transCurrentTotal, 'XAF'))
                ->description($transdescription)
                ->descriptionIcon($transicon)
                ->color($transcolor),
            Stat::make('Pending Transactions', $pendCurrentTotal)
                ->description($pendDescription)
                ->descriptionIcon($pendIcon)
                ->color($pendColor),
        ];
    }
}
