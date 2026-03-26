import { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, placeholder, className, children, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-text">
                        {label}
                    </label>
                )}
                <div className="relative">
                    <select
                        ref={ref}
                        id={inputId}
                        className={cn(
                            'w-full appearance-none rounded-[var(--radius-md)] border border-border',
                            'bg-surface px-3 py-2 pr-8 text-sm text-text',
                            'hover:border-border-strong transition-colors duration-150',
                            'focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--shadow-glow)]',
                            error && 'border-[var(--color-danger)]',
                            className,
                        )}
                        {...props}
                    >
                        {placeholder && (
                            <option value="">{placeholder}</option>
                        )}
                        {children}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
                </div>
                {error && <p className="text-xs text-[var(--color-danger)]">{error}</p>}
            </div>
        );
    },
);
Select.displayName = 'Select';