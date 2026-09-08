import "./styles/global.css";

import { AppShell } from "./layouts/AppShell.jsx";
import { Router } from "./router.js";

export default function App() {
  return <Router>{(props) => <AppShell>{props.children}</AppShell>}</Router>;
}
