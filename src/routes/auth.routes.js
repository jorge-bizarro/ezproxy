const { Router } = require('express');
const AuthController = require('../controller/auth.controller');
const { CorsMiddleware } = require('../middleware')
const { providerELOGIM } = require('../../config/config.json');
const router = Router();

router.get('/', CorsMiddleware.verifyOrigin(providerELOGIM.whitelist), AuthController.getTokenByProviderId);

module.exports = router;
