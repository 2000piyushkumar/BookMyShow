const { z } = require('zod'); 
const movieHallMappingService = require('../services/service.movieHallMapping');
const movieService = require('../services/service.movie');
const theatreHallService = require('../services/service.theatreHall');

const createMovieHallMappingValidationSchema = z.object({
    price: z.number(),
    startTimestamp: z.number(),
    endTimestamp: z.number()
});

async function getAllMoviesInHall(req, res) {
    try {
        const theatreHallId = req.params.theatreHallId;
        if (!theatreHallId) {
            return res.status(404).json( {error: 'Theatre Hall is not found.' });
        }

        const movieIds = await movieHallMappingService.getDistinctMovieIdsOfShowsInTheatreHall(theatreHallId);
        const movies = await movieService.getAllMovieFromListOfMovieIds(movieIds);
        res.status(201).json( {data: movies} );
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function getAllTheatreHallsForMovie(req, res) {
    try {
        const movieId = req.params.movieId;
        if (!movieId) {
            return res.status(404).json( {error: 'Movie is not found.' });
        }

        const theatreHallIds = await movieHallMappingService.getDistinctTheatreHallsForMovie(movieId);
        const theatreHalls = await theatreHallService.getAllTheatreHallsFromTheatreHallIdList(theatreHallIds);
        res.status(201).json( {data: theatreHalls} );
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function getAllShowsForMovieInHall(req, res) {
    try {
        const movieId = req.params.movieId;
        if (!movieId) {
            return res.status(404).json( {error: 'Movie is not found.' });
        }

        const theatreHallId = req.params.theatreHallId;
        if (!theatreHallId) {
            return res.status(404).json( {error: 'Theatre Hall is not found.' });
        }

        const movieHallMappings = await movieHallMappingService.getAllShowsForMovieInHall(movieId, theatreHallId);

        if (!movieHallMappings || movieHallMappings.length === 0) {
        return res.status(404).json({ error: "No shows found for this movie in this hall." });
        } 
        
        res.status(201).json( {data: movieHallMappings} );
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function createShow(req, res) {
    try {
        const movieId = req.params.movieId;
        if (!movieId) {
            return res.status(404).json( {error: 'Movie is not found.' });
        }

        const theatreHallId = req.params.theatreHallId;
        if (!theatreHallId) {
            return res.status(404).json( {error: 'Theatre Hall is not found.' });
        }

        const { price, startTimestamp, endTimestamp } = await createMovieHallMappingValidationSchema.parseAsync(req.body);

        if (startTimestamp >= endTimestamp) {
            return res.status(400).json({ error: "Start time must be before end time." });
        }

        const clash = await MovieHallMapping.findOne({
            theatreHallId:theatreHallId,
            startTimestamp: { $lt: endTimestamp },
            endTimestamp: { $gt: startTimestamp }
        });

        if (clash) {
            return res.status(400).json({
                error: "Show time clashes with an existing show.",
                existingShow: clash
            });
        }

        const newShow = await movieHallMappingService.createShow(
            movieId,
            theatreHallId,
            price,
            startTimestamp,
            endTimestamp
        );

        res.status(201).json({ status: 'successfully created show', data: newShow });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function updateShow(req, res) {
  try {
    const movieHallMappingId = req.params.movieHallMappingId;
    if (!movieHallMappingId) {
      return res.status(400).json({ error: 'movieHallMappingId is required.' });
    }

    const updateData = req.body;

    if (updateData?.movieId) {
      const movieExists = await movieService.getMovieById(updateData.movieId);
      if (!movieExists) {
        return res.status(400).json({ error: 'Invalid movieId provided.' });
      }
    }

    if (updateData?.theatreHallId) {
      const hallExists = await theatreHallService.getTheatreHallById(updateData.theatreHallId);
      if (!hallExists) {
        return res.status(400).json({ error: 'Invalid theatreHallId provided.' });
      }
    }

    if (updateData?.startTimestamp && updateData?.endTimestamp) {
        const theatreHallId = updateData.theatreHallId
        ? updateData.theatreHallId
        : (await movieHallMappingService.getShowById(movieHallMappingId))?.theatreHallId;

        if (!theatreHallId) {
        return res.status(400).json({ error: 'Theatre hall not found for overlap check.' });
        }

        const clash = await movieHallMappingService.getShowWithValidStartAndEndTime(
            theatreHallId,
            updateData.endTimestamp,
            updateData.startTimestamp
        );

        if (clash) {
            return res.status(400).json({ error: 'Show timing overlaps with an existing show.' });
        }
    }

    const updatedShow = await movieHallMappingService.findByIdAndUpdate(
      movieHallMappingId,
      updateData
    );

    if (!updatedShow) {
      return res.status(404).json({ error: 'Movie Show not found.' });
    }

    res.status(200).json({ message: 'Movie Show updated successfully', data: updatedShow });

  } 
  catch {
    res.status(500).json({ error: 'Server Error.' });
  }
}

async function deleteShow(req, res) {
    try {
        const movieHallMappingId = req.params.movieHallMappingId;
        if (!movieHallMappingId) {
            return res.status(404).json( {error: 'Movie Show not found.' });
        }
        
        const deletedShow = await movieHallMappingService.deleteShowByid(movieHallMappingId);

        res.status(200).json({message: 'Movie Show Deleted Successfully', data: deletedShow});
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

module.exports = { getAllMoviesInHall, getAllTheatreHallsForMovie, getAllShowsForMovieInHall, createShow, updateShow, deleteShow };