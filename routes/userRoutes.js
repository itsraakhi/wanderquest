const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

// run isLoggedIn middleware for all the routes below
router.use(authController.isLoggedIn);

router.get('/my-account', userController.getUserDetails, userController.getUser);
router.patch('/update-details', userController.updateDetails);
router.patch('/update-password', authController.updatePassword);
router.delete('/delete-account', userController.deleteAccount);

// routes only for admins
router.use(authController.authorize('admin'));

router.route('/').get(userController.getAllUsers).post(userController.createUser);
router
	.route('/:id')
	.get(userController.getUser)
	.patch(userController.updateUser)
	.delete(userController.deleteUser);

module.exports = router;
