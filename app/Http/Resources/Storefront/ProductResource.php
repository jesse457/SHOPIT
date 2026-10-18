<?php

namespace App\Http\Resources\Storefront;

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
            'images' => $this->images_url,
            'image_url' => $this->image_url,
            'category' => $this->whenLoaded('category', fn (): array => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ]),
            'brand' => $this->whenLoaded('brand', fn (): array => [
                'id' => $this->brand->id,
                'name' => $this->brand->name,
                'slug' => $this->brand->slug,
            ]),
            'is_active' => $this->is_active,
            'is_featured' => $this->is_featured,
            'in_stock' => $this->in_stock,
            'on_sale' => $this->on_sale,
            'stock_quantity' => $this->stock_quantity,
            'low_stock_threshold' => $this->low_stock_threshold,
            'is_low_stock' => $this->isLowStock(),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
