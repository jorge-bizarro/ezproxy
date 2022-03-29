const { Router } = require('express');
const AuthController = require('../controller/auth.controller');
const PersonController = require('../controller/person.controller');
const CorsMiddleware = require('../middleware/cors.middleware');
const JwtMiddleware = require('../middleware/jwt.middleware');
const TrackingMiddleware = require('../middleware/tracking.middleware');
const { elogimProviderUrl } = require('../../config/config');
const router = Router();

// Auth
router.get('/api/v1/o/auth', CorsMiddleware.verifyOrigin(elogimProviderUrl), AuthController.getTokenByProviderId);

// Person
router.get('/api/v1/person/information', TrackingMiddleware.track, CorsMiddleware.verifyOrigin(elogimProviderUrl), JwtMiddleware.verifyAuthorization, PersonController.getInformation);


module.exports = router;
