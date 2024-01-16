import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
} from "react-router-dom";

import Root from "./App";
import MainPage from "./pages/MainPage";
import Main2Page from "./pages/Main2Page";
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
        <Route index element={<MainPage />} />

        <Route path={Routes.MAIN2} element={<Main2Page />} />
      </Route>
    </Route>
  )
);

export default router;
