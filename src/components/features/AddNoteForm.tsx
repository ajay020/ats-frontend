import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PlusCircle } from 'lucide-react';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useAddNote } from '@/hooks/useApplications';

const schema = z.object({
    content: z.string().min(1, 'Note cannot be empty').max(5000),
    type: z.enum(['GENERAL', 'INTERVIEW_PREP', 'FOLLOW_UP', 'FEEDBACK']),
});
type FormValues = z.infer<typeof schema>;

interface Props { applicationId: string; }

export const AddNoteForm = ({ applicationId }: Props) => {
    const [open, setOpen] = useState(false);
    const addNote = useAddNote(applicationId);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { type: 'GENERAL' },
    });

    const onSubmit = (values: FormValues) => {
        addNote.mutate(values, {
            onSuccess: () => { reset(); setOpen(false); },
        });
    };

    if (!open) {
        return (
            <button
                onClick={() => setOpen(true)}
                className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-border px-4 py-3 text-sm text-text-tertiary hover:border-border-strong hover:text-text-secondary hover:bg-surface-hover transition-all"
            >
                <PlusCircle className="h-4 w-4 shrink-0" />
                Add a note
            </button>
        );
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="rounded-[var(--radius-md)] border border-accent/30 bg-surface overflow-hidden shadow-[var(--shadow-glow)]"
        >
            <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                    <Select className="w-44" {...register('type')}>
                        <option value="GENERAL">General</option>
                        <option value="INTERVIEW_PREP">Interview prep</option>
                        <option value="FOLLOW_UP">Follow-up</option>
                        <option value="FEEDBACK">Feedback</option>
                    </Select>
                    <button
                        type="button"
                        onClick={() => { reset(); setOpen(false); }}
                        className="ml-auto text-xs text-text-tertiary hover:text-text"
                    >
                        Cancel
                    </button>
                </div>
                <Textarea
                    placeholder="Write your note here…"
                    rows={4}
                    error={errors.content?.message}
                    autoFocus
                    {...register('content')}
                />
            </div>
            <div className="flex justify-end px-4 py-3 border-t border-border bg-bg-secondary">
                <Button type="submit" size="sm" loading={addNote.isPending}>
                    Save note
                </Button>
            </div>
        </form>
    );
};