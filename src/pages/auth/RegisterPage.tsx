import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, User, ArrowRight, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Enter a valid email'),
    password: z
        .string()
        .min(8, 'At least 8 characters')
        .regex(/[A-Z]/, 'One uppercase letter')
        .regex(/[0-9]/, 'One number')
        .regex(/[^A-Za-z0-9]/, 'One special character'),
});
type FormValues = z.infer<typeof schema>;

export const RegisterPage = () => {
    const { register: registerAuth } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = (data: FormValues) => registerAuth.mutate(data);

    const serverError =
        registerAuth.error &&
        ((registerAuth.error as { response?: { data?: { message?: string } } })
            .response?.data?.message ?? 'Registration failed.');

    return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
            <div className="w-full max-w-sm">
                <div className="mb-8 flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent">
                        <Briefcase className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-text">JobTrackr</span>
                </div>

                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-text">Create your account</h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Start tracking your job search today
                    </p>
                </div>

                {serverError && (
                    <div className="mb-5 rounded-[var(--radius-md)] border border-red-200 bg-[var(--color-danger-bg)] px-4 py-3">
                        <p className="text-sm text-[var(--color-danger)]">{serverError}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Input
                            label="First name"
                            placeholder="Alex"
                            icon={<User />}
                            error={errors.firstName?.message}
                            required
                            {...register('firstName')}
                        />
                        <Input
                            label="Last name"
                            placeholder="Dev"
                            error={errors.lastName?.message}
                            required
                            {...register('lastName')}
                        />
                    </div>
                    <Input
                        label="Email address"
                        type="email"
                        placeholder="you@example.com"
                        icon={<Mail />}
                        error={errors.email?.message}
                        required
                        {...register('email')}
                    />
                    <Input
                        label="Password"
                        type="password"
                        placeholder="••••••••"
                        icon={<Lock />}
                        error={errors.password?.message}
                        hint="Min 8 chars, one uppercase, one number, one special char"
                        required
                        {...register('password')}
                    />
                    <Button
                        type="submit"
                        className="w-full mt-2"
                        size="lg"
                        loading={registerAuth.isPending}
                        iconRight={<ArrowRight />}
                    >
                        Create account
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-text-secondary">
                    Already have an account?{' '}
                    <Link
                        to="/login"
                        className="font-medium text-accent hover:text-[var(--color-accent-hover)] underline-offset-2 hover:underline"
                    >
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};