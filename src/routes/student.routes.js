const { Router } = require('express');
const { getInformation } = require('../controller/student.controller');
const { verifyOriginMiddleware } = require('../middleware/cors.middleware');

const router = Router();

router.get('/information', verifyOriginMiddleware(['https://www.google.com']), getInformation);

module.exports = router;
