import { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications.api';
import { queryKeys } from '@/lib/queryClient';
import { cn } from '@/utils/cn';
import { timeAgo } from '@/utils/formatters';
import type { Note } from '@/types';

const NOTE_TYPE_LABELS: Record<string, { label: string; color: string; bg: string }> = {
    GENERAL: { label: 'General', color: '#5c5a54', bg: '#f5f4f0' },
    INTERVIEW_PREP: { label: 'Interview prep', color: '#7c3aed', bg: '#f5f3ff' },
    FOLLOW_UP: { label: 'Follow-up', color: '#0891b2', bg: '#ecfeff' },
    FEEDBACK: { label: 'Feedback', color: '#d97706', bg: '#fffbeb' },
};

interface Props {
    note: Note;
    applicationId: string;
}

export const NoteCard = ({ note, applicationId }: Props) => {
    const [expanded, setExpanded] = useState(true);
    const [confirming, setConfirming] = useState(false);
    const qc = useQueryClient();
    const config = NOTE_TYPE_LABELS[note.type] ?? NOTE_TYPE_LABELS.GENERAL;

    const deleteMutation = useMutation({
        mutationFn: () => applicationsApi.deleteNote(applicationId, note.id),
        onSuccess: () => {
            void qc.invalidateQueries({
                queryKey: queryKeys.applications.detail(applicationId),
            });
        },
    });

    return (
        <div className="rounded-[var(--radius-md)] border border-border bg-surface overflow-hidden">
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-2.5 bg-bg-secondary border-b border-border">
                <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ color: config.color, backgroundColor: config.bg }}
                >
                    {config.label}
                </span>
                <span className="flex-1 text-xs text-text-tertiary">
                    {timeAgo(note.createdAt)}
                </span>

                <div className="flex items-center gap-1">
                    {confirming ? (
                        <>
                            <span className="text-xs text-text-secondary mr-1">Delete?</span>
                            <button
                                onClick={() => deleteMutation.mutate()}
                                className="text-xs text-[var(--color-danger)] font-medium hover:underline"
                            >
                                Yes
                            </button>
                            <span className="text-text-tertiary text-xs mx-1">·</span>
                            <button
                                onClick={() => setConfirming(false)}
                                className="text-xs text-text-secondary hover:underline"
                            >
                                No
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            className="text-text-tertiary hover:text-[var(--color-danger)] transition-colors p-0.5"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    )}

                    <button
                        onClick={() => setExpanded((v) => !v)}
                        className="text-text-tertiary hover:text-text transition-colors p-0.5"
                    >
                        <ChevronDown
                            className={cn(
                                'h-3.5 w-3.5 transition-transform duration-200',
                                !expanded && '-rotate-90',
                            )}
                        />
                    </button>
                </div>
            </div>

            {/* Body */}
            {expanded && (
                <div className="px-4 py-3">
                    <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">
                        {note.content}
                    </p>
                </div>
            )}
        </div>
    );
};