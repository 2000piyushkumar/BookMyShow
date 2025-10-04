const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    default: "Unknown",
  },
  language: {
    type: String,
    required: true,
  },
  coverImageUrl: {
    type: String,
    required: true,
  },
  durationInMinutes: {
    type: Number,
    required: true,
  },
},
{ timestamps: true }
);

movieSchema.index({ title: 1, language: 1}, { unique: true });
const Movie = mongoose.model('Movie', movieSchema);
module.exports = Movie;