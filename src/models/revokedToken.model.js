const mongoose = require('mongoose');

const revokedTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    tokenType: { type: String, enum: ['access', 'refresh'], required: true },
    expiresAt: { type: Date, required: true, index: true },
    reason: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RevokedToken', revokedTokenSchema);

