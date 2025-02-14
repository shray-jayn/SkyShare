import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { authState } from "../recoil/atoms/auth.atom";

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

// Navigation Component
const Navigation: React.FC = () => {
  const auth = useRecoilValue(authState);

  return (
    <nav>
      {auth.isAuthenticated ? (
        <>
          <Link to="/">Home</Link> | <Link to="/shared">Shared</Link> |
          <Link to="/favourites">Favorites</Link> | <Link to="/documents">Documents</Link> |
          <Link to="/pictures">Pictures</Link> | <Link to="/videos">Videos</Link> |
          <Link to="/audios">Audios</Link> | <Link to="/search">Search</Link>
        </>
      ) : (
        <>
          <Link to="/login">Login</Link> | <Link to="/signup">Sign Up</Link>
        </>
      )}
    </nav>
  );
};

// Protected Layout for Private Routes
const ProtectedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <RequireAuth>
    <>
      <Navigation />
      {children}
    </>
  </RequireAuth>
);

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation />
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
