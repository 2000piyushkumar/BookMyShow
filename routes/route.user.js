const express = require('express');

const { getAllUsers, signUpHandler, signInHandler }  = require('../controllers/controller.user');
const authenticateToken = require('../middlewares/middleware.authentication');

const router = express.Router();

router.get('/', authenticateToken, getAllUsers);

router.post('/sign-up', signUpHandler);

router.post('/sign-in', signInHandler);

module.exports = router;