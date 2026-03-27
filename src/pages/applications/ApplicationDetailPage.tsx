import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft, ExternalLink, Star, MapPin,
    Briefcase, Calendar, DollarSign, Clock,
    FileText, Users, GitBranch, Building2,
} from 'lucide-react';
import { useApplication, useToggleFavorite } from '@/hooks/useApplications';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs';
import { StatusTransitionMenu } from '@/components/features/StatusTransitionMenu';
import { StatusTimeline } from '@/components/features/StatusTimeline';
import { NoteCard } from '@/components/features/NoteCard';
import { AddNoteForm } from '@/components/features/AddNoteForm';
import { ContactCard } from '@/components/features/ContactCard';
import { AddContactForm } from '@/components/features/AddContactForm';
import { formatSalary, WORK_MODE_LABELS, JOB_TYPE_LABELS, PRIORITY_LABELS, timeAgo } from '@/utils/formatters';

// ── Meta pill ──────────────────────────────────────────────────────────────────
const MetaPill = ({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ElementType;
    label: string;
    value: string | null | undefined;
}) => {
    if (!value) return null;
    return (
        <div className="flex items-center gap-2 rounded-[var(--radius-md)] border border-border bg-surface px-3 py-2">
            <Icon className="h-3.5 w-3.5 shrink-0 text-text-tertiary" />
            <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-text-tertiary">
                    {label}
                </p>
                <p className="text-sm font-medium text-text truncate">{value}</p>
            </div>
        </div>
    );
};

// ── Main page ──────────────────────────────────────────────────────────────────
export const ApplicationDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { data: app, isLoading, error } = useApplication(id!);
    const toggleFav = useToggleFavorite();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Spinner size="lg" />
            </div>
        );
    }

    if (error || !app) {
        return (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
                <p className="text-text-secondary">Application not found.</p>
                <Button variant="secondary" onClick={() => navigate('/applications')}>
                    Back to applications
                </Button>
            </div>
        );
    }

    const priority = PRIORITY_LABELS[app.priority];

    return (
        <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">

            {/* ── Back + breadcrumb ─────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 text-sm text-text-tertiary">
                <button
                    onClick={() => navigate('/applications')}
                    className="flex items-center gap-1.5 hover:text-text transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Applications
                </button>
                <span>/</span>
                <span className="text-text-secondary truncate max-w-64">{app.jobTitle}</span>
            </div>

            {/* ── Hero header ───────────────────────────────────────────────────── */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-4">
                    {/* Company avatar */}
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-lg)] bg-bg-secondary border border-border text-xl font-bold text-text-secondary select-none">
                        {app.company.name[0].toUpperCase()}
                    </div>

                    <div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <h1 className="text-2xl font-semibold text-text leading-tight">
                                {app.jobTitle}
                            </h1>
                            <button
                                onClick={() => toggleFav.mutate(app.id)}
                                className="text-text-tertiary hover:text-[#d97706] transition-colors"
                            >
                                <Star
                                    className={`h-5 w-5 ${app.isFavorite ? 'fill-[#d97706] text-[#d97706]' : ''}`}
                                />
                            </button>
                        </div>
                        <div className="mt-1 flex items-center gap-2 text-sm text-text-secondary flex-wrap">
                            <span className="flex items-center gap-1.5">
                                <Building2 className="h-4 w-4 text-text-tertiary" />
                                {app.company.name}
                            </span>
                            {app.company.industry && (
                                <>
                                    <span className="text-text-tertiary">·</span>
                                    <span>{app.company.industry}</span>
                                </>
                            )}
                            {app.location && (
                                <>
                                    <span className="text-text-tertiary">·</span>
                                    <span className="flex items-center gap-1">
                                        <MapPin className="h-3.5 w-3.5 text-text-tertiary" />
                                        {app.location}
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {app.jobUrl && (
                        <Button
                            variant="secondary"
                            size="sm"
                            icon={<ExternalLink />}
                            onClick={() => window.open(app.jobUrl!, '_blank')}
                        >
                            View posting
                        </Button>
                    )}
                    <StatusTransitionMenu
                        applicationId={app.id}
                        currentStatus={app.status}
                    />
                </div>
            </div>

            {/* ── Meta pills row ─────────────────────────────────────────────────── */}
            <div className="flex flex-wrap gap-3">
                {app.workMode && (
                    <MetaPill
                        icon={Briefcase}
                        label="Work mode"
                        value={WORK_MODE_LABELS[app.workMode]}
                    />
                )}
                {app.jobType && (
                    <MetaPill
                        icon={Clock}
                        label="Job type"
                        value={JOB_TYPE_LABELS[app.jobType]}
                    />
                )}
                {app.salary && (
                    <MetaPill
                        icon={DollarSign}
                        label="Salary"
                        value={formatSalary(app.salary.min, app.salary.max, app.salary.currency)}
                    />
                )}
                {app.appliedAt && (
                    <MetaPill
                        icon={Calendar}
                        label="Applied"
                        value={new Date(app.appliedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    />
                )}
                {app.interviewAt && (
                    <MetaPill
                        icon={Calendar}
                        label="Interview"
                        value={new Date(app.interviewAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: '2-digit',
                        })}
                    />
                )}
                <MetaPill
                    icon={Clock}
                    label="Priority"
                    value={priority.label}
                />
            </div>

            {/* ── Main two-column layout ─────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left — tabbed content (2/3 width) */}
                <div className="lg:col-span-2 space-y-4">
                    <Card padding="none">
                        <Tabs defaultTab="notes">
                            <TabList className="px-2 pt-1">
                                <Tab id="notes" count={app.notes.length}>
                                    <FileText className="h-3.5 w-3.5" />
                                    Notes
                                </Tab>
                                <Tab id="contacts" count={app.contacts.length}>
                                    <Users className="h-3.5 w-3.5" />
                                    Contacts
                                </Tab>
                                <Tab id="description">
                                    <Briefcase className="h-3.5 w-3.5" />
                                    Job description
                                </Tab>
                                <Tab id="history" count={app.statusHistory.length}>
                                    <GitBranch className="h-3.5 w-3.5" />
                                    History
                                </Tab>
                            </TabList>

                            {/* ── Notes tab ──────────────────────────────────────────── */}
                            <TabPanel id="notes" className="p-5 space-y-3">
                                <AddNoteForm applicationId={app.id} />
                                {app.notes.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-text-tertiary">
                                        No notes yet. Add one above.
                                    </p>
                                ) : (
                                    app.notes.map((note) => (
                                        <NoteCard
                                            key={note.id}
                                            note={note}
                                            applicationId={app.id}
                                        />
                                    ))
                                )}
                            </TabPanel>

                            {/* ── Contacts tab ───────────────────────────────────────── */}
                            <TabPanel id="contacts" className="p-5 space-y-3">
                                <AddContactForm applicationId={app.id} />
                                {app.contacts.length === 0 ? (
                                    <p className="py-6 text-center text-sm text-text-tertiary">
                                        No contacts added. Add the recruiter or hiring manager.
                                    </p>
                                ) : (
                                    app.contacts.map((contact) => (
                                        <ContactCard
                                            key={contact.id}
                                            contact={contact}
                                            applicationId={app.id}
                                        />
                                    ))
                                )}
                            </TabPanel>

                            {/* ── Job description tab ────────────────────────────────── */}
                            <TabPanel id="description" className="p-5">
                                {app.jobDescription ? (
                                    <div className="prose prose-sm max-w-none">
                                        <pre className="whitespace-pre-wrap font-sans text-sm text-text leading-relaxed">
                                            {app.jobDescription}
                                        </pre>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center">
                                        <FileText className="mx-auto h-8 w-8 text-text-tertiary mb-2" />
                                        <p className="text-sm text-text-tertiary">
                                            No job description saved.
                                        </p>
                                        <p className="text-xs text-text-tertiary mt-1">
                                            Paste it when editing the application.
                                        </p>
                                    </div>
                                )}
                            </TabPanel>

                            {/* ── Status history tab ─────────────────────────────────── */}
                            <TabPanel id="history" className="p-5">
                                <StatusTimeline history={app.statusHistory} />
                            </TabPanel>
                        </Tabs>
                    </Card>
                </div>

                {/* Right — sidebar (1/3 width) */}
                <div className="space-y-4">

                    {/* Company card */}
                    <Card>
                        <div className="flex items-center gap-2 mb-3">
                            <Building2 className="h-4 w-4 text-text-tertiary" />
                            <h3 className="text-sm font-semibold text-text">Company</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm font-medium text-text">{app.company.name}</p>
                            {app.company.industry && (
                                <p className="text-xs text-text-secondary">{app.company.industry}</p>
                            )}
                            {app.company.location && (
                                <p className="flex items-center gap-1.5 text-xs text-text-secondary">
                                    <MapPin className="h-3 w-3 shrink-0 text-text-tertiary" />
                                    {app.company.location}
                                </p>
                            )}
                            {app.company.website && (<a
                                href={app.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 text-xs text-accent hover:underline"
                            >
                                <ExternalLink className="h-3 w-3 shrink-0" />
                                {app.company.website.replace(/^https?:\/\//, '')}
                            </a>
                            )}
                        </div>
                    </Card>

                    {/* Offer deadline */}
                    {app.offerDeadline && (
                        <Card className="border-[var(--color-warning)] bg-[var(--color-warning-bg)]">
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="h-4 w-4 text-[var(--color-warning)]" />
                                <h3 className="text-sm font-semibold text-[var(--color-warning)]">
                                    Offer deadline
                                </h3>
                            </div>
                            <p className="text-sm text-[var(--color-warning)]">
                                {new Date(app.offerDeadline).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                })}
                            </p>
                        </Card>
                    )}

                    {/* Timeline snapshot */}
                    <Card>
                        <div className="flex items-center gap-2 mb-3">
                            <GitBranch className="h-4 w-4 text-text-tertiary" />
                            <h3 className="text-sm font-semibold text-text">Timeline</h3>
                        </div>
                        <div className="space-y-2 text-xs text-text-secondary">
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Created</span>
                                <span>{timeAgo(app.createdAt)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Last updated</span>
                                <span>{timeAgo(app.updatedAt)}</span>
                            </div>
                            {app.appliedAt && (
                                <div className="flex justify-between">
                                    <span className="text-text-tertiary">Applied</span>
                                    <span>
                                        {new Date(app.appliedAt).toLocaleDateString('en-US', {
                                            month: 'short', day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-text-tertiary">Status changes</span>
                                <span>{app.statusHistory.length}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Quick stats */}
                    <Card>
                        <div className="flex items-center gap-2 mb-3">
                            <Briefcase className="h-4 w-4 text-text-tertiary" />
                            <h3 className="text-sm font-semibold text-text">Activity</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                            {[
                                { label: 'Notes', value: app.notes.length },
                                { label: 'Contacts', value: app.contacts.length },
                                { label: 'Updates', value: app.statusHistory.length },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center rounded-[var(--radius-md)] bg-bg-secondary border border-border py-2.5"
                                >
                                    <span className="text-xl font-semibold tabular-nums text-text">
                                        {value}
                                    </span>
                                    <span className="text-[10px] text-text-tertiary mt-0.5">{label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                </div>
            </div >
        </div >
    );
};