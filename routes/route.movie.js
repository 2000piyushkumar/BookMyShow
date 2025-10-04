const express = require('express');
const movieController = require('../controllers/controller.movie');
const movieHallMappingController = require('../controllers/controller.movieHallMapping');
const authenticateToken = require('../middlewares/middleware.authentication');
const authorizeUser = require('../middlewares/middleware.authorization');

const router = express.Router();

router.use(authenticateToken);

//Movies
router.get('/get-movies', movieController.getAllMovies);
router.get('/get-movie/:movieId', movieController.getMovieById);
router.post('/create-movie', authorizeUser('admin'), movieController.createMovie);
router.patch('/update-movie/:movieId', authorizeUser('admin'), movieController.updateMovie);
router.delete('/delete-movie/:movieId', authorizeUser('admin'), movieController.deleteMovie);

//MovieHallMapping
router.get('/:theatreHallId/get-movies', movieHallMappingController.getAllMoviesInHall);
router.get('/:movieId/get-halls', movieHallMappingController.getAllTheatreHallsForMovie)
router.get('/:theatreHallId/:movieId/get-shows', movieHallMappingController.getAllShowsForMovieInHall)
router.post('/:theatreHallId/:movieId/create-show', authorizeUser('admin'), movieHallMappingController.createShow);
router.patch('/:movieHallMappingId/update-show', authorizeUser('admin'), movieHallMappingController.updateShow);
router.delete('/:movieHallMappingId/delete-show', authorizeUser('admin'), movieHallMappingController.deleteShow);

module.exports = router;