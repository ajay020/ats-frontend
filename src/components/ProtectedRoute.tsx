import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function ProtectedRoute({ children }: any) {
    const { token, isAuthLoading } = useAuthStore((state) => state);

    if (isAuthLoading) {
        return <div>Loading...</div>
    }

    console.log("Token: ", token)

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    return children;
}