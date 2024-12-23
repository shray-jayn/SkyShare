import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.page";
import Login from "../pages/Login.page";
import NotFound from "../pages/NotFound.page";
import SignUp from "../pages/SignUp.page";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";
import Audios from "../pages/Audios.page";
import Documents from "../pages/Documents.page";
import Shared from "../pages/Shared.page";
import Pictures from "../pages/Pictures.page";
import Videos from "../pages/Videos.page";

// RequireAuth component to protect private routes
const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useRecoilValue(authState);

  // Redirect to login if not authenticated
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Private Routes */}
        <Route
          path="/"
          element={
            <RequireAuth>
              <Home />
            </RequireAuth>
          }
        />
         <Route
          path="/shared "
          element={
            <RequireAuth>
              <Shared/>
            </RequireAuth>
          }
        />
         <Route
          path="/documents"
          element={
            <RequireAuth>
              <Documents/>
            </RequireAuth>
          }
        />
         <Route
          path="/pictures"
          element={
            <RequireAuth>
              <Pictures/>
            </RequireAuth>
          }
        />
        <Route
          path="/videos"
          element={
            <RequireAuth>
              <Videos/>
            </RequireAuth>
          }
        />
         <Route
          path="/audios"
          element={
            <RequireAuth>
              <Audios/>
            </RequireAuth>
          }
        />

        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
