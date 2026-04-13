const Post = require('../models/Post');
const Group = require('../models/Group');

// GET /api/groups/:id/posts
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ group: req.params.id })
      .populate('author', 'fname lname')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// POST /api/groups/:id/posts
exports.createPost = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ success: false, message: 'Group not found.' });
    if (!group.members.includes(req.user._id))
      return res.status(403).json({ success: false, message: 'Only group members can post.' });

    const { content } = req.body;
    if (!content || !content.trim())
      return res.status(400).json({ success: false, message: 'Post content is required.' });

    const post = await Post.create({ group: req.params.id, author: req.user._id, content: content.trim() });
    await post.populate('author', 'fname lname');
    res.status(201).json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// DELETE /api/groups/:id/posts/:postId
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ success: false, message: 'Post not found.' });
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ success: false, message: 'Not authorized to delete this post.' });
    await post.deleteOne();
    res.json({ success: true, message: 'Post deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
