import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

import Home from "../pages/Home.page";
import Login from "../pages/Login.page";
import SignUp from "../pages/SignUp.page";
import Shared from "../pages/Shared.page";
import Documents from "../pages/Documents.page";
import Pictures from "../pages/Pictures.page";
import Videos from "../pages/Videos.page";
import Audios from "../pages/Audios.page";
import NotFound from "../pages/NotFound.page";
import FileDetail from "../pages/FileDetail.page";
import Favorites from "../pages/Favourites.page";
import Search from "../pages/Search.page"; 

// Component to protect private routes
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
          path="/shared"
          element={
            <RequireAuth>
              <Shared />
            </RequireAuth>
          }
        />
        <Route
          path="/favourites"
          element={
            <RequireAuth>
              <Favorites />
            </RequireAuth>
          }
        />
        <Route
          path="/documents"
          element={
            <RequireAuth>
              <Documents />
            </RequireAuth>
          }
        />
        <Route
          path="/pictures"
          element={
            <RequireAuth>
              <Pictures />
            </RequireAuth>
          }
        />
        <Route
          path="/videos"
          element={
            <RequireAuth>
              <Videos />
            </RequireAuth>
          }
        />
        <Route
          path="/audios"
          element={
            <RequireAuth>
              <Audios />
            </RequireAuth>
          }
        />
        <Route
          path="/files/:fileId"
          element={
            <RequireAuth>
              <FileDetail />
            </RequireAuth>
          }
        />
        <Route
          path="/search"
          element={
            <RequireAuth>
              <Search/>
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