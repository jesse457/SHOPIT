<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->string('stripe_checkout_session_id')->nullable()->unique()->after('payment_method');
            $table->timestamp('paid_at')->nullable()->after('payment_status');
            $table->timestamp('expires_at')->nullable()->after('paid_at');
            $table->timestamp('stock_released_at')->nullable()->after('expires_at');
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropUnique(['stripe_checkout_session_id']);
            $table->dropColumn(['stripe_checkout_session_id', 'paid_at', 'expires_at', 'stock_released_at']);
        });
    }
};
