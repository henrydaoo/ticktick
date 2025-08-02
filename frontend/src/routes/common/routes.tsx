import SignIn from "@/page/auth/Sign-in";
import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePaths";
import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignUp from "@/page/auth/Sign-up";
import WorkspaceDashboard from "@/page/workspace/Dashboard";


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

];

export const baseRoutePaths: RouteConfig[] = [];
