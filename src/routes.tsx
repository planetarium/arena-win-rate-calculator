import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";

import Root from "./App";
import AvatarInputPage from "./pages/AvatarInputPage";
import AgentInputPage from "./pages/AgentInputPage";
import ArenaPage from "./pages/ArenaPage";
import ErrorPage from "./pages/ErrorPage";
import { Routes } from "./constants";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path={`/${Routes.ROOT}`}
      element={<Root />}
      errorElement={<ErrorPage />}
    >
      <Route errorElement={<ErrorPage />}>
        <Route index element={<AgentInputPage />} />

        <Route path={Routes.AVATAR} element={<AvatarInputPage />} />
        <Route path={Routes.ARENA} element={<ArenaPage />} />
      </Route>
    </Route>
  )
);

export default router;
