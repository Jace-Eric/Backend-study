const router = require('express').Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getStats, getUsers, deleteUser } = require('../controllers/adminController');

router.use(protect, adminOnly);
router.get('/stats', getStats);
router.get('/users', getUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;
