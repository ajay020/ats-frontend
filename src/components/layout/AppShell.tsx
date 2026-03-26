import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export const AppShell = () => (
    <div className="flex min-h-screen bg-bg">
        <Sidebar />
        <main
            className="flex-1 min-w-0 overflow-y-auto"
            style={{ marginLeft: 'var(--sidebar-width)' }}
        >
            <div className="page-enter">
                <Outlet />
            </div>
        </main>
    </div>
);