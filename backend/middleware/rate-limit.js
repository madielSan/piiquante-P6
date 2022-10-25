const rateLimit = require('express-rate-limit');
// middleware permettant de limiter les tentatives trop nombreuses de connexions afin de limiter les risques de piratage de session lors de l'authentification.
const logLimit = rateLimit({
    windowMs: 10 * 60 * 1000, // blocage de 10 minutes..
	max: 5, // ..après 5 tentatives
	standardHeaders: true, 
	legacyHeaders: false, 
})

module.exports = logLimit;