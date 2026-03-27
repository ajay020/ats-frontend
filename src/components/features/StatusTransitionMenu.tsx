import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { STATUS_CONFIG } from '@/components/ui/Badge';
import { useUpdateStatus } from '@/hooks/useApplications';
import { cn } from '@/utils/cn';
import type { ApplicationStatus } from '@/types';

const ALL_STATUSES: ApplicationStatus[] = [
    'WISHLIST', 'APPLIED', 'PHONE_SCREEN',
    'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'GHOSTED',
];

interface Props {
    applicationId: string;
    currentStatus: ApplicationStatus;
}

export const StatusTransitionMenu = ({ applicationId, currentStatus }: Props) => {
    const [open, setOpen] = useState(false);
    const [note, setNote] = useState('');
    const [selected, setSelected] = useState<ApplicationStatus | null>(null);
    const ref = useRef<HTMLDivElement>(null);
    const updateStatus = useUpdateStatus();

    // Close on outside click
    useEffect(() => {
        if (!open) return;
        const handler = (e: MouseEvent) => {
            if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [open]);

    const handleSelect = (status: ApplicationStatus) => {
        if (status === currentStatus) { setOpen(false); return; }
        setSelected(status);
    };

    const handleConfirm = () => {
        if (!selected) return;
        updateStatus.mutate(
            { id: applicationId, status: selected, note: note.trim() || undefined },
            {
                onSuccess: () => {
                    setOpen(false);
                    setSelected(null);
                    setNote('');
                },
            },
        );
    };

    const current = STATUS_CONFIG[currentStatus];

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    'inline-flex items-center gap-2 rounded-[var(--radius-md)]',
                    'border px-3 py-1.5 text-sm font-medium transition-all duration-150',
                    'hover:shadow-[var(--shadow-card)] active:scale-[0.98]',
                )}
                style={{
                    color: current.color,
                    backgroundColor: current.bg,
                    borderColor: `${current.color}30`,
                }}
            >
                <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: current.color }}
                />
                {current.label}
                <ChevronDown
                    className={cn(
                        'h-3.5 w-3.5 transition-transform duration-150',
                        open && 'rotate-180',
                    )}
                />
            </button>

            {open && (
                <div className="absolute left-0 top-full mt-1.5 z-50 w-72 rounded-[var(--radius-lg)] border border-border bg-surface shadow-[var(--shadow-elevated)] animate-slide-up overflow-hidden">
                    {/* Status list */}
                    {!selected ? (
                        <>
                            <div className="px-3 py-2 border-b border-border">
                                <p className="text-xs font-medium text-text-tertiary uppercase tracking-wide">
                                    Move to
                                </p>
                            </div>
                            <div className="py-1">
                                {ALL_STATUSES.map((status) => {
                                    const config = STATUS_CONFIG[status];
                                    const isCurrent = status === currentStatus;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => handleSelect(status)}
                                            className={cn(
                                                'w-full flex items-center gap-3 px-3 py-2 text-sm',
                                                'transition-colors hover:bg-surface-hover',
                                                isCurrent && 'opacity-50 cursor-default',
                                            )}
                                        >
                                            <span
                                                className="h-2 w-2 rounded-full shrink-0"
                                                style={{ backgroundColor: config.color }}
                                            />
                                            <span
                                                className="flex-1 text-left font-medium"
                                                style={{ color: config.color }}
                                            >
                                                {config.label}
                                            </span>
                                            {isCurrent && (
                                                <Check className="h-3.5 w-3.5 text-text-tertiary" />
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </>
                    ) : (
                        /* Confirm + optional note */
                        <div className="p-4 space-y-3">
                            <div className="flex items-center gap-2">
                                <span
                                    className="h-2 w-2 rounded-full"
                                    style={{ backgroundColor: STATUS_CONFIG[selected].color }}
                                />
                                <p className="text-sm font-medium text-text">
                                    Move to{' '}
                                    <span style={{ color: STATUS_CONFIG[selected].color }}>
                                        {STATUS_CONFIG[selected].label}
                                    </span>
                                    ?
                                </p>
                            </div>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="Add a note about this change (optional)"
                                rows={2}
                                className="w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 py-2 text-sm placeholder:text-text-tertiary focus:border-accent focus:outline-none resize-none"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setSelected(null)}
                                    className="flex-1 rounded-[var(--radius-md)] border border-border py-1.5 text-sm text-text-secondary hover:bg-surface-hover transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    disabled={updateStatus.isPending}
                                    className="flex-1 rounded-[var(--radius-md)] py-1.5 text-sm font-medium text-white transition-colors disabled:opacity-50"
                                    style={{ backgroundColor: STATUS_CONFIG[selected].color }}
                                >
                                    {updateStatus.isPending ? 'Saving…' : 'Confirm'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};