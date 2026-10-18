<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('order_items', function (Blueprint $table): void {
            $table->integer('quantity')->default(1)->change();
        });
    }

    public function down(): void
    {
        // The original column declared an empty default(), which is invalid.
        // There is no meaningful previous state to restore.
    }
};
