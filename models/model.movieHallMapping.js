const mongoose = require("mongoose");

const movieHallMappingSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
  },
  theatreHallId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TheatreHall',
  },
  price: {
    type: Number,
    required: true,
  },
  startTimestamp: {
    type: Number,
    required: true,
  },
  endTimestamp: {
    type: Number,
    required: true,
  },
},
{ timestamps: true }
);

const MovieHallMapping = mongoose.model('MovieHallMapping', movieHallMappingSchema);
module.exports = MovieHallMapping;