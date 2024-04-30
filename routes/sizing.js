const express = require('express');
const router = express.Router();
const { calculateSize } = require('../controllers/sizingController');

router.post('/size', calculateSize);

module.exports = router;
