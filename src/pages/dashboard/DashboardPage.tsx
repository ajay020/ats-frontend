import {
    Briefcase, TrendingUp, Calendar, Star,
    ArrowUpRight, Clock, CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApplicationStats } from '@/hooks/useApplications';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { StatusBadge, STATUS_CONFIG } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Button } from '@/components/ui/Button';
import type { ApplicationStatus } from '@/types';

// ── Stat card ──────────────────────────────────────────────────────────────────
const StatCard = ({
    label, value, sub, icon: Icon, accent = false,
}: {
    label: string;
    value: string | number;
    sub?: string;
    icon: React.ElementType;
    accent?: boolean;
}) => (
    <Card className={accent ? 'bg-accent border-accent' : ''}>
        <div className="flex items-start justify-between">
            <div>
                <p className={`text-xs font-medium uppercase tracking-wide ${accent ? 'text-blue-200' : 'text-text-tertiary'}`}>
                    {label}
                </p>
                <p className={`mt-1.5 text-3xl font-semibold tabular-nums ${accent ? 'text-white' : 'text-text'}`}>
                    {value}
                </p>
                {sub && (
                    <p className={`mt-1 text-xs ${accent ? 'text-blue-200' : 'text-text-tertiary'}`}>
                        {sub}
                    </p>
                )}
            </div>
            <div className={`flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] ${accent ? 'bg-white/15' : 'bg-bg-secondary'}`}>
                <Icon className={`h-4.5 w-4.5 ${accent ? 'text-white' : 'text-text-secondary'}`} />
            </div>
        </div>
    </Card>
);

// ── Status breakdown row ───────────────────────────────────────────────────────
const StatusRow = ({
    status, count, total,
}: {
    status: ApplicationStatus;
    count: number;
    total: number;
}) => {
    const config = STATUS_CONFIG[status];
    const pct = total > 0 ? Math.round((count / total) * 100) : 0;

    return (
        <div className="flex items-center gap-3">
            <span className="w-28 shrink-0 text-sm text-text-secondary">{config.label}</span>
            <div className="flex-1 h-1.5 rounded-full bg-bg-secondary overflow-hidden">
                <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, backgroundColor: config.color }}
                />
            </div>
            <span className="w-8 text-right text-sm font-medium tabular-nums text-text">
                {count}
            </span>
        </div>
    );
};

// ── Main page ──────────────────────────────────────────────────────────────────
export default function DashboardPage() {
    const { user } = useAuth();
    const { data: stats, isLoading } = useApplicationStats();
    const navigate = useNavigate();

    const greeting = () => {
        const h = new Date().getHours();
        if (h < 12) return 'Good morning';
        if (h < 17) return 'Good afternoon';
        return 'Good evening';
    };

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center py-32">
                <Spinner size="lg" />
            </div>
        );
    }

    const byStatus = stats?.byStatus ?? {};
    const total = stats?.total ?? 0;

    // Active statuses for funnel view
    const funnelStatuses: ApplicationStatus[] = [
        'WISHLIST', 'APPLIED', 'PHONE_SCREEN', 'INTERVIEW', 'OFFER',
    ];
    const negativeStatuses: ApplicationStatus[] = ['REJECTED', 'WITHDRAWN', 'GHOSTED'];

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-text">
                        {greeting()}, {user?.firstName} 👋
                    </h1>
                    <p className="mt-1 text-sm text-text-secondary">
                        Here's where your job search stands today.
                    </p>
                </div>
                <Button
                    icon={<Briefcase />}
                    onClick={() => navigate('/applications?new=true')}
                >
                    Add application
                </Button>
            </div>

            {/* Top stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    label="Total applications"
                    value={total}
                    sub="all time"
                    icon={Briefcase}
                    accent
                />
                <StatCard
                    label="In progress"
                    value={(byStatus.APPLIED ?? 0) + (byStatus.PHONE_SCREEN ?? 0) + (byStatus.INTERVIEW ?? 0)}
                    sub="active pipeline"
                    icon={TrendingUp}
                />
                <StatCard
                    label="Response rate"
                    value={`${stats?.responseRate ?? 0}%`}
                    sub="moved past applied"
                    icon={CheckCircle2}
                />
                <StatCard
                    label="Upcoming interviews"
                    value={stats?.upcomingInterviews.length ?? 0}
                    sub="scheduled"
                    icon={Calendar}
                />
            </div>

            {/* Middle row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Pipeline funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle>Application pipeline</CardTitle>
                        <span className="text-xs text-text-tertiary">{total} total</span>
                    </CardHeader>
                    <div className="space-y-3">
                        {funnelStatuses.map((s) => (
                            <StatusRow
                                key={s}
                                status={s}
                                count={byStatus[s] ?? 0}
                                total={total}
                            />
                        ))}
                        <div className="pt-2 mt-2 border-t border-border space-y-3">
                            {negativeStatuses.map((s) => (
                                <StatusRow
                                    key={s}
                                    status={s}
                                    count={byStatus[s] ?? 0}
                                    total={total}
                                />
                            ))}
                        </div>
                    </div>
                </Card>

                {/* Upcoming interviews */}
                <div className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Upcoming interviews</CardTitle>
                            <Calendar className="h-4 w-4 text-text-tertiary" />
                        </CardHeader>
                        {!stats?.upcomingInterviews.length ? (
                            <div className="py-6 text-center">
                                <Calendar className="mx-auto h-8 w-8 text-text-tertiary mb-2" />
                                <p className="text-sm text-text-tertiary">No upcoming interviews</p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {stats.upcomingInterviews.map((interview) => (
                                    <div
                                        key={interview.id}
                                        onClick={() => navigate(`/applications/${interview.id}`)}
                                        className="flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2.5 hover:bg-surface-hover cursor-pointer transition-colors"
                                    >
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-accent-subtle">
                                            <Calendar className="h-4 w-4 text-accent" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="truncate text-sm font-medium text-text">
                                                {interview.jobTitle}
                                            </p>
                                            <p className="truncate text-xs text-text-secondary">
                                                {interview.companyName}
                                            </p>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <p className="text-xs font-medium text-text">
                                                {new Date(interview.interviewAt).toLocaleDateString('en-US', {
                                                    month: 'short', day: 'numeric',
                                                })}
                                            </p>
                                            <p className="text-xs text-text-tertiary">
                                                {new Date(interview.interviewAt).toLocaleTimeString('en-US', {
                                                    hour: 'numeric', minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    {/* Offers badge */}
                    {(byStatus.OFFER ?? 0) > 0 && (
                        <Card className="border-[var(--color-success)] bg-[var(--color-success-bg)]">
                            <div className="flex items-center gap-3">
                                <Star className="h-5 w-5 text-[var(--color-success)]" />
                                <div>
                                    <p className="text-sm font-semibold text-[var(--color-success)]">
                                        {byStatus.OFFER} offer{byStatus.OFFER > 1 ? 's' : ''} received!
                                    </p>
                                    <p className="text-xs text-[var(--color-success)] opacity-80">
                                        Congratulations — review them soon
                                    </p>
                                </div>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Recent activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent activity</CardTitle>
                    <Button
                        variant="ghost"
                        size="sm"
                        iconRight={<ArrowUpRight />}
                        onClick={() => navigate('/applications')}
                    >
                        View all
                    </Button>
                </CardHeader>

                {!stats?.recentActivity.length ? (
                    <div className="py-10 text-center">
                        <Briefcase className="mx-auto h-8 w-8 text-text-tertiary mb-2" />
                        <p className="text-sm text-text-secondary">No applications yet</p>
                        <Button
                            className="mt-4"
                            size="sm"
                            onClick={() => navigate('/applications?new=true')}
                        >
                            Add your first application
                        </Button>
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {stats.recentActivity.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => navigate(`/applications/${item.id}`)}
                                className="flex items-center gap-4 py-3 px-1 hover:bg-surface-hover rounded-[var(--radius-md)] cursor-pointer transition-colors -mx-1 px-2"
                            >
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-secondary border border-border">
                                    <span className="text-xs font-semibold text-text-secondary">
                                        {item.companyName[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-text">
                                        {item.jobTitle}
                                    </p>
                                    <p className="truncate text-xs text-text-secondary">
                                        {item.companyName}
                                    </p>
                                </div>
                                <StatusBadge status={item.status} size="sm" />
                                <div className="flex items-center gap-1 text-xs text-text-tertiary shrink-0">
                                    <Clock className="h-3 w-3" />
                                    <span>
                                        {new Date(item.updatedAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};