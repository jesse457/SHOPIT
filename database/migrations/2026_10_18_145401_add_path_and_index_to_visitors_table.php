<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('visitors', function (Blueprint $table): void {
            $table->string('path')->nullable()->after('ip_address');
            $table->index('visited_at');
            $table->index(['ip_address', 'path', 'visited_at']);
        });
    }

    public function down(): void
    {
        Schema::table('visitors', function (Blueprint $table): void {
            $table->dropIndex(['ip_address', 'path', 'visited_at']);
            $table->dropIndex(['visited_at']);
            $table->dropColumn('path');
        });
    }
};
