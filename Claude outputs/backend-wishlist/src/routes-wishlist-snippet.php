// 1) At the top of src/routes.php, with the other "use" lines:
use App\Controllers\WishlistController;

// 2) In the "Users: /api/users" block, next to the addresses routes:
$router->get('/users/me/wishlist',                [WishlistController::class, 'index'], 'auth');
$router->post('/users/me/wishlist',               [WishlistController::class, 'store'], 'auth');
$router->delete('/users/me/wishlist/{productId}', [WishlistController::class, 'destroy'], 'auth');
