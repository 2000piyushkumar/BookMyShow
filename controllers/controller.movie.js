const { z } = require('zod'); 
const movieService = require('../services/service.movie');
const movieHallMappingService = require('../services/service.movieHallMapping');

const createMovieValidationSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(3),
    genre: z.string(),
    language: z.string(),
    coverImageUrl: z.string().url(),
    durationInMinutes: z.number()
});

async function getAllMovies(req, res) {
    try {
        const movies = await movieService.getAllMovies();
        return res.status(201).json( { data: movies });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function getMovieById(req, res) {
    try {
        const movieId = req.params.movieId;
        if (!movieId) {
            return res.status(404).json({ error: 'Movie is not found.' });
        }
        
        const movie = await movieService.getMovieById(movieId);
        return res.json( {data: movie });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function createMovie(req, res) {
    try {
        const movieData = await createMovieValidationSchema.parseAsync(req.body);

        if (movieData.error) {
            return res.status(400).json({ error: movieData.error });
        }

        const movie = await movieService.createMovie(
            movieData.title,
            movieData.description,
            movieData.genre,
            movieData.language,
            movieData.coverImageUrl,
            movieData.durationInMinutes
        );

        res.status(201).json({ status: 'success', data: movie });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function updateMovie(req, res) {
  try {
    const movieId = req.params.movieId;
    if (!movieId) {
        return res.status(404).json({ error: 'Movie is not found.' });
    }
    const updateData = req.body;
    
    const updatedMovie = await movieService.findByIdAndUpdate(
      movieId,
      updateData
    );

    if (!updatedMovie) {
      return res.status(404).json({ error: 'Movie is not found' });
    }

    res.status(200).json({message: 'Movie Updated Successfully', data: updatedMovie});
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
}

async function deleteMovie(req, res) {
    try {
        const movieId = req.params.movieId;
        if (!movieId) {
            return res.status(404).json({ error: 'Movie is not found.' });
        }
        const movie = await movieService.deleteMovieById(movieId);
        const deletedShow = await movieHallMappingService.deleteShowsOfMovie(movieId);

        return res.status(201).json( {status: 'deleted movie successfully', data: movie, deletedShow: deletedShow });
    }
    catch {
        res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie };