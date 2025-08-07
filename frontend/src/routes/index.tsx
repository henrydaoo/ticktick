import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Suspense, lazy } from "react";

const AppLayout = lazy(() => import("@/layout/app.layout"));
const BaseLayout = lazy(() => import("@/layout/base.layout"));
const AuthRoute = lazy(() => import("./auth.route"));
const ProtectedRoute = lazy(() => import("./protected.route"));
const NotFound = lazy(() => import("@/page/errors/NotFound"));
import {
  authenticationRoutePaths,
  baseRoutePaths,
  protectedRoutePaths,
} from "./common/routes";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<BaseLayout />}>
            {baseRoutePaths.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<Suspense fallback={null}>{route.element}</Suspense>}
              />
            ))}
          </Route>

          <Route path="/" element={<AuthRoute />}>
            <Route element={<BaseLayout />}>
              {authenticationRoutePaths.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Suspense fallback={null}>{route.element}</Suspense>}
                />
              ))}
            </Route>
          </Route>

          <Route path="/" element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              {protectedRoutePaths.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Suspense fallback={null}>{route.element}</Suspense>}
                />
              ))}
            </Route>
          </Route>
          <Route
            path="*"
            element={
              <Suspense fallback={null}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRoutes;
