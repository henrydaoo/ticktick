import API from "../axios-client";
import {
  CurrentUserResponseType,
  LoginResponseType,
  loginType,
  registerType,
  RegisterResponseType,
  VerifyEmailResponseType,
  ResendVerificationResponseType,
  ForgotPasswordResponseType,
  ResetPasswordResponseType,
  ForgotPasswordType,
  ResetPasswordType,
  ResendVerificationType,
} from "@/types/api.type";

export const loginMutationFn = async (
  data: loginType
): Promise<LoginResponseType> => {
  const response = await API.post("/auth/login", data);
  return response.data;
};

export const registerMutationFn = async (
  data: registerType
): Promise<RegisterResponseType> => {
  const response = await API.post("/auth/register", data);
  return response.data;
};

export const logoutMutationFn = async () => await API.post("/auth/logout");

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/users/current`);
    return response.data;
  };

export const verifyEmailMutationFn = async (
  token: string
): Promise<VerifyEmailResponseType> => {
  const response = await API.get(`/auth/verify-email?token=${token}`);
  return response.data;
};

export const resendVerificationMutationFn = async (
  data: ResendVerificationType
): Promise<ResendVerificationResponseType> => {
  const response = await API.post("/auth/resend-verification", data);
  return response.data;
};

export const forgotPasswordMutationFn = async (
  data: ForgotPasswordType
): Promise<ForgotPasswordResponseType> => {
  const response = await API.post("/auth/forgot-password", data);
  return response.data;
};

export const resetPasswordMutationFn = async (
  data: ResetPasswordType
): Promise<ResetPasswordResponseType> => {
  const response = await API.post("/auth/reset-password", data);
  return response.data;
};
