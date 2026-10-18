<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->decimal('compare_at_price', 10, 2)->nullable()->after('price');
            $table->unsignedInteger('stock_quantity')->default(0)->after('in_stock');
            $table->unsignedInteger('low_stock_threshold')->default(5)->after('stock_quantity');
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->dropSoftDeletes();
            $table->dropColumn(['compare_at_price', 'stock_quantity', 'low_stock_threshold']);
        });
    }
};
