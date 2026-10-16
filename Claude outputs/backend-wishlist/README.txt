WISH LIST - backend upload steps (GoDaddy / fleetxusa-backend)

1. phpMyAdmin -> fleetxusa database -> SQL tab -> run database/wishlist.sql
2. Upload src/Controllers/WishlistController.php to fleetxusa-backend/src/Controllers/
3. Edit fleetxusa-backend/src/routes.php and add the lines from src/routes-wishlist-snippet.php

Optional (block guest orders at the API too - matches the "login required to checkout" change):
   in routes.php change
     $router->post('/orders', [OrderController::class, 'store'], 'optional');
   to
     $router->post('/orders', [OrderController::class, 'store'], 'auth');
