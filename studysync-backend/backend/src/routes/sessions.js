const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { getMySessions } = require('../controllers/sessionController');

router.use(protect);
router.get('/my', getMySessions);

module.exports = router;
