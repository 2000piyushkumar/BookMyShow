const { z } = require('zod');
const theatreService = require('../services/service.theatre'); 
const theatreHallService = require('../services/service.theatreHall');
const movieHallMappingService = require('../services/service.movieHallMapping');

const createTheatreHallValidationSchema = z.object({
    number: z.number(),
    seatingCapacity: z.number()
});

async function getAllTheatreHalls(req, res) {
    try {
        const theatreId = req.params.theatreId;
        if (!theatreId) {
            return res.status(404).json({ error: 'Theatre is not found.' });
        }
        
        const theatreHalls = await theatreHallService.findTheatreHallsByTheatreId(theatreId);
        res.status(201).json({ data: theatreHalls });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function getTheatreHallById(req, res) {
    try {
        const theatreHallId = req.params.theatreHallId;
        if (!theatreHallId){
            return res.status(404).json({ error: 'Theatre Hall is not found.' });
        }
        
        const theatreHall = await theatreHallService.getTheatreHallById(theatreHallId);
        res.status(201).json({ data: theatreHall });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function createTheatreHall(req, res) {
    try {
        const theatreHallData = await createTheatreHallValidationSchema.parseAsync(req.body);
        if (theatreHallData.error) {
            return res.status(400).json({ error: theatreHallData.error });
        } 
        
        const theatreId = req.params.theatreId;
        if (!theatreId){
            return res.status(404).json({ error: 'Theatre is not found.' });
        }

        const theatreExists = await theatreService.getTheatreById(theatreId);
        if (!theatreExists) {
            return res.status(404).json({ error: 'Theatre not found in database.' });
        }       

        const theatreHall = await theatreHallService.createTheatreHall(
            theatreHallData.number,
            theatreHallData.seatingCapacity,
            theatreId
        );
        res.status(201).json({ data: theatreHall });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function updateTheatreHall(req, res) {
    try {
        const theatreHallId = req.params.theatreHallId;
        if (!theatreHallId){
            return res.status(404).json({ error: 'Theatre Hall is not found.' });
        }
        const updateData = req.body;
        
        const theatreHall = await theatreHallService.findByIdAndUpdate(
            theatreHallId,
            updateData,
        );
        res.status(201).json({ message: 'Theatre Updated Successfully', data: theatreHall });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

async function deleteTheatreHall(req, res) {
    try {
        const theatreHallId = req.params.theatreHallId;

        if (!theatreHallId){
            return res.status(404).json({ error: 'Theatre Hall is not found.' });
        }
        
        const theatreHall = await theatreHallService.deleteTheatreHallById(theatreHallId);
        const deletedShow = await movieHallMappingService.deleteShowsFromTheatreHall(theatreHallId);
        res.status(201).json({ status: 'deleted theatre successfully', data: theatreHall, deletedShow: deletedShow });
    }
    catch {
        res.status(500).json( { error: 'Server Error.' });
    }
}

module.exports = { getAllTheatreHalls, getTheatreHallById, createTheatreHall, updateTheatreHall, deleteTheatreHall };