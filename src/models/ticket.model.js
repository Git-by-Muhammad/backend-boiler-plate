const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    status: { type: String, enum: ['open', 'in_progress', 'resolved', 'closed'], default: 'open' },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ticket', ticketSchema);

