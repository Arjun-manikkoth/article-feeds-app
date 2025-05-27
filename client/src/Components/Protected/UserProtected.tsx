import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Hooks/useAuth";

//for routes require authentication
const UserProtected: React.FC = () => {
    const { id } = useAuth();

    return id ? <Outlet /> : <Navigate to={"/sign-in"} />;
};
export default UserProtected;
