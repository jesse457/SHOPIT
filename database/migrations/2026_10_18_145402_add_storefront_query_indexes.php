<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table): void {
            $table->index('is_active');
            $table->index('is_featured');
            $table->index('on_sale');
            $table->index('price');
            $table->index('created_at');
            $table->index(['is_active', 'created_at']);
        });

        Schema::table('orders', function (Blueprint $table): void {
            $table->index('status');
            $table->index('payment_status');
            $table->index('expires_at');
            $table->index('created_at');
            $table->index(['payment_status', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table): void {
            $table->dropIndex(['payment_status', 'created_at']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['expires_at']);
            $table->dropIndex(['payment_status']);
            $table->dropIndex(['status']);
        });

        Schema::table('products', function (Blueprint $table): void {
            $table->dropIndex(['is_active', 'created_at']);
            $table->dropIndex(['created_at']);
            $table->dropIndex(['price']);
            $table->dropIndex(['on_sale']);
            $table->dropIndex(['is_featured']);
            $table->dropIndex(['is_active']);
        });
    }
};
