const Movie = require("../models/model.movie");

async function getMovieById(movieid) {
    const movie = await Movie.findById(movieId);
    return movie;
}

async function getAllMovies() {
    const movies = await Movie.find();
    return movies;
}

async function createMovie(title, description, genre, language, coverImageUrl, durationInMinutes) {
    const movie = await Movie.create({
        title,
        description,
        genre,
        language,
        coverImageUrl,
        durationInMinutes
    });
    return movie;
}

async function findByIdAndUpdate(movieId, updateData) {
    const updatedMovie = await Movie.findByIdAndUpdate(
      movieId,
      updateData,
      { new: true, runValidators: true }
    );
}

async function deleteMovieById(movieId) {
    const movie = await Movie.deleteOne({ _id: movieId });
    return movie;
}

async function getAllMovieFromListOfMovieIds(movieIds) {
    const movies = await Movie.find({ _id: { $in: movieIds } });
    return movies;
}

module.exports = { getMovieById, getAllMovies, createMovie, findByIdAndUpdate, deleteMovieById, getAllMovieFromListOfMovieIds };