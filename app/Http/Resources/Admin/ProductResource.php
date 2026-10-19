<?php

namespace App\Http\Resources\Admin;

use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Product
 */
class ProductResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'price' => (string) $this->price,
            'compare_at_price' => $this->compare_at_price !== null
                ? (string) $this->compare_at_price
                : null,
            'images' => $this->images ?? [],
            'images_url' => $this->images_url,
            'image_url' => $this->image_url,
            'category_id' => $this->category_id,
            'brand_id' => $this->brand_id,
            'category' => $this->whenLoaded('category', fn (): ?array => $this->category === null
                ? null
                : $this->category->only(['id', 'name', 'slug'])),
            'brand' => $this->whenLoaded('brand', fn (): ?array => $this->brand === null
                ? null
                : $this->brand->only(['id', 'name', 'slug'])),
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'in_stock' => $this->in_stock,
            'on_sale' => $this->on_sale,
            'stock_quantity' => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'is_low_stock' => $this->isLowStock(),
            'order_items_count' => $this->whenCounted('orderItems'),
            'created_at' => $this->created_at?->toIso8601String(),
            'updated_at' => $this->updated_at?->toIso8601String(),
        ];
    }
}
