const User = require('../models/User');
const Group = require('../models/Group');
const Session = require('../models/Session');
const Post = require('../models/Post');

// GET /api/admin/stats
exports.getStats = async (req, res) => {
  try {
    const [totalUsers, totalGroups, totalSessions, totalPosts] = await Promise.all([
      User.countDocuments(),
      Group.countDocuments(),
      Session.countDocuments(),
      Post.countDocuments(),
    ]);

    // Most active courses by member count
    const groups = await Group.find().select('courseCode courseName members');
    const courseCounts = {};
    groups.forEach(g => {
      const key = g.courseCode;
      if (!courseCounts[key]) courseCounts[key] = { code: key, name: g.courseName, count: 0 };
      courseCounts[key].count += g.members.length;
    });
    const activeCourses = Object.values(courseCounts).sort((a, b) => b.count - a.count).slice(0, 8);

    res.json({ success: true, data: { totalUsers, totalGroups, totalSessions, totalPosts, activeCourses } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/admin/users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
