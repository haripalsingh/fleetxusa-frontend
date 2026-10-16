<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Database;
use App\Core\HttpException;
use App\Core\Request;
use App\Core\Response;

/**
 * Logged-in customer's wish list. Stores product IDs only; the storefront loads the
 * product cards with GET /api/products?ids=1,2,3 (active products only).
 */
final class WishlistController
{
    private const MAX_ITEMS = 100;

    /** GET /api/users/me/wishlist  -> { product_ids: int[] } (newest first) */
    public function index(Request $r): void
    {
        Response::ok(['product_ids' => $this->ids((int) $r->user['id'])]);
    }

    /** POST /api/users/me/wishlist  { product_id } */
    public function store(Request $r): void
    {
        $uid = (int) $r->user['id'];
        $pid = (int) ($r->body()['product_id'] ?? 0);
        if ($pid <= 0 || !Database::value("SELECT id FROM products WHERE id = ? AND status = 'active'", [$pid])) {
            throw HttpException::validation(['product_id' => 'Product not found.']);
        }
        $exists = Database::value('SELECT 1 FROM wishlist_items WHERE user_id = ? AND product_id = ?', [$uid, $pid]);
        if (!$exists) {
            if ((int) Database::value('SELECT COUNT(*) FROM wishlist_items WHERE user_id = ?', [$uid]) >= self::MAX_ITEMS) {
                throw HttpException::conflict('Your wish list is full (' . self::MAX_ITEMS . ' items). Remove something first.');
            }
            Database::query('INSERT INTO wishlist_items (user_id, product_id) VALUES (?, ?)', [$uid, $pid]);
        }
        Response::ok(['product_ids' => $this->ids($uid)], 'Added to your wish list.');
    }

    /** DELETE /api/users/me/wishlist/{productId} */
    public function destroy(Request $r): void
    {
        $uid = (int) $r->user['id'];
        Database::query('DELETE FROM wishlist_items WHERE user_id = ? AND product_id = ?', [$uid, (int) $r->param('productId')]);
        Response::ok(['product_ids' => $this->ids($uid)], 'Removed from your wish list.');
    }

    /** @return int[] */
    private function ids(int $uid): array
    {
        return array_map('intval', array_column(Database::fetchAll(
            'SELECT product_id FROM wishlist_items WHERE user_id = ? ORDER BY created_at DESC, product_id DESC',
            [$uid]
        ), 'product_id'));
    }
}
