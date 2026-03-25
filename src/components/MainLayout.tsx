import { Outlet, NavLink } from "react-router-dom";

export default function MainLayout() {
    return (
        <div className="flex min-h-screen bg-gray-50">

            {/* Sidebar */}
            <aside className="w-64 bg-white border-r hidden md:block">
                <div className="p-5 font-bold text-xl">ATS</div>

                <nav className="space-y-1 px-3">
                    <SidebarLink to="/" label="Dashboard" />
                    <SidebarLink to="/applications" label="Applications" />
                </nav>
            </aside>

            {/* Main */}
            <div className="flex-1 flex flex-col">

                {/* Navbar */}
                <header className="bg-white border-b px-6 py-3 flex justify-between items-center">
                    <h1 className="font-semibold">Welcome back 👋</h1>
                    <button className="text-sm text-red-500">Logout</button>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}

/* Sidebar link */
function SidebarLink({ to, label }: { to: string; label: string }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm ${isActive
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                }`
            }
        >
            {label}
        </NavLink>
    );
}