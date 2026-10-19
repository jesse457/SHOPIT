<?php

namespace App\Http\Resources\Admin;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * @mixin User
 */
class CustomerResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'is_admin' => $this->is_admin,
            'email_verified_at' => $this->email_verified_at?->toIso8601String(),
            'orders_count' => $this->whenCounted('orders'),
            'created_at' => $this->created_at?->toIso8601String(),
        ];
    }
}
