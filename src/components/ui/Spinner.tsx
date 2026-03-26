import { cn } from '@/utils/cn';

interface SpinnerProps { size?: 'sm' | 'md' | 'lg'; className?: string; }

const sizes = { sm: 'h-4 w-4', md: 'h-6 w-6', lg: 'h-8 w-8' };

export const Spinner = ({ size = 'md', className }: SpinnerProps) => (
    <div
        className={cn(
            'animate-spin rounded-full border-2 border-border border-t-accent',
            sizes[size],
            className,
        )}
    />
);

export const PageSpinner = () => (
    <div className="flex h-screen items-center justify-center bg-bg">
        <Spinner size="lg" />
    </div>
);