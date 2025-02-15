import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";
import { Spin } from "antd";

// Lazy Load Pages for Performance Optimization
const Home = lazy(() => import("../pages/Home.page"));
const Login = lazy(() => import("../pages/Login.page"));
const SignUp = lazy(() => import("../pages/SignUp.page"));
const Shared = lazy(() => import("../pages/Shared.page"));
const Documents = lazy(() => import("../pages/Documents.page"));
const Pictures = lazy(() => import("../pages/Pictures.page"));
const Videos = lazy(() => import("../pages/Videos.page"));
const Audios = lazy(() => import("../pages/Audios.page"));
const NotFound = lazy(() => import("../pages/NotFound.page"));
const FileDetail = lazy(() => import("../pages/FileDetail.page"));
const Favorites = lazy(() => import("../pages/Favourites.page"));
const Search = lazy(() => import("../pages/Search.page"));

const RequireAuth: React.FC<{ children: JSX.Element }> = ({ children }) => {
  const auth = useRecoilValue(authState);
  return auth.isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Protected Layout for Private Routes
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RequireAuth>
    <>
      {children}
    </>
  </RequireAuth>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="flex h-screen w-full items-center justify-center bg-gray-50">
          {/* A card-like container for the spinner */}
          <div className="flex flex-col items-center p-6">
            <Spin size="large" tip="Loading..." />
            {/* <span className="mt-2 text-gray-600">Please wait while we load the page...</span> */}
          </div>
        </div>
      }>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Private Routes */}
          <Route path="/" element={<ProtectedLayout><Home /></ProtectedLayout>} />
          <Route path="/shared" element={<ProtectedLayout><Shared /></ProtectedLayout>} />
          <Route path="/favourites" element={<ProtectedLayout><Favorites /></ProtectedLayout>} />
          <Route path="/documents" element={<ProtectedLayout><Documents /></ProtectedLayout>} />
          <Route path="/pictures" element={<ProtectedLayout><Pictures /></ProtectedLayout>} />
          <Route path="/videos" element={<ProtectedLayout><Videos /></ProtectedLayout>} />
          <Route path="/audios" element={<ProtectedLayout><Audios /></ProtectedLayout>} />
          <Route path="/files/:fileId" element={<ProtectedLayout><FileDetail /></ProtectedLayout>} />
          <Route path="/search" element={<ProtectedLayout><Search /></ProtectedLayout>} />

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;