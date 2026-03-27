import { useState } from 'react';
import { Mail, Linkedin, Phone, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications.api';
import { queryKeys } from '@/lib/queryClient';
import type { Contact } from '@/types';

interface Props { contact: Contact; applicationId: string; }

export const ContactCard = ({ contact, applicationId }: Props) => {
    const [confirming, setConfirming] = useState(false);
    const qc = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: () =>
            applicationsApi.deleteContact(applicationId, contact.id),
        onSuccess: () => {
            void qc.invalidateQueries({
                queryKey: queryKeys.applications.detail(applicationId),
            });
        },
    });

    const initials = contact.name
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div className="group flex items-start gap-4 rounded-[var(--radius-md)] border border-border bg-surface p-4 hover:border-border-strong transition-colors">
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-subtle border border-accent/20 text-sm font-semibold text-accent-text select-none">
                {initials}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text">{contact.name}</p>
                {contact.role && (
                    <p className="text-xs text-text-secondary mt-0.5">{contact.role}</p>
                )}

                <div className="mt-2 flex flex-wrap items-center gap-3">
                    {contact.email && (
                        <a
                            href={`mailto:${contact.email}`}
                            className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                        >
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-40">{contact.email}</span>
                        </a>
                    )}
                    {contact.linkedinUrl && (<a

                        href={contact.linkedinUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                        <Linkedin className="h-3 w-3 shrink-0" />
                        LinkedIn
                    </a>
                    )}
                    {contact.phone && (<a

                        href={`tel:${contact.phone}`}
                        className="flex items-center gap-1.5 text-xs text-text-secondary hover:text-accent transition-colors"
                    >
                        <Phone className="h-3 w-3 shrink-0" />
                        {contact.phone}
                    </a>
                    )}
                </div>
            </div >

            {/* Delete */}
            < div className="shrink-0" >
                {
                    confirming ? (
                        <div className="flex items-center gap-2 text-xs" >
                            <button
                                onClick={() => deleteMutation.mutate()}
                                className="text-[var(--color-danger)] font-medium hover:underline"
                            >
                                Delete
                            </button>
                            <span className="text-text-tertiary">·</span>
                            <button
                                onClick={() => setConfirming(false)}
                                className="text-text-secondary hover:underline"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setConfirming(true)}
                            className="opacity-0 group-hover:opacity-100 text-text-tertiary hover:text-[var(--color-danger)] transition-all p-1"
                        >
                            <Trash2 className="h-4 w-4" />
                        </button>
                    )}
            </div >
        </div >
    );
};