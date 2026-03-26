import { useState } from 'react';
import { cn } from '@/utils/cn';

interface TooltipProps {
    content: string;
    children: React.ReactNode;
    side?: 'top' | 'bottom';
}

export const Tooltip = ({ content, children, side = 'top' }: TooltipProps) => {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className="relative inline-flex"
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
        >
            {children}
            {visible && (
                <div
                    className={cn(
                        'absolute z-50 whitespace-nowrap rounded-[var(--radius-sm)]',
                        'bg-text px-2 py-1 text-xs text-text-inverse',
                        'pointer-events-none left-1/2 -translate-x-1/2',
                        side === 'top'
                            ? 'bottom-full mb-1.5'
                            : 'top-full mt-1.5',
                    )}
                >
                    {content}
                </div>
            )}
        </div>
    );
};