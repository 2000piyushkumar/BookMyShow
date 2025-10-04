const crypto = require('crypto');
const Razorpay = require('razorpay');
const { z } = require('zod');
const bookingService = require('../services/service.booking');
const movieHallMappingService = require('../services/service.movieHallMapping');
const theatreHallService = require('../services/service.theatreHall');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY
})

const orderCreationValidationSchema = z.object({
    movieHallMappingId: z.string(),
    seatNumber: z.number().min(1)
});

const bookingCreationValidationSchema = z.object({
    razorpayPaymentId: z.string(),
    razorpayOrderId: z.string(),
    razorpaySignature: z.string(),
    movieHallMappingId: z.string(),
    seatNumber: z.number().min(1)
});

async function createOrder(req, res) {
    try {
        const orderData = await orderCreationValidationSchema.parseAsync(req.body);
        if (orderData.error) {
            return res.status(400).json({ error: orderData.error });
        }

        const { movieHallMappingId, seatNumber } = orderData;
        const movieHallMapping = await movieHallMappingService.getShowById(movieHallMappingId);
        if (!movieHallMapping) {
            return res.status(404).json({ error: 'MovieHallMapping not found' });
        }

        if (movieHallMapping.startTimestamp * 1000 <= Date.now()){
            return res.status(400).json({ error: 'Movie has already started' });
        }

        const theatreHall = await theatreHallService.getTheatreHallById(movieHallMapping.theatreHallId);
        if (seatNumber > theatreHall.seatingCapacity) {
            return res.status(400).json( {error: 'Seating number is greater than Seating Capacity' });
        }

        const alreadyBooked = await bookingService.getBookingForAShowAndSeatNumber(movieHallMappingId, seatNumber);
        if (alreadyBooked){
            return res.status(400).json({ error: 'Seat has already booked.'});
        }

        const order = await razorpay.orders.create({
            amount: 100 * movieHallMapping.price,
            currency: 'INR',
        })
        res.status(200).json({ order: order });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function createBooking(req, res) {
    try {
        const bookingData = await bookingCreationValidationSchema.parseAsync(req.body);
        if (bookingData.error) {
            return res.status(400).json({ error: bookingData.error });
        }
    
        const { razorpayPaymentId, razorpayOrderId, razorpaySignature, movieHallMappingId, seatNumber } = bookingData;

        const payload = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_SECRET_KEY)
                                .update(payload)
                                .digest('hex');

        if (expectedSignature !==  razorpaySignature) {
            return res.status(400).json( { error: 'Payment not confirmed' } );
        }

        const paymentInfo = await razorpay.payments.fetch(razorpayPaymentId);
        if (paymentInfo.status !== 'captured') {
            return res.status(400).json( { error: 'Payment is not Captured.' } );
        }
        try {
            const booking = await bookingService.createBooking(
                req.user.userId,
                movieHallMappingId,
                seatNumber,
                razorpayPaymentId
            );
        }
        catch {
            await razorpay.payments.refund(razorpayPaymentId, {
                amount: paymentInfo.amount
            });
        }

        res.status(200).json( { booking: booking });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function getBookingsByUser(req, res) {
    try {
        const userId = req.user.userId;
        const bookings = bookingService.getBookingsOfUser(userId);
        res.status(200).json({ bookings: bookings });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

module.exports = { createOrder, createBooking, getBookingsByUser };