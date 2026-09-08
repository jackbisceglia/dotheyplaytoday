import { createRouter, defineRoute, defineRoutes } from "@solidjs/router";
import { lazy } from "solid-js";

import { getSubjects } from "./modules/landing/queries.js";

const Unsubscribe = lazy(() => import("./pages/Unsubscribe.jsx"));

export const Router = createRouter({
  routes: defineRoutes([
    {
      path: "/",
      preload: () => getSubjects(),
      component: lazy(() => import("./pages/Landing.jsx")),
    },
    {
      component: lazy(() => import("./modules/auth/RequireAuth.jsx")),
      children: [
        { path: "/home", component: lazy(() => import("./pages/Home.jsx")) },
      ],
    },
    { path: "/sign-in", component: lazy(() => import("./pages/SignIn.jsx")) },
    {
      path: "/feedback",
      component: lazy(() => import("./pages/Feedback.jsx")),
    },
    defineRoute({
      path: "/unsubscribe/:token",
      component: (props) => <Unsubscribe token={props.params.token} />,
    }),
    { path: "*404", component: lazy(() => import("./pages/NotFound.jsx")) },
  ]),
});
