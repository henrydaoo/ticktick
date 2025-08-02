import SignIn from "@/page/auth/Sign-in";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePaths";
import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignUp from "@/page/auth/Sign-up";
import WorkspaceDashboard from "@/page/workspace/Dashboard";
import Tasks from "@/page/workspace/Tasks";
import Members from "@/page/workspace/Members";
import Settings from "@/page/workspace/Settings";

interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

export const authenticationRoutePaths: RouteConfig[] = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths: RouteConfig[] = [
    { path: PROTECTED_ROUTES.WORKSPACE, element: <WorkspaceDashboard /> },
  { path: PROTECTED_ROUTES.TASKS, element: <Tasks /> },
    { path: PROTECTED_ROUTES.MEMBERS, element: <Members /> },
      { path: PROTECTED_ROUTES.SETTINGS, element: <Settings /> },
];

export const baseRoutePaths: RouteConfig[] = [];
