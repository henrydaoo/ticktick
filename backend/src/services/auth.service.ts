import mongoose from "mongoose";
import crypto from "crypto";
import UserModel from "../models/user.model";
import AccountModel from "../models/account.model";
import WorkspaceModel from "../models/workspace.model";
import RoleModel from "../models/roles-permission.model";
import VerificationTokenModel from "../models/verification-token.model";
import { Roles } from "../enums/role.enum";
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from "../utils/appError";
import MemberModel from "../models/member.model";
import { ProviderEnum } from "../enums/account-provider.enum";
import {
  sendEmail,
  getEmailVerificationTemplate,
  getPasswordResetTemplate,
} from "../utils/email";
import { getEnv } from "../utils/get-env";

export const loginOrCreateAccountService = async (data: {
  provider: string;
  displayName: string;
  providerId: string;
  picture?: string;
  email?: string;
}) => {
  const { providerId, provider, displayName, email, picture } = data;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    console.log("Started Session...");

    let user = await UserModel.findOne({ email }).session(session);

    if (!user) {
      user = new UserModel({
        email,
        name: displayName,
        profilePicture: picture || null,
      });
      await user.save({ session });

      const account = new AccountModel({
        userId: user._id,
        provider: provider,
        providerId: providerId,
      });
      await account.save({ session });

      const workspace = new WorkspaceModel({
        name: `My Workspace`,
        description: `Workspace created for ${user.name}`,
        owner: user._id,
      });
      await workspace.save({ session });

      const ownerRole = await RoleModel.findOne({
        name: Roles.OWNER,
      }).session(session);

      if (!ownerRole) {
        throw new NotFoundException("Owner role not found");
      }

      const member = new MemberModel({
        userId: user._id,
        workspaceId: workspace._id,
        role: ownerRole._id,
        joinedAt: new Date(),
      });
      await member.save({ session });

      user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
      await user.save({ session });
    }
    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    return { user };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  } finally {
    session.endSession();
  }
};

export const registerUserService = async (body: {
  email: string;
  name: string;
  password: string;
}) => {
  const { email, name, password } = body;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const existingUser = await UserModel.findOne({ email }).session(session);
    if (existingUser) {
      throw new BadRequestException("Email already exists");
    }

    const user = new UserModel({
      email,
      name,
      password,
      isEmailVerified: false,
    });
    await user.save({ session });

    const account = new AccountModel({
      userId: user._id,
      provider: ProviderEnum.EMAIL,
      providerId: email,
    });
    await account.save({ session });

    const workspace = new WorkspaceModel({
      name: `My Workspace`,
      description: `Workspace created for ${user.name}`,
      owner: user._id,
    });
    await workspace.save({ session });

    const ownerRole = await RoleModel.findOne({
      name: Roles.OWNER,
    }).session(session);

    if (!ownerRole) {
      throw new NotFoundException("Owner role not found");
    }

    const member = new MemberModel({
      userId: user._id,
      workspaceId: workspace._id,
      role: ownerRole._id,
      joinedAt: new Date(),
    });
    await member.save({ session });

    user.currentWorkspace = workspace._id as mongoose.Types.ObjectId;
    await user.save({ session });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenDoc = new VerificationTokenModel({
      userId: user._id,
      token: verificationToken,
      type: "email_verification",
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });
    await verificationTokenDoc.save({ session });

    await session.commitTransaction();
    session.endSession();
    console.log("End Session...");

    const verificationUrl = `${getEnv(
      "FRONTEND_ORIGIN"
    )}/verify-email?token=${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your TickTick account",
      html: getEmailVerificationTemplate(verificationUrl, name),
    });

    return {
      userId: user._id,
      workspaceId: workspace._id,
      message:
        "Account created successfully. Please check your email to verify your account.",
    };
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    throw error;
  }
};

export const verifyUserService = async ({
  email,
  password,
  provider = ProviderEnum.EMAIL,
}: {
  email: string;
  password: string;
  provider?: string;
}) => {
  const account = await AccountModel.findOne({ provider, providerId: email });
  if (!account) {
    throw new NotFoundException("Invalid email or password");
  }

  const user = await UserModel.findById(account.userId);

  if (!user) {
    throw new NotFoundException("User not found for the given account");
  }

  if (provider === ProviderEnum.EMAIL && !user.isEmailVerified) {
    throw new UnauthorizedException(
      "Please verify your email before logging in"
    );
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new UnauthorizedException("Invalid email or password");
  }

  return user.omitPassword();
};

export const verifyEmailService = async (token: string) => {
  const verificationToken = await VerificationTokenModel.findOne({
    token,
    type: "email_verification",
    expiresAt: { $gt: new Date() },
  });

  if (!verificationToken) {
    throw new BadRequestException("Invalid or expired verification token");
  }

  const user = await UserModel.findById(verificationToken.userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.isEmailVerified) {
    throw new BadRequestException("Email is already verified");
  }

  user.isEmailVerified = true;
  await user.save();

  await VerificationTokenModel.deleteOne({ _id: verificationToken._id });

  return { message: "Email verified successfully" };
};

export const resendVerificationEmailService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new NotFoundException("User not found");
  }

  if (user.isEmailVerified) {
    throw new BadRequestException("Email is already verified");
  }

  await VerificationTokenModel.deleteMany({
    userId: user._id,
    type: "email_verification",
  });

  const verificationToken = crypto.randomBytes(32).toString("hex");
  const verificationTokenDoc = new VerificationTokenModel({
    userId: user._id,
    token: verificationToken,
    type: "email_verification",
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });
  await verificationTokenDoc.save();

  const verificationUrl = `${getEnv(
    "FRONTEND_ORIGIN"
  )}/verify-email?token=${verificationToken}`;
  await sendEmail({
    to: email,
    subject: "Verify your TickTick account",
    html: getEmailVerificationTemplate(verificationUrl, user.name),
  });

  return { message: "Verification email sent successfully" };
};

export const forgotPasswordService = async (email: string) => {
  const user = await UserModel.findOne({ email });
  if (!user) {
    return {
      message:
        "If an account with that email exists, a password reset link has been sent.",
    };
  }

  await VerificationTokenModel.deleteMany({
    userId: user._id,
    type: "password_reset",
  });

  const resetToken = crypto.randomBytes(32).toString("hex");
  const resetTokenDoc = new VerificationTokenModel({
    userId: user._id,
    token: resetToken,
    type: "password_reset",
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
  });
  await resetTokenDoc.save();

  const resetUrl = `${getEnv(
    "FRONTEND_ORIGIN"
  )}/reset-password?token=${resetToken}`;
  await sendEmail({
    to: email,
    subject: "Reset your TickTick password",
    html: getPasswordResetTemplate(resetUrl, user.name),
  });

  return {
    message:
      "If an account with that email exists, a password reset link has been sent.",
  };
};

export const resetPasswordService = async (
  token: string,
  newPassword: string
) => {
  const resetToken = await VerificationTokenModel.findOne({
    token,
    type: "password_reset",
    expiresAt: { $gt: new Date() },
  });

  if (!resetToken) {
    throw new BadRequestException("Invalid or expired reset token");
  }

  const user = await UserModel.findById(resetToken.userId);
  if (!user) {
    throw new NotFoundException("User not found");
  }

  user.password = newPassword;
  user.isEmailVerified = true;
  await user.save();

  await VerificationTokenModel.deleteOne({ _id: resetToken._id });

  return { message: "Password reset successfully" };
};
