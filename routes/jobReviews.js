const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setReviewsUserId,
  getReview
} = require('../controllers/jobReviewController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(getAllReviews)
  .post(restrictTo('user'), setReviewsUserId, createReview);

router
  .route('/:id')
  .get(getReview)
  .patch(restrictTo('user', 'admin'), updateReview)
  .delete(restrictTo('user', 'admin'), deleteReview);

module.exports = router;
