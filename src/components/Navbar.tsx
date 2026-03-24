import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/auth.store";

export default function Navbar() {
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) return null; // hide navbar if not logged in

    return (
        <nav className="bg-white border-b px-6 py-3 flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-6">
                <h1 className="text-xl font-bold text-blue-600">
                    JobTracker
                </h1>

                <Link
                    to="/applications"
                    className="text-gray-700 hover:text-blue-600"
                >
                    Applications
                </Link>

                <Link
                    to="/dashboard"
                    className="text-gray-700 hover:text-blue-600"
                >
                    Dashboard
                </Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                    {user?.email}
                </span>

                <button
                    onClick={handleLogout}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
}