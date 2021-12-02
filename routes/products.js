const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router({ mergeParams: true });
const {
  getAllProducts,
  createProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  aliasTopProducts,
  getProductStats,
  uploadProductImages,
  resizeProductImages
} = require('../controllers/productsController');

const reviewRouter = require('./reviews');

//allow nested route
router.use('/:productId/reviews', reviewRouter);

router.route('/top-products').get(aliasTopProducts, getAllProducts);
router.route('/product-stats').get(getProductStats);

router
  .route('/')
  .get(getAllProducts)
  .post(
    protect,
    restrictTo('admin'),
    uploadProductImages,
    resizeProductImages,
    createProduct
  );

router
  .route('/:id')
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(protect, restrictTo('admin'), deleteProduct);

module.exports = router;
