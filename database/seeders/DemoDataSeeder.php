<?php

namespace Database\Seeders;

use App\Enums\OrderStatus;
use App\Enums\PaymentMethod;
use App\Enums\PaymentStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    /**
     * @var array<int, array{slug: string, name: string, image: string}>
     */
    private array $categories = [
        [
            'slug' => 'apparel',
            'name' => 'Apparel',
            'image' => 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
        ],
        [
            'slug' => 'footwear',
            'name' => 'Footwear',
            'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
        ],
        [
            'slug' => 'accessories',
            'name' => 'Accessories',
            'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
        ],
        [
            'slug' => 'home-living',
            'name' => 'Home & Living',
            'image' => 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=80',
        ],
        [
            'slug' => 'technology',
            'name' => 'Technology',
            'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1200&q=80',
        ],
        [
            'slug' => 'beauty',
            'name' => 'Beauty',
            'image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
        ],
    ];

    /**
     * @var list<string>
     */
    private array $brands = [
        'Aster & Loom',
        'Northline',
        'Mara Studio',
        'Verve',
        'Atelier Sole',
        'Fieldwork',
        'Solace',
        'Terra House',
        'Aperture',
        'Lumen',
    ];

    /**
     * @var array<int, array<string, mixed>>
     */
    private array $products = [
        [
            'category' => 'apparel',
            'brand' => 'Aster & Loom',
            'name' => 'Linen Overshirt',
            'price' => 42000,
            'stock' => 18,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A relaxed overshirt cut from washed European linen. Soft from the first wear, with a patch pocket and a straight hem.',
        ],
        [
            'category' => 'apparel',
            'brand' => 'Northline',
            'name' => 'Merino Crew',
            'price' => 38500,
            'stock' => 24,
            'image' => 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Fine-gauge merino with a clean crew neck. Warm without bulk, and light enough to layer all year.',
        ],
        [
            'category' => 'apparel',
            'brand' => 'Aster & Loom',
            'name' => 'Pleated Trouser',
            'price' => 48000,
            'stock' => 12,
            'image' => 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A single-pleat trouser in a dry cotton twill. High rise, tapered leg, and a finish that holds its shape.',
        ],
        [
            'category' => 'apparel',
            'brand' => 'Mara Studio',
            'name' => 'Cotton Poplin Shirt',
            'price' => 29000,
            'stock' => 30,
            'image' => 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Crisp poplin with a soft collar and a slightly boxy body. The kind of shirt that works for work and everything after.',
        ],
        [
            'category' => 'apparel',
            'brand' => 'Northline',
            'name' => 'Wool Wrap Coat',
            'price' => 115000,
            'compare_at_price' => 135000,
            'stock' => 6,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A double-faced wool coat with a self-tie waist. Unlined, softly structured, and warm enough for the cold months.',
        ],
        [
            'category' => 'footwear',
            'brand' => 'Verve',
            'name' => 'Court Sneaker',
            'price' => 46000,
            'stock' => 22,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A low-profile leather sneaker on a slim rubber sole. Clean lines, cushioned insole, and no loud branding.',
        ],
        [
            'category' => 'footwear',
            'brand' => 'Atelier Sole',
            'name' => 'Leather Loafer',
            'price' => 72000,
            'stock' => 9,
            'image' => 'https://images.unsplash.com/photo-1560343090-f0409e92791a?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A hand-finished loafer in full-grain leather. Blake-stitched, leather-lined, and made to soften with wear.',
        ],
        [
            'category' => 'footwear',
            'brand' => 'Verve',
            'name' => 'Trail Runner',
            'price' => 58000,
            'stock' => 15,
            'image' => 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A light trail shoe with a grippy lug outsole and a breathable mesh upper. Built for weekend paths and city rain.',
        ],
        [
            'category' => 'footwear',
            'brand' => 'Fieldwork',
            'name' => 'Canvas High Top',
            'price' => 32000,
            'stock' => 28,
            'image' => 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Heavy cotton canvas, a vulcanised rubber sole and a padded collar. A simple high top that gets better scuffed.',
        ],
        [
            'category' => 'footwear',
            'brand' => 'Atelier Sole',
            'name' => 'Suede Chelsea Boot',
            'price' => 89000,
            'compare_at_price' => 99000,
            'stock' => 7,
            'image' => 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A clean Chelsea boot in water-resistant suede, with elastic gussets and a stacked leather heel.',
        ],
        [
            'category' => 'accessories',
            'brand' => 'Mara Studio',
            'name' => 'Leather Tote',
            'price' => 68000,
            'stock' => 10,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A generous everyday tote in vegetable-tanned leather. Fits a laptop, a water bottle and the rest of it.',
        ],
        [
            'category' => 'accessories',
            'brand' => 'Fieldwork',
            'name' => 'Canvas Weekender',
            'price' => 54000,
            'stock' => 14,
            'image' => 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A two-night bag in waxed canvas with leather handles and a wide zip opening. Built to be thrown in a car.',
        ],
        [
            'category' => 'accessories',
            'brand' => 'Northline',
            'name' => 'Wool Scarf',
            'price' => 22000,
            'stock' => 26,
            'image' => 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A soft lambswool scarf in a muted check. Wide enough to wrap, light enough to keep on indoors.',
        ],
        [
            'category' => 'accessories',
            'brand' => 'Solace',
            'name' => 'Minimal Watch',
            'price' => 95000,
            'stock' => 8,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A 38mm brushed steel watch with a matte dial and a sapphire crystal. Quiet, legible and made to be worn daily.',
        ],
        [
            'category' => 'accessories',
            'brand' => 'Solace',
            'name' => 'Sunglasses',
            'price' => 36000,
            'stock' => 20,
            'image' => 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A rounded acetate frame with polarised lenses and a comfortable keyhole bridge.',
        ],
        [
            'category' => 'home-living',
            'brand' => 'Terra House',
            'name' => 'Stoneware Vase',
            'price' => 18000,
            'stock' => 16,
            'image' => 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A hand-thrown stoneware vase with a speckled glaze. Wide enough for a loose branch, simple enough to stand alone.',
        ],
        [
            'category' => 'home-living',
            'brand' => 'Terra House',
            'name' => 'Cedar Candle',
            'price' => 12500,
            'stock' => 40,
            'image' => 'https://images.unsplash.com/photo-1602874801007-aa9b0e1b1e0a?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Cedar, vetiver and a little smoke in a reusable glass vessel. Around forty hours of burn time.',
        ],
        [
            'category' => 'home-living',
            'brand' => 'Aster & Loom',
            'name' => 'Linen Throw',
            'price' => 34000,
            'stock' => 13,
            'image' => 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A stonewashed linen throw with a hand-knotted fringe. Light in summer, layered in winter.',
        ],
        [
            'category' => 'home-living',
            'brand' => 'Terra House',
            'name' => 'Oak Serving Board',
            'price' => 26000,
            'stock' => 11,
            'image' => 'https://images.unsplash.com/photo-1594224457860-23bdb45f8e3d?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A solid oak board with a soft chamfer and a food-safe oil finish. For bread, cheese, or just the counter.',
        ],
        [
            'category' => 'home-living',
            'brand' => 'Terra House',
            'name' => 'Glass Carafe',
            'price' => 15500,
            'stock' => 0,
            'active' => false,
            'image' => 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A slim borosilicate carafe with a cork stopper. Holds a litre, fits a fridge door.',
        ],
        [
            'category' => 'technology',
            'brand' => 'Aperture',
            'name' => 'Meridian Headphones',
            'price' => 88000,
            'stock' => 17,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Closed-back headphones with a warm, balanced sound and memory-foam pads. Thirty hours per charge.',
        ],
        [
            'category' => 'technology',
            'brand' => 'Aperture',
            'name' => 'Field Speaker',
            'price' => 62000,
            'stock' => 21,
            'image' => 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A portable speaker with a woven shell and a surprisingly full low end. Splash resistant and easy to carry.',
        ],
        [
            'category' => 'technology',
            'brand' => 'Lumen',
            'name' => 'Arc Desk Lamp',
            'price' => 74000,
            'stock' => 12,
            'featured' => true,
            'image' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A dimmable desk lamp with a long steel arm and a warm, low-glare light. Built for late work and early mornings.',
        ],
        [
            'category' => 'technology',
            'brand' => 'Aperture',
            'name' => 'Compact Keyboard',
            'price' => 45000,
            'stock' => 25,
            'image' => 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A 75 percent mechanical keyboard with quiet switches and a solid aluminium case. Wired or wireless.',
        ],
        [
            'category' => 'technology',
            'brand' => 'Aperture',
            'name' => 'Travel Charger',
            'price' => 19000,
            'stock' => 0,
            'image' => 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A compact 65W charger with two USB-C ports and folding pins. One plug for a laptop and a phone.',
        ],
        [
            'category' => 'beauty',
            'brand' => 'Solace',
            'name' => 'Cedar Hand Wash',
            'price' => 9500,
            'stock' => 45,
            'image' => 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A gentle hand wash with cedar and bergamot, in a refillable amber bottle. Leaves hands soft, not squeaky.',
        ],
        [
            'category' => 'beauty',
            'brand' => 'Solace',
            'name' => 'Rose Body Oil',
            'price' => 14000,
            'stock' => 32,
            'image' => 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A light body oil of rosehip, jojoba and sweet almond. Absorbs quickly and leaves a quiet sheen.',
        ],
        [
            'category' => 'beauty',
            'brand' => 'Mara Studio',
            'name' => 'Clay Face Mask',
            'price' => 11500,
            'stock' => 27,
            'image' => 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=1200&q=80',
            'description' => 'A kaolin and green clay mask with a little chamomile. Ten minutes to a clearer, calmer face.',
        ],
        [
            'category' => 'beauty',
            'brand' => 'Solace',
            'name' => 'Lip Balm Duo',
            'price' => 6500,
            'stock' => 50,
            'image' => 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Two shea-based balms, one clear and one tinted. Unscented, in a pocket-friendly tin.',
        ],
        [
            'category' => 'beauty',
            'brand' => 'Terra House',
            'name' => 'Bath Salts',
            'price' => 8000,
            'stock' => 38,
            'image' => 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?auto=format&fit=crop&w=1200&q=80',
            'description' => 'Epsom and Himalayan salts with eucalyptus and rosemary. A generous jar for slow evenings.',
        ],
    ];

    public function run(): void
    {
        $this->seedUsers();
        $this->seedCatalog();
        $this->seedOrders();
    }

    private function seedUsers(): void
    {
        User::query()->updateOrCreate(
            ['email' => 'admin@shopit.test'],
            [
                'name' => 'Amina Nwosu',
                'password' => 'password',
                'is_admin' => true,
                'email_verified_at' => now(),
            ],
        );

        foreach ([
            ['email' => 'customer@shopit.test', 'name' => 'Ariane Tchoumi'],
            ['email' => 'nadia@shopit.test', 'name' => 'Nadia Fotso'],
            ['email' => 'kevin@shopit.test', 'name' => 'Kevin Mballa'],
            ['email' => 'claire@shopit.test', 'name' => 'Claire Ngo'],
        ] as $customer) {
            User::query()->updateOrCreate(
                ['email' => $customer['email']],
                [
                    'name' => $customer['name'],
                    'password' => 'password',
                    'is_admin' => false,
                    'email_verified_at' => now(),
                ],
            );
        }
    }

    private function seedCatalog(): void
    {
        foreach ($this->categories as $category) {
            Category::query()->updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => $category['name'],
                    'image' => $category['image'],
                    'is_active' => true,
                ],
            );
        }

        foreach ($this->brands as $brand) {
            Brand::query()->updateOrCreate(
                ['slug' => Str::slug($brand)],
                [
                    'name' => $brand,
                    'image' => null,
                    'is_active' => true,
                ],
            );
        }

        $categoryIds = Category::query()->pluck('id', 'slug');
        $brandIds = Brand::query()->pluck('id', 'name');

        foreach ($this->products as $index => $item) {
            $product = Product::query()->updateOrCreate(
                ['slug' => Str::slug($item['name'])],
                [
                    'category_id' => $categoryIds[$item['category']],
                    'brand_id' => $brandIds[$item['brand']],
                    'name' => $item['name'],
                    'images' => [$item['image']],
                    'description' => $item['description'],
                    'price' => $item['price'],
                    'compare_at_price' => $item['compare_at_price'] ?? null,
                    'is_active' => $item['active'] ?? true,
                    'is_featured' => $item['featured'] ?? false,
                    'in_stock' => ($item['stock'] ?? 0) > 0,
                    'on_sale' => isset($item['compare_at_price']),
                    'stock_quantity' => $item['stock'] ?? 0,
                    'low_stock_threshold' => 5,
                ],
            );

            DB::table('products')
                ->where('id', $product->id)
                ->update([
                    'created_at' => now()->subDays($index % 21),
                    'updated_at' => now(),
                ]);
        }
    }

    private function seedOrders(): void
    {
        if (Order::query()->exists()) {
            return;
        }

        $customers = User::query()->where('is_admin', false)->get();
        $catalog = Product::query()->where('is_active', true)->get();

        if ($customers->isEmpty() || $catalog->isEmpty()) {
            return;
        }

        for ($i = 0; $i < 24; $i++) {
            $createdAt = now()->subDays(350 - ($i * 14))->setTime(10 + ($i % 8), 15);
            $customer = $customers[$i % $customers->count()];
            $lineCount = 1 + ($i % 3);
            $lines = [];
            $subtotal = 0.0;

            for ($j = 0; $j < $lineCount; $j++) {
                $product = $catalog[($i * 3 + $j * 7) % $catalog->count()];
                $quantity = 1 + (($i + $j) % 2);
                $unitAmount = (float) $product->price;
                $totalAmount = $unitAmount * $quantity;
                $subtotal += $totalAmount;

                $lines[] = [
                    'product' => $product,
                    'quantity' => $quantity,
                    'unit_amount' => $unitAmount,
                    'total_amount' => $totalAmount,
                ];
            }

            $shipping = $subtotal >= (float) config('shop.shipping.free_threshold')
                ? 0.0
                : (float) config('shop.shipping.flat_rate');

            $paymentStatus = match (true) {
                $i % 9 === 0 => PaymentStatus::Pending,
                $i % 11 === 0 => PaymentStatus::Failed,
                default => PaymentStatus::Paid,
            };

            $isCancelled = $i % 13 === 0 || $paymentStatus === PaymentStatus::Failed;

            $status = $isCancelled
                ? OrderStatus::Cancelled
                : match (true) {
                    $i < 6 => OrderStatus::Delivered,
                    $i < 12 => OrderStatus::Shipped,
                    $i < 18 => OrderStatus::Processing,
                    default => OrderStatus::New,
                };

            if ($isCancelled && $paymentStatus === PaymentStatus::Paid) {
                $paymentStatus = PaymentStatus::Refunded;
            }

            $method = $i % 3 === 0
                ? PaymentMethod::CashOnDelivery
                : PaymentMethod::Stripe;

            $order = Order::query()->create([
                'user_id' => $customer->id,
                'grand_total' => $subtotal + $shipping,
                'payment_method' => $method,
                'payment_status' => $paymentStatus,
                'status' => $status,
                'currency' => 'XAF',
                'shipping_amount' => $shipping,
                'shipping_method' => 'standard',
                'notes' => null,
                'stripe_checkout_session_id' => $method === PaymentMethod::Stripe
                    ? 'cs_demo_'.$i.'_'.Str::random(12)
                    : null,
                'paid_at' => $paymentStatus === PaymentStatus::Paid
                    ? $createdAt->addHour()
                    : null,
                'expires_at' => $method === PaymentMethod::Stripe
                    && $paymentStatus === PaymentStatus::Pending
                    ? $createdAt->addMinutes((int) config('shop.orders.stripe_hold_minutes'))
                    : null,
                'stock_released_at' => $isCancelled ? $createdAt->addDay() : null,
            ]);

            DB::table('orders')
                ->where('id', $order->id)
                ->update([
                    'created_at' => $createdAt,
                    'updated_at' => $createdAt,
                ]);

            foreach ($lines as $line) {
                $order->items()->create([
                    'product_id' => $line['product']->id,
                    'product_name' => $line['product']->name,
                    'product_image' => $line['product']->images[0] ?? null,
                    'quantity' => $line['quantity'],
                    'unit_amount' => $line['unit_amount'],
                    'total_amount' => $line['total_amount'],
                ]);
            }

            $nameParts = explode(' ', $customer->name, 2);

            $order->address()->create([
                'first_name' => $nameParts[0],
                'last_name' => $nameParts[1] ?? '',
                'phone' => '+237 6'.fake()->numerify('## ### ###'),
                'street_address' => fake()->streetAddress(),
                'city' => fake()->randomElement(['Douala', 'Yaoundé', 'Bafoussam', 'Kribi']),
                'state' => fake()->randomElement(['Littoral', 'Centre', 'West', 'South']),
                'zip_code' => fake()->numerify('#####'),
            ]);
        }
    }
}
