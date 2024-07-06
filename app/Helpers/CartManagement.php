<?php

namespace App\Helpers;

use App\Models\Product;
use Illuminate\Support\Facades\Cookie;

/**
 * Class CartManagement
 *
 * This class is responsible for managing the cart items.
 * It provides methods to add, remove, and update cart items.
 */
class CartManagement
{
    /**
     * Adds an item to the cart.
     *
     * @param  int  $product_id  The ID of the product to be added to the cart.
     * @return int The total number of items in the cart after the addition.
     */
 public static function addItemsToCart($product_id,$qty=1)
    {
        $cart_items = self::getCartItemsFromCookie();
        $existing_item = null;
        foreach ($cart_items as $key => $item) {
            if ($item['product_id'] == $product_id) {
                $existing_item = $key;
                break;
            }

        }

        if ($existing_item !== null) {
            $cart_items[$existing_item]['quantity'] = $qty;
            $cart_items[$existing_item]['total_amount'] = $cart_items[$existing_item]['quantity'] *
            $cart_items[$existing_item]['unit_amount'];
        } else {
            $product = Product::where('id', $product_id)->first(['id', 'name', 'price', 'images']);
            if ($product) {
                $cart_items[] = [
                    'product_id' => $product_id,
                    'name' => $product->name,
                    'image' => $product->images[0],
                    'quantity' => $qty,
                    'unit_amount' => $product->price,
                    'total_amount' => $product->price,

                ];
            }
        }

        self::addCartItemsToCookie($cart_items);

        return count($cart_items);
    }

    /**
     * Removes an item from the cart.
     *
     * @param  int  $product_id  The ID of the product to be removed from the cart.
     * @return array The updated cart items after the removal.
     */
    public static function removeCartItem($product_id)
    {
        $cart_items = self::getCartItemsFromCookie();
        foreach ($cart_items as $key => $item) {
            if ($item['product_id'] == $product_id) {
                unset($cart_items[$key]);
            }
        }
        self::addCartItemsToCookie($cart_items);

        return $cart_items;
    }

    /**
     * Adds the cart items to the cookie.
     *
     * @param  array  $cart_items  The array of cart items to be added to the cookie.
     */
    static public function addCartItemsToCookie($cart_items)
    {
        Cookie::queue('cart_items', json_encode($cart_items), 60 * 23 * 30);
    }

    /**
     * Clears the cart items from the cookie.
     */
    static public function clearCartItems()
    {
        Cookie::queue(Cookie::forget('cart_items'));
    }

    /**
     * Retrieves the cart items from the cookie.
     *
     * @return array The array of cart items retrieved from the cookie.
     */
    static public function getCartItemsFromCookie()
    {
        $cart_items = json_decode(Cookie::get('cart_items'), true);
        if (!$cart_items) {
            $cart_items = [];
        }

        return $cart_items;
    }

    /**
     * Increment the quantity of a specific cart item.
     *
     * @param  int  $product_id  The ID of the product to increment the quantity of.
     */
    public static function incrementQuantityToCartItem($product_id)
    {
        $cart_items = self::getCartItemsFromCookie();

        foreach ($cart_items as $key => $item) {
            if ($item['product_id'] == $product_id) {
                $cart_items[$key]['quantity']++;
                $cart_items[$key]['total_amount'] = $cart_items[$key]['quantity'] * $cart_items[$key]
                ['unit_amount'];
            }
        }

        self::addCartItemsToCookie($cart_items);

        return $cart_items;

        // Implementation of incrementing the quantity of a specific cart item goes here.
    }

    static public function decrementQuantityToCartItem($product_id)
    {
        $cart_items = self::getCartItemsFromCookie();

        foreach ($cart_items as $key => $item) {
            if ($item['product_id'] == $product_id) {
                if ($cart_items[$key]['quantity'] > 1) {
                    $cart_items[$key]['quantity']--;
                    $cart_items[$key]['total_amount'] = $cart_items[$key]['quantity'] *
                    $cart_items[$key]['unit_amount'];
                }
            }
        }

        self::addCartItemsToCookie($cart_items);

        return $cart_items;

        // Implementation of decrementing the quantity of a specific cart item goes here.

    }

    static function calculateGrandTotal($items){
        return array_sum(array_column($items,'total_amount'));
    }
}
