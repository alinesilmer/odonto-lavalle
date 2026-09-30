import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import type { Role } from "@odonto/shared";
import ToothLoader from "@/components/UI/ToothLoader/ToothLoader";
import { useAuth } from "./useAuth";

interface Props {
  children: ReactNode;
  /** Roles allowed through. Omit to allow any signed-in user. */
  roles?: Role[];
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Never redirect before the stored session has been validated, or a refresh
  // on a dashboard URL would bounce the user to /login every time.
  if (loading) return <ToothLoader label="Verificando tu sesión…" />;

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={user.role === "admin" ? "/dashboard/admin" : "/dashboard/paciente"} replace />;
  }

  return <>{children}</>;
}
