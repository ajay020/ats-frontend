import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { Button } from './Button';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
}

const sizes = {
    sm: 'max-w-md',
    md: 'max-w-xl',
    lg: 'max-w-2xl',
};

export const Modal = ({
    open,
    onClose,
    title,
    description,
    size = 'md',
    children,
}: ModalProps) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    // Close on Escape
    useEffect(() => {
        if (!open) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [open, onClose]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = open ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            onMouseDown={(e) => { if (e.target === overlayRef.current) onClose(); }}
        >
            <div
                className={cn(
                    'relative w-full bg-surface rounded-[var(--radius-xl)]',
                    'border border-border shadow-[var(--shadow-elevated)]',
                    'animate-slide-up',
                    sizes[size],
                )}
            >
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <div>
                        <h2 className="text-base font-semibold text-text">{title}</h2>
                        {description && (
                            <p className="mt-0.5 text-sm text-text-secondary">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="ml-4 flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-text-tertiary hover:bg-surface-hover hover:text-text transition-colors"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 pb-6">{children}</div>
            </div>
        </div>
    );
};

// Footer helper for modal action rows
export const ModalFooter = ({ children }: { children: React.ReactNode }) => (
    <div className="flex items-center justify-end gap-2 pt-4 mt-4 border-t border-border">
        {children}
    </div>
);