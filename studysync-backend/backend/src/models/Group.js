const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  courseCode: { type: String, required: true, trim: true, uppercase: true },
  courseName: { type: String, required: true, trim: true },
  faculty: {
    type: String,
    enum: ['Engineering & Tech', 'Business', 'Education', 'Health Sciences', 'Arts & Social'],
    required: true,
  },
  description: { type: String, required: true },
  location: { type: String, default: '' },
  icon: { type: String, default: '📚' },
  colorClass: { type: String, default: 'color-1' },
  leader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

// Auto-add leader as first member
groupSchema.pre('save', function (next) {
  if (this.isNew) {
    const leaderId = this.leader.toString();
    const alreadyMember = this.members.some(m => m.toString() === leaderId);
    if (!alreadyMember) this.members.push(this.leader);
  }
  next();
});

// Virtual member count
groupSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

groupSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Group', groupSchema);
