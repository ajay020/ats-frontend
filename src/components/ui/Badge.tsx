import { cn } from '@/utils/cn';
import type { ApplicationStatus } from '@/types';

// Status display config — label + colour for each status
export const STATUS_CONFIG: Record<
    ApplicationStatus,
    { label: string; color: string; bg: string }
> = {
    WISHLIST: { label: 'Wishlist', color: '#6366f1', bg: '#eef2ff' },
    APPLIED: { label: 'Applied', color: '#2563eb', bg: '#eff6ff' },
    PHONE_SCREEN: { label: 'Phone Screen', color: '#0891b2', bg: '#ecfeff' },
    INTERVIEW: { label: 'Interview', color: '#7c3aed', bg: '#f5f3ff' },
    OFFER: { label: 'Offer', color: '#16a34a', bg: '#f0fdf4' },
    REJECTED: { label: 'Rejected', color: '#dc2626', bg: '#fef2f2' },
    WITHDRAWN: { label: 'Withdrawn', color: '#78716c', bg: '#f5f5f4' },
    GHOSTED: { label: 'Ghosted', color: '#d97706', bg: '#fffbeb' },
};

interface StatusBadgeProps {
    status: ApplicationStatus;
    size?: 'sm' | 'md';
}

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
    const config = STATUS_CONFIG[status];
    return (
        <span
            className={cn(
                'inline-flex items-center font-medium rounded-full',
                size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
            )}
            style={{ color: config.color, backgroundColor: config.bg }}
        >
            <span
                className="mr-1.5 h-1.5 w-1.5 rounded-full shrink-0"
                style={{ backgroundColor: config.color }}
            />
            {config.label}
        </span>
    );
};

// Generic badge for non-status use
interface BadgeProps {
    children: React.ReactNode;
    variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
    className?: string;
}

const badgeVariants = {
    default: 'bg-bg-secondary text-text-secondary',
    success: 'bg-[var(--color-success-bg)] text-[var(--color-success)]',
    warning: 'bg-[var(--color-warning-bg)] text-[var(--color-warning)]',
    danger: 'bg-[var(--color-danger-bg)]  text-[var(--color-danger)]',
    info: 'bg-accent-subtle text-accent-text',
};

export const Badge = ({ children, variant = 'default', className }: BadgeProps) => (
    <span
        className={cn(
            'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
            badgeVariants[variant],
            className,
        )}
    >
        {children}
    </span>
);