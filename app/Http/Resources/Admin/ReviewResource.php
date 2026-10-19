<?php

namespace App\Http\Resources\Admin;

use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin Review
 */
class ReviewResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'rating' => $this->rating,
            'title' => $this->title,
            'body' => $this->body,
            'is_approved' => $this->is_approved,
            'created_at' => $this->created_at?->toIso8601String(),
            'product' => $this->whenLoaded('product', fn (): ?array => $this->product === null
                ? null
                : $this->product->only(['id', 'name', 'slug'])),
            'user' => $this->whenLoaded('user', fn (): ?array => $this->user === null
                ? null
                : $this->user->only(['id', 'name', 'email'])),
        ];
    }
}
