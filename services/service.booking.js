const Booking = require('../models/model.booking');

async function getBookingForAShowAndSeatNumber() {
    const booking = await Booking.findOne({ movieHallMappingId, seatNumber });
    return booking;
}

async function createBooking(userId, movieHallMappingId, seatNumber, paymentId) {
    const booking = await Booking.create({
        userId,
        movieHallMappingId,
        seatNumber,
        paymentId
    });
    return booking;
}

async function getBookingsOfUser(userId) {
    const bookings = await Booking.find({userId: userId});
    return bookings;
}

module.exports = {getBookingForAShowAndSeatNumber, createBooking, getBookingsOfUser};