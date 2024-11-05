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
import LoginForm from "./components/LoginForm.tsx";
import SignupForm from "./components/SignupForm.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import { Toaster } from "@/components/ui/toaster";
import Home from "./components/Home.tsx";
import { StoreProvider } from "./context/StoresContext.tsx";
import FilterPage from "./components/SuggestPage.tsx";
import SavedRoutesPage from "./components/SavedRoutesPage.tsx";
import RouteDisplayPage from "./components/RouteDisplay/RouteDisplayPage.tsx";
import { APIProvider } from "@vis.gl/react-google-maps";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<ProtectedRoute requiresAuth={false} />}>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/route/:routeId?" element={<RouteDisplayPage />} />
      </Route>
      <Route element={<ProtectedRoute requiresAuth={true} />}>
        <Route index path="/" element={<Home />} />
        <Route index path="/suggest" element={<FilterPage />} />
        <Route index path="/saved-routes" element={<SavedRoutesPage />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
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
  </AuthProvider>,
  // </StrictMode>,
);
