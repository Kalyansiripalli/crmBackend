import mongoose from 'mongoose';

const opportunitySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    customerName: {
      type: String,
      required: [true, 'Customer/company name is required'],
      trim: true,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid contact email address'],
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    requirement: {
      type: String,
      required: [true, 'Requirement summary is required'],
      trim: true,
    },
    estimatedValue: {
      type: Number,
      min: [0, 'Estimated deal value must be non-negative'],
    },
    stage: {
      type: String,
      enum: {
        values: ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'],
        message: '{VALUE} is not a valid stage',
      },
      default: 'New',
    },
    priority: {
      type: String,
      enum: {
        values: ['Low', 'Medium', 'High'],
        message: '{VALUE} is not a valid priority',
      },
      default: 'Medium',
    },
    nextFollowUpDate: {
      type: Date,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Opportunity = mongoose.model('Opportunity', opportunitySchema);

export default Opportunity;
