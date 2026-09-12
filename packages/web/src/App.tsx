import "./styles/global.css";

import { createRouter, defineRoute, defineRoutes } from "@solidjs/router";

import { paths } from "./lib/paths.js";
import { AuthenticatedShell } from "./pages/(authenticated)/shell.jsx";
import { Home } from "./pages/(authenticated)/home.jsx";
import { Feedback } from "./pages/Feedback.jsx";
import { Landing, preload as landingPreload } from "./pages/Landing.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Unsubscribe } from "./pages/Unsubscribe.jsx";
import { RootShell } from "./pages/shell.jsx";

const routes = defineRoutes([
  defineRoute({
    component: RootShell,
    children: [
      defineRoute({
        path: paths.landing,
        preload: landingPreload,
        component: Landing,
      }),
      defineRoute({ path: paths.feedback, component: Feedback }),
      defineRoute({
        path: paths.unsubscribe,
        component: (props) => <Unsubscribe token={props.params.token} />,
      }),
      defineRoute({
        component: AuthenticatedShell,
        children: [defineRoute({ path: paths.home, component: Home })],
      }),
      { path: "*404", component: NotFound },
    ],
  }),
]);

const Router = createRouter({ routes });

export default function App() {
  return <Router />;
}
