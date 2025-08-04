import SignIn from "@/page/auth/Sign-in";
import { AUTH_ROUTES, BASE_ROUTE, PROTECTED_ROUTES } from "./routePaths";
import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignUp from "@/page/auth/Sign-up";
import VerifyEmail from "@/page/auth/VerifyEmail";
import ForgotPassword from "@/page/auth/ForgotPassword";
import ResetPassword from "@/page/auth/ResetPassword";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import Tasks from "@/page/workspace/Tasks";
import Members from "@/page/workspace/Members";
import Settings from "@/page/workspace/Settings";
import ProjectDetails from "@/page/workspace/ProjectDetails";
import InviteUser from "@/page/invite/InviteUser";
import Chats from "@/page/workspace/Chats";
import HomePage from "@/page/home/HomePage";

interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

export const authenticationRoutePaths: RouteConfig[] = [
  {
    path: AUTH_ROUTES.HOME_PATH,
    element: <HomePage />,
  },
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
  { path: AUTH_ROUTES.VERIFY_EMAIL, element: <VerifyEmail /> },
  { path: AUTH_ROUTES.FORGOT_PASSWORD, element: <ForgotPassword /> },
  { path: AUTH_ROUTES.RESET_PASSWORD, element: <ResetPassword /> },
];

export const protectedRoutePaths: RouteConfig[] = [
  { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
  { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
  { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
  { path: PROTECTED_ROUTES.CHAT, element: <Chats /> },
  { path: PROTECTED_ROUTES.PROJECT_DETAILS, element: <ProjectDetails /> },
];

export const baseRoutePaths: RouteConfig[] = [
  { path: BASE_ROUTE.INVITE_URL, element: <InviteUser /> },
];
