const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');
const productController = require('../controllers/productsController');

const router = express.Router();

router.use(viewsController.alerts);

/**authentication and authorization------------------------------------ */
//checks to see if logged in to render conditionally
router.get('/', authController.isLoggedIn, viewsController.getHome);
//login
router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
//signup
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
/**---------------------------------------------------------------------------------- */

/**user------------------------------------------------------------------------------- */
router.get('/me', authController.protect, viewsController.getAccount);

router.get(
  '/users',
  authController.protect,
  authController.restrictTo('admin'),
  authController.isLoggedIn,
  viewsController.getUsers
);
router.get(
  '/user/:slug',
  authController.protect,
  authController.restrictTo('admin'),
  authController.isLoggedIn,
  viewsController.getUser
);
/**------------------------------------------------------------------------------------- */

/**products------------------------------------------------------------------------------- */
router.get(
  '/createproduct',
  authController.isLoggedIn,
  viewsController.createProduct
);

router.get('/top-products', productController.aliasTopProducts);

router.get('/products', authController.isLoggedIn, viewsController.getProducts);
router.get(
  '/product/:slug',
  authController.isLoggedIn,
  viewsController.getProduct
);
/**----------------------------------------------------------------------------------------- */

router.get(
  '/cart',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getCart
);

/**orders----------------------------------------------------------------------------------- */

router.get(
  '/orders',
  authController.isLoggedIn,
  authController.protect,
  authController.restrictTo('admin'),
  viewsController.getOrders
);

router.get(
  '/order/:id',
  authController.isLoggedIn,
  authController.protect,
  viewsController.getOrder
);

router.get(
  '/my-orders',
  authController.isLoggedIn,
  authController.protect,
  authController.restrictTo('user'),
  viewsController.getMyOrders
);

router.get('/checkout', authController.isLoggedIn, viewsController.getCheckout);

// router.get('/add-to-cart', authController.isLoggedIn, viewsController.);

// router.get('/reviews', viewsController.getReviewForm);

// router.get(
//   '/my-bookings',
//   authController.protect,
//   viewsController.getMyBookings
// );

// router.post(
//   '/submit-user-data',
//   authController.protect,
//   viewsController.updateUserData
// );

module.exports = router;
