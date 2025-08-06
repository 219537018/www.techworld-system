import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    coverLetter: {
      type: String,
      required: true,
    },
    resume: {
      type: String,
      required: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    // ✅ Add these two fields below:
    status: {
      type: String,
      enum: ['Pending', 'Accepted', 'Rejected'],
      default: 'Pending',
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const applicationModel = mongoose.models.Application || mongoose.model("Application", applicationSchema);

export default applicationModel;
