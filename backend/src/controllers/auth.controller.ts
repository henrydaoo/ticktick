import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { config } from "../config/app.config";
import {
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  resendVerificationSchema,
} from "../validation/auth.validation";
import { HTTPSTATUS } from "../config/http.config";
import {
  registerUserService,
  verifyEmailService,
  resendVerificationEmailService,
  forgotPasswordService,
  resetPasswordService,
} from "../services/auth.service";
import passport from "passport";

export const googleLoginCallback = asyncHandler(
  async (req: Request, res: Response) => {
    const currentWorkspace = req.user?.currentWorkspace;

    if (!currentWorkspace) {
      return res.redirect(
        `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`
      );
    }

    return res.redirect(
      `${config.FRONTEND_ORIGIN}/workspace/${currentWorkspace}`
    );
  }
);

export const registerUserController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = registerSchema.parse({
      ...req.body,
    });

    const result = await registerUserService(body);

    return res.status(HTTPSTATUS.CREATED).json({
      message: result.message,
      userId: result.userId,
      workspaceId: result.workspaceId,
    });
  }
);

export const loginController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate(
      "local",
      (
        err: Error | null,
        user: Express.User | false,
        info: { message: string } | undefined
      ) => {
        if (err) {
          return next(err);
        }

        if (!user) {
          return res.status(HTTPSTATUS.UNAUTHORIZED).json({
            message: info?.message || "Invalid email or password",
          });
        }

        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }

          return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully",
            user,
          });
        });
      }
    )(req, res, next);
  }
);

export const logOutController = asyncHandler(
  async (req: Request, res: Response) => {
    req.logout((err) => {
      if (err) {
        console.error("Logout error:", err);
        return res
          .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
          .json({ error: "Failed to log out" });
      }
      
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res
            .status(HTTPSTATUS.INTERNAL_SERVER_ERROR)
            .json({ error: "Failed to destroy session" });
        }
        
        return res
          .status(HTTPSTATUS.OK)
          .json({ message: "Logged out successfully" });
      });
    });
  }
);

export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(HTTPSTATUS.BAD_REQUEST).json({
        message: "Verification token is required",
      });
    }

    const result = await verifyEmailService(token);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const resendVerificationEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = resendVerificationSchema.parse(req.body);

    const result = await resendVerificationEmailService(body.email);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = forgotPasswordSchema.parse(req.body);

    const result = await forgotPasswordService(body.email);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);

export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const body = resetPasswordSchema.parse(req.body);

    const result = await resetPasswordService(body.token, body.password);

    return res.status(HTTPSTATUS.OK).json(result);
  }
);
