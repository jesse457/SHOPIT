<?php

namespace App\Http\Resources\Storefront;

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
            'user_name' => $this->whenLoaded(
                'user',
                fn (): string => $this->user?->name ?? 'SHOPIT customer',
            ),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
