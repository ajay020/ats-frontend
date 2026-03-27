import { forwardRef } from 'react';
import { cn } from '@/utils/cn';

interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');
        return (
            <div className="flex flex-col gap-1.5">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-text">
                        {label}
                        {props.required && (
                            <span className="ml-1 text-[var(--color-danger)]">*</span>
                        )}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full rounded-[var(--radius-md)] border border-border',
                        'bg-surface px-3 py-2 text-sm text-text',
                        'placeholder:text-text-tertiary resize-y min-h-20',
                        'transition-colors duration-150',
                        'hover:border-border-strong',
                        'focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--shadow-glow)]',
                        error &&
                        'border-[var(--color-danger)] focus:border-[var(--color-danger)]',
                        className,
                    )}
                    {...props}
                />
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
Textarea.displayName = 'Textarea';