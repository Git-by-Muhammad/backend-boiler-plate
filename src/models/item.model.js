const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    imageUrl: { type: String, trim: true },
    attachments: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Item', itemSchema);
