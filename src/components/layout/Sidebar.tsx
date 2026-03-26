import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Briefcase,
    LogOut,
    ChevronRight,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

const NAV_ITEMS = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/applications', label: 'Applications', icon: Briefcase },
];

export const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const initials = user
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : '??';

    return (
        <aside
            className="fixed inset-y-0 left-0 z-30 flex flex-col bg-surface border-r border-border"
            style={{ width: 'var(--sidebar-width)' }}
        >
            {/* Logo */}
            <div className="flex h-14 items-center gap-2.5 px-5 border-b border-border">
                <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent">
                    <Briefcase className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-semibold tracking-tight text-text">
                    JobTrackr
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
                {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            cn(
                                'group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2',
                                'text-sm font-medium transition-colors duration-150',
                                isActive
                                    ? 'bg-accent-subtle text-accent-text'
                                    : 'text-text-secondary hover:bg-surface-hover hover:text-text',
                            )
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-accent' : '')} />
                                <span className="flex-1">{label}</span>
                                {isActive && (
                                    <ChevronRight className="h-3.5 w-3.5 text-accent opacity-60" />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* User section */}
            <div className="border-t border-border p-3">
                <div className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2 mb-1">
                    {/* Avatar */}
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-bg-secondary border border-border text-xs font-semibold text-text-secondary">
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-text leading-none mb-0.5">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="truncate text-xs text-text-tertiary">{user?.email}</p>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-text-secondary"
                    icon={<LogOut />}
                    loading={logout.isPending}
                    onClick={() => logout.mutate()}
                >
                    Sign out
                </Button>
            </div>
        </aside>
    );
};