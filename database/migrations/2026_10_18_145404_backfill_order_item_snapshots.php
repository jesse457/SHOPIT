<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('order_items')
            ->orderBy('id')
            ->chunkById(200, function ($items): void {
                foreach ($items as $item) {
                    /** @var stdClass $item */
                    $product = DB::table('products')
                        ->where('id', $item->product_id)
                        ->first(['name', 'images']);

                    if (! $product) {
                        continue;
                    }

                    $images = json_decode((string) ($product->images ?? '[]'), true);
                    $image = is_array($images) ? ($images[0] ?? null) : null;

                    DB::table('order_items')
                        ->where('id', $item->id)
                        ->update([
                            'product_name' => $item->product_name ?? $product->name,
                            'product_image' => $item->product_image ?? $image,
                        ]);
                }
            });
    }

    public function down(): void
    {
        // Snapshots are intentionally retained so order history survives
        // product edits and deletions.
    }
};
