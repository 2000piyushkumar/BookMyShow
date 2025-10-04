const mongoose = require("mongoose");

const theatreHallSchema = new mongoose.Schema({
  number: {
    type: Number,
    required: true,
  },
  seatingCapacity: {
    type: Number,
    required: true,
  },
  theatreId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theatre',
  }
},
{ timestamps: true }
);

theatreHallSchema.index({ number: 1, theatreId: 1}, { unique: true });
const TheatreHall = mongoose.model('TheatreHall', theatreHallSchema);
module.exports = TheatreHall;