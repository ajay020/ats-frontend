import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { applicationsApi } from '@/api/applications.api';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

const schema = z.object({
    jobTitle: z.string().min(1, 'Job title is required').max(150),
    companyName: z.string().min(1, 'Company name is required').max(150),
    jobUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
    status: z.enum(['WISHLIST', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER', 'REJECTED', 'WITHDRAWN', 'GHOSTED']).default('WISHLIST'),
    workMode: z.enum(['REMOTE', 'HYBRID', 'ONSITE', '']).optional(),
    jobType: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP', 'FREELANCE', '']).optional(),
    location: z.string().max(150).optional(),
    salaryMin: z.coerce.number().int().positive().optional().or(z.literal('')),
    salaryMax: z.coerce.number().int().positive().optional().or(z.literal('')),
});

type FormValues = z.infer<typeof schema>;

interface Props {
    open: boolean;
    onClose: () => void;
}

export const CreateApplicationModal = ({ open, onClose }: Props) => {
    const qc = useQueryClient();
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: { status: 'WISHLIST' },
    });

    const mutation = useMutation({
        mutationFn: (values: FormValues) =>
            applicationsApi.create({
                jobTitle: values.jobTitle,
                jobUrl: values.jobUrl || undefined,
                status: values.status,
                workMode: values.workMode || undefined,
                jobType: values.jobType || undefined,
                location: values.location || undefined,
                company: { name: values.companyName },
                salary:
                    values.salaryMin || values.salaryMax
                        ? {
                            min: Number(values.salaryMin) || undefined,
                            max: Number(values.salaryMax) || undefined,
                            currency: 'USD',
                        }
                        : undefined,
            }),
        onSuccess: () => {
            void qc.invalidateQueries({ queryKey: ['applications'] });
            reset();
            onClose();
        },
    });

    const onSubmit = (values: FormValues) => mutation.mutate(values);

    const handleClose = () => { reset(); onClose(); };

    const serverError =
        mutation.error &&
        ((mutation.error as { response?: { data?: { message?: string } } })
            .response?.data?.message ?? 'Failed to create application.');

    return (
        <Modal open={open} onClose={handleClose} title="Add application" size="lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {serverError && (
                    <div className="rounded-[var(--radius-md)] border border-red-200 bg-[var(--color-danger-bg)] px-4 py-3">
                        <p className="text-sm text-[var(--color-danger)]">{serverError}</p>
                    </div>
                )}

                {/* Row 1 */}
                <div className="grid grid-cols-2 gap-4">
                    <Input
                        label="Job title"
                        placeholder="Senior Engineer"
                        error={errors.jobTitle?.message}
                        required
                        {...register('jobTitle')}
                    />
                    <Input
                        label="Company"
                        placeholder="Stripe"
                        error={errors.companyName?.message}
                        required
                        {...register('companyName')}
                    />
                </div>

                {/* Row 2 */}
                <Input
                    label="Job posting URL"
                    type="url"
                    placeholder="https://jobs.example.com/..."
                    error={errors.jobUrl?.message}
                    {...register('jobUrl')}
                />

                {/* Row 3 */}
                <div className="grid grid-cols-3 gap-4">
                    <Select
                        label="Status"
                        {...register('status')}
                    >
                        <option value="WISHLIST">Wishlist</option>
                        <option value="APPLIED">Applied</option>
                        <option value="PHONE_SCREEN">Phone screen</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                        <option value="GHOSTED">Ghosted</option>
                    </Select>

                    <Select
                        label="Work mode"
                        placeholder="Any"
                        {...register('workMode')}
                    >
                        <option value="REMOTE">Remote</option>
                        <option value="HYBRID">Hybrid</option>
                        <option value="ONSITE">On-site</option>
                    </Select>

                    <Select
                        label="Job type"
                        placeholder="Any"
                        {...register('jobType')}
                    >
                        <option value="FULL_TIME">Full-time</option>
                        <option value="PART_TIME">Part-time</option>
                        <option value="CONTRACT">Contract</option>
                        <option value="INTERNSHIP">Internship</option>
                        <option value="FREELANCE">Freelance</option>
                    </Select>
                </div>

                {/* Row 4 */}
                <div className="grid grid-cols-3 gap-4">
                    <Input
                        label="Location"
                        placeholder="San Francisco / Remote"
                        {...register('location')}
                    />
                    <Input
                        label="Min salary (USD)"
                        type="number"
                        placeholder="120000"
                        {...register('salaryMin')}
                    />
                    <Input
                        label="Max salary (USD)"
                        type="number"
                        placeholder="160000"
                        {...register('salaryMax')}
                    />
                </div>

                <ModalFooter>
                    <Button variant="secondary" onClick={handleClose} type="button">
                        Cancel
                    </Button>
                    <Button type="submit" loading={mutation.isPending}>
                        Create application
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
};