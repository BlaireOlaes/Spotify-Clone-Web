import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../src/context/AuthContext";


const GuestLayout = () => {
    const { user } = useAuthContext();
    return !user ? <Outlet /> : <Navigate to="/" />;
}

export default GuestLayout