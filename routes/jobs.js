const express = require('express');
const { protect, restrictTo } = require('../controllers/authController');

const router = express.Router();
const {
  getAllJobs,
  createJob,
  getSingleJob,
  updateJob,
  deleteJob,
  aliasTopJobs,
  getJobStats,
  getJobsWithin,
  getDistances
} = require('../controllers/jobController');

const jobbidsRouter = require('./jobbids');

router.use('/:jobId/reviews', jobbidsRouter);
router.route('/top-jobs').get(aliasTopJobs, getAllJobs);
router.route('/job-stats').get(getJobStats);

router
  .route('/jobs-within/:distance/center/:latlng/unit/:unit')
  .get(getJobsWithin);
// /jobs-within?distance=233&center=-40,45&unit=mi 👎
// /jobs-within/233/center/-40,45/unit/mi  👍

router.route('/distances/:latlng/unit/:unit').get(getDistances);

//plumber
//lundry
//electrician
//capenter
//technician
//realtors

router
  .route('/')
  .get(getAllJobs)
  .post(createJob);

router
  .route('/:id')
  .get(getSingleJob)
  .patch(protect, restrictTo('staff', 'supervisor', 'admin'), updateJob)
  .delete(protect, restrictTo('supervisor', 'admin'), deleteJob);

module.exports = router;
