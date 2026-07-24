import mongoose from 'mongoose';

const OtpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  hashedOtp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 300 // Document automatically removed after 5 minutes (300 seconds)
  }
});

export default mongoose.models.Otp || mongoose.model('Otp', OtpSchema);
