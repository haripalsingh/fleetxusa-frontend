<?php
declare(strict_types=1);

/**
 * All API routes. Access: public | optional | auth | admin
 * @var App\Core\Router $router
 */

use App\Controllers\AdminController;
use App\Controllers\AuthController;
use App\Controllers\CartController;
use App\Controllers\CategoryController;
use App\Controllers\CouponController;
use App\Controllers\OrderController;
use App\Controllers\PaymentController;
use App\Controllers\ProductController;
use App\Controllers\UserController;
use App\Controllers\WishlistController;

// ---- Health ------------------------------------------------------------------
$router->get('/', [AdminController::class, 'health']);

// ---- Auth: /api/auth ---------------------------------------------------------
$router->post('/auth/register',        [AuthController::class, 'register']);
$router->post('/auth/login',           [AuthController::class, 'login']);
$router->post('/auth/verify-otp',      [AuthController::class, 'verifyOtp']);
$router->post('/auth/resend-otp',      [AuthController::class, 'resendOtp']);
$router->post('/auth/forgot-password', [AuthController::class, 'forgotPassword']);
$router->post('/auth/reset-password',  [AuthController::class, 'resetPassword']);
$router->get('/auth/me',               [AuthController::class, 'me'], 'auth');
$router->post('/auth/logout',          [AuthController::class, 'logout'], 'auth');

// ---- Categories: /api/categories -----------------------------------------------
$router->get('/categories',               [CategoryController::class, 'index'], 'optional');
$router->get('/categories/{id}',          [CategoryController::class, 'show'], 'optional');
$router->post('/categories',              [CategoryController::class, 'store'], 'admin');
$router->put('/categories/{id}',          [CategoryController::class, 'update'], 'admin');
$router->delete('/categories/{id}',       [CategoryController::class, 'destroy'], 'admin');
$router->post('/categories/{id}/image',   [CategoryController::class, 'uploadImage'], 'admin');

// ---- Products: /api/products ---------------------------------------------------
$router->get('/products',                              [ProductController::class, 'index'], 'optional');
$router->get('/products/low-stock',                    [ProductController::class, 'lowStock'], 'admin');
$router->get('/products/{id}',                         [ProductController::class, 'show'], 'optional');
$router->post('/products',                             [ProductController::class, 'store'], 'admin');
$router->put('/products/{id}',                         [ProductController::class, 'update'], 'admin');
$router->delete('/products/{id}',                      [ProductController::class, 'destroy'], 'admin');
// images
$router->post('/products/{id}/images',                 [ProductController::class, 'uploadImages'], 'admin');
$router->put('/products/{id}/images/{imageId}',        [ProductController::class, 'updateImage'], 'admin');
$router->delete('/products/{id}/images/{imageId}',     [ProductController::class, 'deleteImage'], 'admin');
// variants + inventory
$router->post('/products/{id}/variants',               [ProductController::class, 'storeVariant'], 'admin');
$router->put('/products/variants/{variantId}',         [ProductController::class, 'updateVariant'], 'admin');
$router->delete('/products/variants/{variantId}',      [ProductController::class, 'deleteVariant'], 'admin');
$router->patch('/products/variants/{variantId}/stock', [ProductController::class, 'adjustStock'], 'admin');
$router->get('/products/variants/{variantId}/stock-history', [ProductController::class, 'stockHistory'], 'admin');

// ---- Cart: /api/cart (guest = X-Cart-Token header, user = Bearer token) ---------
$router->get('/cart',               [CartController::class, 'show'], 'optional');
$router->post('/cart/items',        [CartController::class, 'add'], 'optional');
$router->patch('/cart/items/{id}',  [CartController::class, 'update'], 'optional');
$router->delete('/cart/items/{id}', [CartController::class, 'remove'], 'optional');
$router->delete('/cart',            [CartController::class, 'clear'], 'optional');
$router->post('/cart/merge',        [CartController::class, 'merge'], 'auth');

// ---- Coupons: /api/coupons -------------------------------------------------------
$router->post('/coupons/validate',  [CouponController::class, 'validate'], 'optional');
$router->get('/coupons',            [CouponController::class, 'index'], 'admin');
$router->post('/coupons',           [CouponController::class, 'store'], 'admin');
$router->put('/coupons/{id}',       [CouponController::class, 'update'], 'admin');
$router->delete('/coupons/{id}',    [CouponController::class, 'destroy'], 'admin');

// ---- Orders: /api/orders -----------------------------------------------------------
$router->post('/orders',                    [OrderController::class, 'store'], 'optional');
$router->get('/orders',                     [OrderController::class, 'index'], 'auth');
$router->get('/orders/{number}',            [OrderController::class, 'show'], 'optional');
$router->post('/orders/{number}/cancel',    [OrderController::class, 'cancel'], 'optional');
$router->patch('/orders/{id}/status',       [OrderController::class, 'updateStatus'], 'admin');
$router->patch('/orders/{id}/payment',      [OrderController::class, 'updatePayment'], 'admin');

// ---- Payments: /api/payments -------------------------------------------------------
$router->get('/payments/methods',           [PaymentController::class, 'methods']);
$router->post('/payments/stripe/webhook',   [PaymentController::class, 'stripeWebhook']);
$router->post('/payments/{number}/retry',   [PaymentController::class, 'retry'], 'optional');

// ---- Users: /api/users -----------------------------------------------------------------
$router->get('/users/me',                   [UserController::class, 'me'], 'auth');
$router->put('/users/me',                   [UserController::class, 'updateMe'], 'auth');
$router->put('/users/me/password',          [UserController::class, 'changePassword'], 'auth');
$router->get('/users/me/addresses',         [UserController::class, 'addresses'], 'auth');
$router->post('/users/me/addresses',        [UserController::class, 'storeAddress'], 'auth');
$router->put('/users/me/addresses/{id}',    [UserController::class, 'updateAddress'], 'auth');
$router->delete('/users/me/addresses/{id}', [UserController::class, 'deleteAddress'], 'auth');
// wish list (logged-in customers)
$router->get('/users/me/wishlist',                [WishlistController::class, 'index'], 'auth');
$router->post('/users/me/wishlist',               [WishlistController::class, 'store'], 'auth');
$router->delete('/users/me/wishlist/{productId}', [WishlistController::class, 'destroy'], 'auth');
// admin: customers
$router->get('/users',                      [UserController::class, 'index'], 'admin');
$router->get('/users/{id}',                 [UserController::class, 'show'], 'admin');
$router->put('/users/{id}',                 [UserController::class, 'update'], 'admin');

// ---- Admin dashboard ---------------------------------------------------------------------
$router->get('/admin/dashboard',            [AdminController::class, 'dashboard'], 'admin');


// 1) At the top of src/routes.php, with the other "use" lines:
use App\Controllers\WishlistController;

// 2) In the "Users: /api/users" block, next to the addresses routes:
$router->get('/users/me/wishlist',                [WishlistController::class, 'index'], 'auth');
$router->post('/users/me/wishlist',               [WishlistController::class, 'store'], 'auth');
$router->delete('/users/me/wishlist/{productId}', [WishlistController::class, 'destroy'], 'auth');