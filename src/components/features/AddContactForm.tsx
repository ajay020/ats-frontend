import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserPlus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications.api';
import { queryKeys } from '@/lib/queryClient';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';

const schema = z.object({
    name: z.string().min(1, 'Name is required').max(100),
    role: z.string().max(100).optional(),
    email: z.string().email('Invalid email').optional().or(z.literal('')),
    linkedinUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    phone: z.string().max(30).optional(),
});
type FormValues = z.infer<typeof schema>;

interface Props { applicationId: string; }

export const AddContactForm = ({ applicationId }: Props) => {
    const [open, setOpen] = useState(false);
    const qc = useQueryClient();

    const mutation = useMutation({
        mutationFn: (data: FormValues) =>
            applicationsApi.addContact(applicationId, data),
        onSuccess: () => {
            void qc.invalidateQueries({
                queryKey: queryKeys.applications.detail(applicationId),
            });
            reset();
            setOpen(false);
        },
    });

    const { register, handleSubmit, reset, formState: { errors } } =
        useForm<FormValues>({ resolver: zodResolver(schema) });

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="flex w-full items-center gap-2 rounded-[var(--radius-md)] border border-dashed border-border px-4 py-3 text-sm text-text-tertiary hover:border-border-strong hover:text-text-secondary hover:bg-surface-hover transition-all"
            >
                <UserPlus className="h-4 w-4 shrink-0" />
                Add a contact
            </button>

            <Modal
                open={open}
                onClose={() => { reset(); setOpen(false); }}
                title="Add contact"
                size="sm"
            >
                <form onSubmit={handleSubmit((v) => mutation.mutate(v))} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="Name"
                            placeholder="Sarah Mitchell"
                            error={errors.name?.message}
                            required
                            {...register('name')}
                        />
                        <Input
                            label="Role"
                            placeholder="Recruiter"
                            {...register('role')}
                        />
                    </div>
                    <Input
                        label="Email"
                        type="email"
                        placeholder="sarah@company.com"
                        error={errors.email?.message}
                        {...register('email')}
                    />
                    <Input
                        label="LinkedIn URL"
                        type="url"
                        placeholder="https://linkedin.com/in/..."
                        error={errors.linkedinUrl?.message}
                        {...register('linkedinUrl')}
                    />
                    <Input
                        label="Phone"
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        {...register('phone')}
                    />
                    <ModalFooter>
                        <Button variant="secondary" type="button" onClick={() => { reset(); setOpen(false); }}>
                            Cancel
                        </Button>
                        <Button type="submit" loading={mutation.isPending}>
                            Add contact
                        </Button>
                    </ModalFooter>
                </form>
            </Modal>
        </>
    );
};