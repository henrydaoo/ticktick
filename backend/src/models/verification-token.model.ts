import mongoose, { Document, Schema } from "mongoose";

export interface VerificationTokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  type: "email_verification" | "password_reset";
  expiresAt: Date;
  isUsed: boolean;
  createdAt: Date;
}

const verificationTokenSchema = new Schema<VerificationTokenDocument>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["email_verification", "password_reset"],
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expireAfterSeconds: 0 },
    },
    isUsed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

verificationTokenSchema.index({ token: 1, type: 1 });
verificationTokenSchema.index({ userId: 1, type: 1 });

const VerificationTokenModel = mongoose.model<VerificationTokenDocument>(
  "VerificationToken",
  verificationTokenSchema
);

export default VerificationTokenModel;
