const router = require('express').Router();
const { protect } = require('../middleware/auth');
const {
  getGroups, createGroup, getGroup, updateGroup, deleteGroup,
  joinGroup, leaveGroup, removeMember, getMyGroups
} = require('../controllers/groupController');
const { getSessions, createSession, deleteSession } = require('../controllers/sessionController');
const { getPosts, createPost, deletePost } = require('../controllers/postController');

router.use(protect);

router.get('/my', getMyGroups);
router.get('/', getGroups);
router.post('/', createGroup);
router.get('/:id', getGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.post('/:id/join', joinGroup);
router.delete('/:id/leave', leaveGroup);
router.delete('/:id/members/:userId', removeMember);

// Sessions nested under group
router.get('/:id/sessions', getSessions);
router.post('/:id/sessions', createSession);
router.delete('/:id/sessions/:sessionId', deleteSession);

// Posts nested under group
router.get('/:id/posts', getPosts);
router.post('/:id/posts', createPost);
router.delete('/:id/posts/:postId', deletePost);

module.exports = router;
