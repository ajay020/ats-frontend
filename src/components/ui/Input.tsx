import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
    icon?: React.ReactNode;
    iconRight?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, icon, iconRight, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="text-sm font-medium text-text"
                    >
                        {label}
                        {props.required && (
                            <span className="ml-1 text-[var(--color-danger)]">*</span>
                        )}
                    </label>
                )}

                <div className="relative flex items-center">
                    {icon && (
                        <span className="pointer-events-none absolute left-3 text-text-tertiary [&>svg]:size-4">
                            {icon}
                        </span>
                    )}
                    <input
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full rounded-[var(--radius-md)] border bg-surface px-3 py-2 text-sm text-text',
                            'placeholder:text-text-tertiary',
                            'transition-colors duration-150',
                            'border-border hover:border-border-strong',
                            'focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--shadow-glow)]',
                            error && 'border-[var(--color-danger)] focus:border-[var(--color-danger)] focus:ring-red-100',
                            icon && 'pl-9',
                            iconRight && 'pr-9',
                            className,
                        )}
                        {...props}
                    />
                    {iconRight && (
                        <span className="absolute right-3 text-text-tertiary [&>svg]:size-4">
                            {iconRight}
                        </span>
                    )}
                </div>

                {error && (
                    <p className="text-xs text-[var(--color-danger)]">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-xs text-text-tertiary">{hint}</p>
                )}
            </div>
        );
    },
);
Input.displayName = 'Input';