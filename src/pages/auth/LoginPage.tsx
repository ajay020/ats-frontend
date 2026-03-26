import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Mail, Lock, Briefcase, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const schema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(1, 'Password is required'),
});
type FormValues = z.infer<typeof schema>;

export const LoginPage = () => {
    const { login } = useAuth();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>({ resolver: zodResolver(schema) });

    const onSubmit = (data: FormValues) => login.mutate(data);

    const serverError =
        login.error &&
        ((login.error as { response?: { data?: { message?: string } } })
            .response?.data?.message ?? 'Login failed. Please try again.');

    return (
        <div className="flex min-h-screen">
            {/* Left panel — branding */}
            <div
                className="hidden lg:flex lg:w-[420px] xl:w-[480px] flex-col justify-between p-12"
                style={{ backgroundColor: '#0f172a' }}
            >
                <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[var(--radius-sm)] bg-accent">
                        <Briefcase className="h-4.5 w-4.5 text-white" />
                    </div>
                    <span className="text-base font-semibold text-white">JobTrackr</span>
                </div>

                <div>
                    <blockquote className="space-y-4">
                        <p className="text-2xl font-light text-white leading-snug">
                            "Track every application.<br />
                            Miss no opportunity."
                        </p>
                        <div className="h-px w-12 bg-accent opacity-60" />
                        <p className="text-sm text-slate-400">
                            From wishlist to offer — every stage, every contact, every note.
                        </p>
                    </blockquote>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: 'Applications tracked', value: '847' },
                        { label: 'Offers received', value: '124' },
                        { label: 'Response rate', value: '34%' },
                        { label: 'Avg. time to offer', value: '23d' },
                    ].map(({ label, value }) => (
                        <div key={label} className="rounded-[var(--radius-md)] border border-white/10 p-4">
                            <p className="text-2xl font-semibold text-white">{value}</p>
                            <p className="mt-0.5 text-xs text-slate-400">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right panel — form */}
            <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 bg-bg">
                <div className="w-full max-w-sm">
                    {/* Mobile logo */}
                    <div className="mb-8 flex items-center gap-2 lg:hidden">
                        <div className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] bg-accent">
                            <Briefcase className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-sm font-semibold text-text">JobTrackr</span>
                    </div>

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-text">Welcome back</h1>
                        <p className="mt-1 text-sm text-text-secondary">
                            Sign in to your account to continue
                        </p>
                    </div>

                    {serverError && (
                        <div className="mb-5 rounded-[var(--radius-md)] border border-red-200 bg-[var(--color-danger-bg)] px-4 py-3">
                            <p className="text-sm text-[var(--color-danger)]">{serverError}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                            required
                            {...register('password')}
                        />

                        <Button
                            type="submit"
                            className="w-full mt-2"
                            size="lg"
                            loading={login.isPending}
                            iconRight={<ArrowRight />}
                        >
                            Sign in
                        </Button>
                    </form>

                    <p className="mt-6 text-center text-sm text-text-secondary">
                        Don't have an account?{' '}
                        <Link
                            to="/register"
                            className="font-medium text-accent hover:text-[var(--color-accent-hover)] underline-offset-2 hover:underline"
                        >
                            Create one
                        </Link>
                    </p>

                    {/* Dev shortcut */}
                    <div className="mt-8 rounded-[var(--radius-md)] border border-dashed border-border p-4">
                        <p className="mb-2 text-xs font-medium text-text-tertiary uppercase tracking-wide">
                            Dev credentials
                        </p>
                        <p className="font-mono text-xs text-text-secondary">dev@example.com</p>
                        <p className="font-mono text-xs text-text-secondary">Password123!</p>
                    </div>
                </div>
            </div>
        </div>
    );
};