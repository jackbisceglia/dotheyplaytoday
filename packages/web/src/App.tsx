import "./styles/global.css";

import { createRouter, defineRoute, defineRoutes } from "@solidjs/router";

import { paths } from "./lib/paths.js";
import { Feedback } from "./pages/Feedback.jsx";
import { Home, preload as homePreload } from "./pages/Home.jsx";
import { NotFound } from "./pages/NotFound.jsx";
import { Unsubscribe } from "./pages/Unsubscribe.jsx";
import { RootShell } from "./pages/shell.jsx";

const routes = defineRoutes([
  defineRoute({
    component: RootShell,
    children: [
      defineRoute({
        path: paths.home,
        preload: homePreload,
        component: Home,
      }),
      defineRoute({ path: paths.feedback, component: Feedback }),
      defineRoute({
        path: paths.unsubscribe,
        component: (props) => <Unsubscribe token={props.params.token} />,
      }),
      { path: "*404", component: NotFound },
    ],
  }),
]);

const Router = createRouter({ routes });

export default function App() {
  return <Router />;
}
