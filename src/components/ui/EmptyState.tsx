import { cn } from '@/utils/cn';

interface EmptyStateProps {
    icon: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
    className?: string;
}

export const EmptyState = ({
    icon,
    title,
    description,
    action,
    className,
}: EmptyStateProps) => (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
        <div className="flex h-14 w-14 items-center justify-center rounded-[var(--radius-xl)] bg-bg-secondary border border-border mb-4 [&>svg]:h-6 [&>svg]:w-6 [&>svg]:text-text-tertiary">
            {icon}
        </div>
        <h3 className="text-sm font-semibold text-text mb-1">{title}</h3>
        {description && (
            <p className="text-sm text-text-secondary max-w-xs">{description}</p>
        )}
        {action && <div className="mt-5">{action}</div>}
    </div>
);