<?php

namespace App\Notifications;

use App\Models\Order;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class OrderStatusChangedNotification extends Notification implements ShouldQueue
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
        $label = $this->order->status->label();

        return (new MailMessage)
            ->subject('Order '.$this->order->number.': '.$label)
            ->greeting('Hello, '.$notifiable->name.'.')
            ->line('Your order is now '.strtolower($label).'.')
            ->line('Order: '.$this->order->number)
            ->action('View your order', route('orders.show', $this->order->id))
            ->line('Thank you for shopping with SHOPIT.');
    }
}
