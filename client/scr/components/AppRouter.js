import React, { useContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom"; // <-- Navigate вместо Redirect
import { authRoutes, publicRoutes } from "../routes";
import { SHOP_ROUTE } from "../utils/consts";
import { Context } from "../index";
import { observer } from "mobx-react-lite";

const AppRouter = observer(() => {
  const { user } = useContext(Context);

  return (
    <Routes>
      {user.isAuth &&
        authRoutes.map(({ path, Component }) => (
          <Route
            key={path}
            path={path}
            element={<Component />} // <-- вместо component
          />
        ))}
      {publicRoutes.map(({ path, Component }) => (
        <Route
          key={path}
          path={path}
          element={<Component />} // <-- вместо component
        />
      ))}
      <Route path="*" element={<Navigate to={SHOP_ROUTE} />} />{" "}
      {/* <-- Navigate вместо Redirect */}
    </Routes>
  );
});

export default AppRouter;
