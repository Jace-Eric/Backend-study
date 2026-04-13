const Session = require('../models/Session');
const Group = require('../models/Group');

// GET /api/groups/:id/sessions
exports.getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({ group: req.params.id })
      .populate('createdBy', 'fname lname')
      .sort({ date: 1, time: 1 });
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/groups/:id/sessions
exports.createSession = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (group.leader.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Only the group leader can schedule sessions.' });

    const { title, date, time, location, description } = req.body;
    if (!title || !date || !time || !location)
      return res.status(400).json({ success: false, message: 'Title, date, time and location are required.' });

    const session = await Session.create({
      group: req.params.id, title, date, time,
      location, description: description || '',
      createdBy: req.user._id,
    });
    await session.populate('createdBy', 'fname lname');
    res.status(201).json({ success: true, data: session });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/groups/:id/sessions/:sessionId
exports.deleteSession = async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ success: false, message: 'Session not found.' });
    const group = await Group.findById(req.params.id);
    if (group.leader.toString() !== req.user._id.toString())
      return res.status(403).json({ success: false, message: 'Only the group leader can delete sessions.' });
    await session.deleteOne();
    res.json({ success: true, message: 'Session deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// GET /api/sessions/my  — all upcoming sessions across user's groups
exports.getMySessions = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id }).select('_id');
    const groupIds = groups.map(g => g._id);
    const today = new Date().toISOString().split('T')[0];
    const sessions = await Session.find({
      group: { $in: groupIds },
      date: { $gte: today },
    })
      .populate('group', 'name courseCode icon colorClass')
      .populate('createdBy', 'fname lname')
      .sort({ date: 1, time: 1 });
    res.json({ success: true, data: sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
