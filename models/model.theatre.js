const mongoose = require("mongoose");

const theatreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  zipcode: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  additionalAddress: {
    type: String,
    required: true,
  },
  lattitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  }
},
{ timestamps: true }
);

const Theatre = mongoose.model('Theatre', theatreSchema);
module.exports = Theatre;