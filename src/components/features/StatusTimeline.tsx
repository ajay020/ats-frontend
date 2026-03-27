import { ArrowRight } from 'lucide-react';
import { STATUS_CONFIG } from '@/components/ui/Badge';
import type { StatusHistory } from '@/types';

interface Props { history: StatusHistory[]; }

export const StatusTimeline = ({ history }: Props) => {
    if (!history.length) return (
        <p className="text-sm text-text-tertiary py-4">No history recorded yet.</p>
    );

    return (
        <ol className="relative space-y-0">
            {history.map((entry, i) => {
                const to = STATUS_CONFIG[entry.toStatus];
                const from = entry.fromStatus ? STATUS_CONFIG[entry.fromStatus] : null;
                const isLast = i === history.length - 1;

                return (
                    <li key={entry.id} className="relative flex gap-4 pb-6">
                        {/* Vertical connector line */}
                        {!isLast && (
                            <div className="absolute left-[11px] top-6 bottom-0 w-px bg-border" />
                        )}

                        {/* Dot */}
                        <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center">
                            <span
                                className="h-3 w-3 rounded-full border-2 border-surface"
                                style={{
                                    backgroundColor: to.color,
                                    boxShadow: `0 0 0 2px ${to.color}30`,
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pt-0.5">
                            <div className="flex flex-wrap items-center gap-2">
                                {from ? (
                                    <>
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{ color: from.color, backgroundColor: from.bg }}
                                        >
                                            {from.label}
                                        </span>
                                        <ArrowRight className="h-3 w-3 text-text-tertiary shrink-0" />
                                        <span
                                            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                            style={{ color: to.color, backgroundColor: to.bg }}
                                        >
                                            {to.label}
                                        </span>
                                    </>
                                ) : (
                                    <span
                                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                                        style={{ color: to.color, backgroundColor: to.bg }}
                                    >
                                        Created as {to.label}
                                    </span>
                                )}
                            </div>
                            {entry.note && (
                                <p className="mt-1.5 text-sm text-text-secondary leading-relaxed">
                                    {entry.note}
                                </p>
                            )}
                            <p className="mt-1 text-xs text-text-tertiary">
                                {new Date(entry.changedAt).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </li>
                );
            })}
        </ol>
    );
};