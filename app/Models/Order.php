<?php

namespace App\Models;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use Database\Factories\OrderFactory;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Order extends Model
{
    /** @use HasFactory<OrderFactory> */
    use HasFactory;

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'coupon_id',
        'coupon_code',
        'grand_total',
        'payment_method',
        'payment_status',
        'status',
        'currency',
        'shipping_amount',
        'discount_amount',
        'shipping_method',
        'notes',
        'stripe_checkout_session_id',
        'paid_at',
        'expires_at',
        'stock_released_at',
    ];

    /**
     * @var array<string, mixed>
     */
    protected $attributes = [
        'status' => 'new',
        'payment_status' => 'pending',
        'currency' => 'XAF',
        'shipping_amount' => 0,
        'discount_amount' => 0,
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => OrderStatus::class,
            'payment_status' => PaymentStatus::class,
            'payment_method' => PaymentMethod::class,
            'grand_total' => 'decimal:2',
            'shipping_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'paid_at' => 'datetime',
            'expires_at' => 'datetime',
            'stock_released_at' => 'datetime',
        ];
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }

    public function address(): HasOne
    {
        return $this->hasOne(Address::class);
    }

    public function coupon(): BelongsTo
    {
        return $this->belongsTo(Coupon::class);
    }

    #[Scope]
    protected function paid(Builder $query): Builder
    {
        return $query->where('payment_status', PaymentStatus::Paid->value);
    }

    public function getNumberAttribute(): string
    {
        return $this->id === null
            ? 'Pending'
            : 'SH-'.str_pad((string) $this->id, 6, '0', STR_PAD_LEFT);
    }

    public function getStatusLabelAttribute(): string
    {
        return $this->status->label();
    }

    public function getPaymentStatusLabelAttribute(): string
    {
        return $this->payment_status->label();
    }

    public function getPaymentMethodLabelAttribute(): string
    {
        return $this->payment_method->label();
    }

    public function isPaid(): bool
    {
        return $this->payment_status === PaymentStatus::Paid;
    }

    public function isExpired(): bool
    {
        return $this->payment_status === PaymentStatus::Pending
            && $this->expires_at !== null
            && $this->expires_at->isPast();
    }

    public function canRetryPayment(): bool
    {
        return $this->payment_status === PaymentStatus::Pending
            && $this->status !== OrderStatus::Cancelled
            && $this->stock_released_at === null;
    }
}
