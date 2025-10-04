const express = require('express');
const bookingController = require('../controllers/controller.booking');
const authenticateToken = require('../middlewares/middleware.authentication');
const authorizeUser = require('../middlewares/middleware.authorization');

const router = express.Router();
router.use(authenticateToken);

router.get('/get-user_bookings', authorizeUser('user'), bookingController.getBookingsByUser)
router.post('/create-order', authorizeUser('user'), bookingController.createOrder);
router.post('/create-booking', authorizeUser('user'), bookingController.createBooking);

module.exports = router;