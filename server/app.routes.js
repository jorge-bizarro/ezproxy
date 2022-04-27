// @ts-check

const { Router } = require('express');
const router = Router();
const AuthController = require('../controller/auth.controller');
const PersonController = require('../controller/person.controller');
const CorsMiddleware = require('../middleware/cors.middleware');
const JwtMiddleware = require('../middleware/jwt.middleware');
const TrackingMiddleware = require('../middleware/tracking.middleware');
const { ELOGIM_PROVIDER_URL } = require('../config/config.js');

router.get('/api/v1/o/auth', AuthController.getTokenByProviderId);
router.get('/api/v1/person/information', JwtMiddleware.verifyAuthorization, TrackingMiddleware.track, PersonController.getInformation);

module.exports = router;
