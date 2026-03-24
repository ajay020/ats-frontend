import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
    loading?: boolean;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
}

const variants: Record<Variant, string> = {
    primary:
        'bg-accent text-text-inverse hover:bg-[var(--color-accent-hover)] active:scale-[0.98]',
    secondary:
        'bg-surface border border-border text-text hover:bg-surface-hover active:bg-surface-active',
    ghost:
        'bg-transparent text-text-secondary hover:bg-surface-hover hover:text-text active:bg-surface-active',
    danger:
        'bg-[var(--color-danger-bg)] text-[var(--color-danger)] border border-[var(--color-danger)] border-opacity-30 hover:bg-red-100',
};

const sizes: Record<Size, string> = {
    sm: 'h-7  px-3   text-xs  gap-1.5 rounded-[var(--radius-sm)]',
    md: 'h-9  px-4   text-sm  gap-2   rounded-[var(--radius-md)]',
    lg: 'h-11 px-5   text-base gap-2  rounded-[var(--radius-md)]',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            loading = false,
            icon,
            iconRight,
            children,
            className,
            disabled,
            ...props
        },
        ref,
    ) => {
        return (
            <button
                ref={ref}
                disabled={disabled || loading}
                className={cn(
                    'inline-flex items-center justify-center font-medium',
                    'transition-all duration-150 select-none',
                    'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
                    variants[variant],
                    sizes[size],
                    className,
                )}
                {...props}
            >
                {loading ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                    icon && <span className="shrink-0 [&>svg]:size-4">{icon}</span>
                )}
                {children && <span>{children}</span>}
                {iconRight && !loading && (
                    <span className="shrink-0 [&>svg]:size-4">{iconRight}</span>
                )}
            </button>
        );
    },
);
Button.displayName = 'Button';