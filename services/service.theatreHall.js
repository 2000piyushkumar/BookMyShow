const TheatreHall = require("../models/model.theatreHall");

async function findTheatreHallsByTheatreId(theatreId) {
    const theatreHalls = await TheatreHall.find({ theatreId: theatreId });
    return theatreHalls;
}

async function deleteTheatreHallsByTheatreId(theatreId) {
    const deletedTheatreHalls = await TheatreHall.deleteMany({ theatreId: theatreId });
    return deletedTheatreHalls;
}

async function getTheatreHallById(theatreHallId) {
    const theatreHall = await TheatreHall.find({ _id: theatreHallId });
    return theatreHall;
}

async function createTheatreHall(number, seatingCapacity, theatreId) {
    const theatreHall = await TheatreHall.create({
        number,
        seatingCapacity,
        theatreId
    });
    return theatreHall;
}

async function findByIdAndUpdate(theatreHallId, updateData) {
    const theatreHall = await TheatreHall.findByIdAndUpdate(
        theatreHallId,
        updateData,
        { new: true, runValidators: true }
    );
    return theatreHall;
}

async function deleteTheatreHallById(theatreHallId) {
    const theatreHall = await TheatreHall.deleteOne({ _id: theatreHallId }); 
    return theatreHall;   
}

async function getAllTheatreHallsFromTheatreHallIdList(theatreHallIds) {
    const theatreHalls = await TheatreHall.find({_id: {$in: theatreHallIds} });
    return theatreHalls;
}

module.exports = { findTheatreHallsByTheatreId, deleteTheatreHallsByTheatreId, getTheatreHallById, createTheatreHall, findByIdAndUpdate, deleteTheatreHallById, getAllTheatreHallsFromTheatreHallIdList };