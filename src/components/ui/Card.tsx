import { cn } from '@/utils/cn';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
    onClick?: () => void;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddings = {
    none: '',
    sm: 'p-4',
    md: 'p-5',
    lg: 'p-6',
};

export const Card = ({
    children,
    className,
    hover = false,
    onClick,
    padding = 'md',
}: CardProps) => (
    <div
        onClick={onClick}
        className={cn(
            'bg-surface rounded-[var(--radius-lg)] border border-border',
            'shadow-[var(--shadow-card)]',
            paddings[padding],
            hover && 'transition-all duration-150 cursor-pointer hover:border-border-strong hover:shadow-[var(--shadow-elevated)] hover:-translate-y-px',
            onClick && 'cursor-pointer',
            className,
        )}
    >
        {children}
    </div>
);

export const CardHeader = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <div className={cn('flex items-center justify-between mb-4', className)}>
        {children}
    </div>
);

export const CardTitle = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => (
    <h3 className={cn('text-sm font-semibold text-text', className)}>
        {children}
    </h3>
);