const { Router } = require('express');
const AuthController = require('../controller/auth.controller');
const { CorsMiddleware } = require('../middleware')
const { provider } = require('../../config/config.json');
const router = Router();

router.get('/', CorsMiddleware.verifyOrigin(provider.whitelist), AuthController.getTokenByProviderId);

module.exports = router;
