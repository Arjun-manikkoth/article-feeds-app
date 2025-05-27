import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";

// For routes that should ONLY be accessible when NOT logged in (login/register)
export const AuthProtected = () => {
    const { id } = useAuth();
    return id ? <Navigate to="/articles" replace /> : <Outlet />;
};
