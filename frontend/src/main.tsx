import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.tsx";
import { Toaster } from "@/components/ui/toaster";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import ProtectedRouteWrapper from "./components/ProtectedRouteWrapper";
import Home from "./components/Home";
import SuggestPage from "./components/SuggestPage";
import { StoreProvider } from "./context/StoresContext";
import RouteDisplayPage from "./components/RouteDisplay/RouteDisplayPage.tsx";
import SavedRoutesPage from "./components/SavedRoutesPage";
import { APIProvider } from "@vis.gl/react-google-maps";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ProtectedRouteWrapper requiresAuth={false} />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/route/:routeId?" element={<RouteDisplayPage />} />
      </Route>
      <Route element={<ProtectedRouteWrapper requiresAuth={true} />}>
        <Route index path="/" element={<Home />} />
        <Route index path="/suggest" element={<SuggestPage />} />
        <Route index path="/saved-routes" element={<SavedRoutesPage />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <APIProvider
        apiKey={"AIzaSyBX6VqkGXWxsNGmZ45gHz4CGWHiRSgyhzI"}
        onLoad={() => console.log("Maps API has loaded.")}
      >
        <StoreProvider>
          <Toaster />
          <RouterProvider router={router} />
        </StoreProvider>
      </APIProvider>
    </AuthProvider>
  </StrictMode>,
);
