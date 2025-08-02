import SignIn from "@/page/auth/Sign-in";
import { AUTH_ROUTES } from "./routePaths";
import GoogleOAuthFailure from "@/page/auth/GoogleOAuthFailure";
import SignUp from "@/page/auth/Sign-up";

interface RouteConfig {
  path: string;
  element: React.ReactElement;
}

export const authenticationRoutePaths: RouteConfig[] = [
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
  { path: AUTH_ROUTES.GOOGLE_OAUTH_CALLBACK, element: <GoogleOAuthFailure /> },
];

export const protectedRoutePaths: RouteConfig[] = [];

export const baseRoutePaths: RouteConfig[] = [];
