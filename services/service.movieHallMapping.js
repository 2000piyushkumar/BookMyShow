const MovieHallMapping = require("../models/model.movieHallMapping");

async function deleteAllShowsFromListofTheatreHalls(theatreHallIds) {
    const deletedShows = await MovieHallMapping.deleteMany({
        theatreHallId: { $in: theatreHallIds }
    });
    return deletedShows;
}

async function deleteShowsFromTheatreHall(theatreHallId) {
    const deletedShow = await MovieHallMapping.deleteMany({ theatreHallId: theatreHallId });
}

async function deleteShowsOfMovie(movieId) {
    const deletedShow = await MovieHallMapping.deleteMany({ movieId: movieId });
}

async function getDistinctMovieIdsOfShowsInTheatreHall(theatreHallId) {
    const movieIds = await MovieHallMapping.distinct('movieId', { theatreHallId: theatreHallId });
    return movieIds;
}

async function getDistinctTheatreHallsForMovie(movieId) {
    const theatreHallIds = await MovieHallMapping.distinct('theatreHallId', {movieId : movieId});
    return theatreHallIds;
}

async function getAllShowsForMovieInHall(movieId, theatreHallId) {
    const movieHallMappings = await MovieHallMapping.find({ movieId, theatreHallId })
    .populate("movieId")
    .populate("theatreHallId");
    return movieHallMappings;
}

async function createShow(movieId, theatreHallId, price, startTimestamp, endTimestamp) {
    const newShow = await MovieHallMapping.create({
        movieId,
        theatreHallId,
        price,
        startTimestamp,
        endTimestamp
    });
    return newShow;
}

async function getShowById(movieHallMappingId) {
    const movieHallMapping = await MovieHallMapping.findById(movieHallMappingId);
    return movieHallMapping;
}

async function getShowWithValidStartAndEndTime(theatreHallId, startTimestamp, endTimestamp) {
    const movieHallMapping = await MovieHallMapping.findOne({
        theatreHallId:theatreHallId,
        startTimestamp: { $lt: updateData.endTimestamp },
        endTimestamp: { $gt: updateData.startTimestamp }
    });
    return movieHallMapping;
}

async function findByIdAndUpdate(movieHallMappingId, updateData) {
    const updatedShow = await MovieHallMapping.findByIdAndUpdate(
      movieHallMappingId,
      updateData,
      { new: true, runValidators: true }
    );
    return updatedShow;
}

async function deleteShowByid(movieHallMappingId) {
    const deletedShow = await MovieHallMapping.deleteOne({_id:movieHallMappingId});
    return deletedShow;
}

module.exports = { deleteAllShowsFromListofTheatreHalls, deleteShowsFromTheatreHall, deleteShowsOfMovie, getDistinctMovieIdsOfShowsInTheatreHall, getDistinctTheatreHallsForMovie, getAllShowsForMovieInHall, createShow, getShowById, getShowWithValidStartAndEndTime, findByIdAndUpdate, deleteShowByid };