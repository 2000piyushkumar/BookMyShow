const express = require('express');

const { getAllUsers, signUpHandler, signInHandler, logOutHandler }  = require('../controllers/controller.user');
const authenticateToken = require('../middlewares/middleware.authentication');
const authorizeUser = require('../middlewares/middleware.authorization');

const router = express.Router();

router.get('/', authenticateToken, authorizeUser('admin'), getAllUsers);

router.post('/sign-up', signUpHandler);

router.post('/sign-in', signInHandler);

router.get('/log-out', logOutHandler);

module.exports = router;