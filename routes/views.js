const express = require('express');
const viewsController = require('../controllers/viewsController');
const authController = require('../controllers/authController');

const router = express.Router();

router.use(viewsController.alerts);

//checks to see if logged in to render conditionally
router.get('/', authController.isLoggedIn, viewsController.getHome);

router.get('/login', authController.isLoggedIn, viewsController.getLoginForm);
router.get('/signup', authController.isLoggedIn, viewsController.getSignupForm);
router.get('/job/:slug', authController.isLoggedIn, viewsController.getJob);
router.get('/me', authController.protect, viewsController.getAccount);

router.get('/my-jobs', authController.protect, viewsController.getMyJobs);

router.post(
  '/submit-user-data',
  authController.protect,
  viewsController.updateUserData
);

module.exports = router;
