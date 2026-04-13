const Group = require('../models/Group');
const Session = require('../models/Session');
const Post = require('../models/Post');

const ICONS = ['💻','📚','🧮','🔬','📐','🗃️','📊','🎯','⚗️','🌐','🧪','📡'];
const COLORS = ['color-1','color-2','color-3','color-4','color-5','color-6'];
const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

// GET /api/groups
exports.getGroups = async (req, res) => {
  try {
    const { search, faculty } = req.query;
    const filter = {};
    if (faculty) filter.faculty = faculty;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { courseCode: { $regex: search, $options: 'i' } },
        { courseName: { $regex: search, $options: 'i' } },
      ];
    }
    const groups = await Group.find(filter)
      .populate('leader', 'fname lname email')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: groups.length, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/groups
exports.createGroup = async (req, res) => {
  try {
    const { name, courseCode, courseName, faculty, description, location } = req.body;
    const group = await Group.create({
      name, courseCode, courseName, faculty, description,
      location: location || '',
      icon: rand(ICONS),
      colorClass: rand(COLORS),
      leader: req.user._id,
      members: [req.user._id],
    });
    await group.populate('leader', 'fname lname email');
    res.status(201).json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/groups/:id
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('leader', 'fname lname email program year')
      .populate('members', 'fname lname email program year');
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    res.json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// PUT /api/groups/:id
exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (group.leader.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Only the group leader can edit this group.' });

    const { name, description, location } = req.body;
    if (name) group.name = name;
    if (description) group.description = description;
    if (location !== undefined) group.location = location;
    await group.save();
    await group.populate('leader', 'fname lname email');
    res.json({ success: true, data: group });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/groups/:id
exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (group.leader.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Only the group leader or admin can delete this group.' });

    await Session.deleteMany({ group: group._id });
    await Post.deleteMany({ group: group._id });
    await group.deleteOne();
    res.json({ success: true, message: 'Group deleted successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/groups/:id/join
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (group.members.includes(req.user._id))
      return res.status(400).json({ success: false, message: 'Already a member of this group.' });

    group.members.push(req.user._id);
    await group.save();
    res.json({ success: true, message: 'Joined group successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/groups/:id/leave
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (group.leader.toString() === req.user._id.toString())
      return res.status(400).json({ success: false, message: 'Group leader cannot leave. Delete the group instead.' });

    group.members = group.members.filter(m => m.toString() !== req.user._id.toString());
    await group.save();
    res.json({ success: true, message: 'Left group successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/groups/:id/members/:userId
exports.removeMember = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (group.leader.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Only the group leader can remove members.' });
    if (req.params.userId === group.leader.toString())
      return res.status(400).json({ success: false, message: 'Cannot remove the group leader.' });

    group.members = group.members.filter(m => m.toString() !== req.params.userId);
    await group.save();
    res.json({ success: true, message: 'Member removed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/groups/my
exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('leader', 'fname lname')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: groups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
