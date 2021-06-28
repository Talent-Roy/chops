const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');
const {
  getAllNeighbourhoods,
  createNeighbourhood,
  getSingleNeighbourhood,
  updateNeighbourhood,
  deleteNeighbourhood,
  aliasTopNeighbourhoods,
  getNeighbourhoodStats,
  getNeighbourhoodsWithin,
  getDistances
} = require('../controllers/neighbourhoodController');

const neighbourhoodReviewRouter = require('./neighbourhoodReview');

const router = express.Router();

router.use('/:neighbourhoodId/reviews', neighbourhoodReviewRouter);
router
  .route('/top-neighbourhoods')
  .get(aliasTopNeighbourhoods, getAllNeighbourhoods);
router.route('/neighbourhood-stats').get(getNeighbourhoodStats);

router
  .route('/neighbourhoods-within/:distance/center/:latlng/unit/:unit')
  .get(getNeighbourhoodsWithin);
// /neighbourhoods-within?distance=233&center=-40,45&unit=mi 👎
// /neighbourhoods-within/233/center/-40,45/unit/mi  👍

router.route('/distances/:latlng/unit/:unit').get(getDistances);

router
  .route('/')
  .get(getAllNeighbourhoods)
  .post(
    protect,
    restrictTo('user', 'supervisor', 'admin'),
    createNeighbourhood
  );

router
  .route('/:id')
  .get(getSingleNeighbourhood)
  .patch(
    protect,
    restrictTo('user', 'staff', 'supervisor', 'admin'),
    updateNeighbourhood
  )
  .delete(
    protect,
    restrictTo('user', 'staff', 'supervisor', 'admin'),
    deleteNeighbourhood
  );

module.exports = router;
