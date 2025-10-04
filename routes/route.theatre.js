const express = require('express');
const theatreController = require('../controllers/controller.theatre');
const hallController = require('../controllers/controller.theatreHall');
const authenticateToken = require('../middlewares/middleware.authentication');
const authorizeUser = require('../middlewares/middleware.authorization');

const router = express.Router();

router.use(authenticateToken);

//Theatre
router.get('/get-theatres', theatreController.getAllTheatres);
router.get('/get-theatre/:theatreId', theatreController.getTheatreById);
router.post('/create-theatre', authorizeUser('admin'), theatreController.createTheatre);
router.patch('/update-theatre/:theatreId', authorizeUser('admin'), theatreController.updateTheatre);
router.delete('/delete-theatre/:theatreId', authorizeUser('admin'), theatreController.deleteTheatre);

//Theatre Halls
router.get('/:theatreId/get-theatreHalls', hallController.getAllTheatreHalls);
router.get('/get-theatreHall/:theatreHallId', hallController.getTheatreHallById);
router.post('/:theatreId/create-theatreHall', authorizeUser('admin'), hallController.createTheatreHall);
router.patch('/update-theatreHall/:theatreHallId', authorizeUser('admin'), hallController.updateTheatreHall);
router.delete('/delete-theateHall/:theatreHallId', authorizeUser('admin'), hallController.deleteTheatreHall);

module.exports = router;