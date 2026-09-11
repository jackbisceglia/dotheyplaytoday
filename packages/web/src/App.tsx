import "./styles/global.css";

import { createRouter, defineRoute, defineRoutes } from "@solidjs/router";

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
        path: "/",
        preload: homePreload,
        component: Home,
      }),
      defineRoute({
        path: "/feedback",
        component: () => <Feedback />,
      }),
      defineRoute({
        path: "/unsubscribe/:token",
        component: (props) => <Unsubscribe token={props.params.token} />,
      }),
      { path: "*404", component: () => <NotFound /> },
    ],
  }),
]);

const Router = createRouter({ routes });

export default function App() {
  return <Router />;
}
