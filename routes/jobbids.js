const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllBids,
  createBid,
  deleteBid,
  updateBid,
  setBidUserId,
  getBid
} = require('../controllers/jobbidController');

const router = express.Router({ mergeParams: true });

router.use(protect);
router
  .route('/')
  .get(getAllBids)
  .post(restrictTo('user'), setBidUserId, createBid);

router
  .route('/:id')
  .get(getBid)
  .patch(restrictTo('user', 'admin'), updateBid)
  .delete(restrictTo('user', 'admin'), deleteBid);

module.exports = router;
