const express = require('express');
const router = express.Router();
const { register, login, githubLogin } = require('../controllers/authController');

router.post('/register', register);
router.post('/login', login);
router.post('/github', githubLogin);

module.exports = router;
