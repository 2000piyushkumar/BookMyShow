const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  movieHallMappingId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },  
  seatNumber: {
    type: Number,
    required: true,
  },
  paymentId: {
    type: String,
    required: true,
  }
},
{ timestamps: true }
);

bookingSchema.index({ movieHallMappingId: 1, seatNumber: 1 }, { unique: true });
const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;