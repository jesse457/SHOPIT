<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Number;

class OrderPlacedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public function __construct(public Order $order) {}

    /**
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Order '.$this->order->number.' received')
            ->greeting('Thank you, '.$notifiable->name.'.')
            ->line('We received your order and it is now with the store team.')
            ->line('Order: '.$this->order->number)
            ->line('Total: '.Number::currency(
                (float) $this->order->grand_total,
                $this->order->currency,
            ))
            ->line('Payment: '.$this->order->payment_method->label())
            ->action('View your order', route('orders.show', $this->order->id))
            ->line('We will let you know when its status changes.');
    }
}
