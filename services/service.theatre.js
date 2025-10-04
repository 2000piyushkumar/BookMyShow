const Theatre = require("../models/model.theatre");

async function getAllTheatres() {
    const theatre = await Theatre.find();
    return theatre;
}

async function getTheatreById(theatreId) {
    const theatre = await Theatre.findOne({ _id: theatreId })
    return theatre;
}

async function createTheatre(name, zipcode, city, state, country, additionalAddress, lattitude, longitude) {
    const theatre = await Theatre.create({
            name,
            zipcode,
            city,
            state,
            country,
            additionalAddress,
            lattitude,
            longitude
        });
    return theatre;
}

async function findByIdAndUpdate(theatreId, updateData) {
    const theatre = await Theatre.findByIdAndUpdate(
      theatreId,
      updateData,
      { new: true, runValidators: true }
    );
    return theatre;
}

async function deleteTheatreById(theatreId) {
    const theatre = await Theatre.deleteOne({ _id: theatreId });
    return theatre;
}

module.exports = { getAllTheatres, getTheatreById, createTheatre, findByIdAndUpdate, deleteTheatreById };