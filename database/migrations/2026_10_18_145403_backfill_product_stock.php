<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('products')
            ->where('in_stock', true)
            ->where('stock_quantity', 0)
            ->update(['stock_quantity' => 50]);
    }

    public function down(): void
    {
        // The previous schema had no stock count to restore.
    }
};
