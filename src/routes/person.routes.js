const { Router } = require('express');
const PersonController = require('../controller/person.controller');
const { CorsMiddleware, JwtMiddleware } = require('../middleware')
const { providerELOGIM } = require('../../config/config.json');
const router = Router();

router.get('/information', CorsMiddleware.verifyOrigin(providerELOGIM.whitelist), JwtMiddleware.verifyToken, PersonController.getInformation);

module.exports = router;
