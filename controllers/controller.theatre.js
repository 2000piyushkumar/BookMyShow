const { z } = require('zod'); 
const theatreService = require('../services/service.theatre');
const theatreHallService = require('../services/service.theatreHall');
const movieHallMappingService = require('../services/service.movieHallMapping');

const createTheatreValidatonSchema = z.object({
    name : z.string().min(3).max(50),
    zipcode : z.string().length(6),
    city : z.string(),
    state : z.string(),
    country : z.string(),
    additionalAddress : z.string(),
    lattitude : z.number(),
    longitude : z.number()
});

async function getAllTheatres(req, res) {
    try {
        const theatres = await theatreService.getAllTheatres();
        return res.json( {data: theatres });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function getTheatreById(req, res) {
    try {
        const theatreId = req.params.theatreId;
        const theatre = await theatreService.getTheatreById(theatreId);

        if (!theatreId){
            return res.status(404).json({ error: 'Theatre is not found.' });
        }
        return res.json( { data: theatre });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function createTheatre(req, res) {
    const theatreData = await createTheatreValidatonSchema.parseAsync(req.body);

    if (theatreData.error) {
        return res.status(400).json({ error: theatreData.error });
    }
    
    const theatre = await theatreService.createTheatre(
        theatreData.name,
        theatreData.zipcode,
        theatreData.city,
        theatreData.state,
        theatreData.country,
        theatreData.additionalAddress,
        theatreData.lattitude,
        theatreData.longitude
    );

    res.status(201).json({ status: 'success', data: theatre });
}

async function updateTheatre(req, res) {
  try {
    const theatreId = req.params.theatreId;
    if (!theatreId){
        return res.status(404).json({ error: 'Theatre is not found.' });
    }    
    const updateData = req.body;
    
    const updatedTheatre = await theatreService.findByIdAndUpdate(
      theatreId,
      updateData,
    );

    if (!updatedTheatre) {
      return res.status(404).json({ error: 'Theatre not found' });
    }

    res.status(200).json({message: 'Theatre Updated Successfully', data: updatedTheatre});
  } catch (err) {
    res.status(500).json({ error: 'Server Error' });
  }
}

async function deleteTheatre(req, res) {
    try {
        const theatreId = req.params.theatreId;
        if (!theatreId){
            return res.status(404).json({ error: 'Theatre is not found.' });
        } 
      
        const theatre = await theatreService.deleteTheatreById(theatreId);
        const theatreHalls = await theatreHallService.findTheatreHallsByTheatreId(theatreId);
        const theatreHallIds = theatreHalls.map(hall => hall._id);
        const deletedTheatreHalls = await theatreHallService.deleteTheatreHallsByTheatreId(theatreId);
        const deletedShows = await movieHallMappingService.deleteAllShowsFromListofTheatreHalls(theatreHallIds);

        return res.status(201).json( { status: 'deleted theatre successfully', data: theatre, deletedTheatreHalls: deletedTheatreHalls, deletedShows: deletedShows });
    }
    catch {
        res.status(500).json({ error: 'Server Error' });
    }
}

module.exports = { getAllTheatres, getTheatreById, createTheatre, updateTheatre, deleteTheatre };