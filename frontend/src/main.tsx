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
import App from "./App.tsx";
import { Toaster } from "@/components/ui/toaster"


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
          <Route element={<ProtectedRoute requiresAuth={false} />}>

      <Route path="/login" element={<LoginForm />} />
      <Route path="/signup" element={<SignupForm />} />
      </Route>
      <Route element={<ProtectedRoute requiresAuth={true} />}>
        <Route index path="/" element={<App />} />
      </Route>
    </>,
  ),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
);
