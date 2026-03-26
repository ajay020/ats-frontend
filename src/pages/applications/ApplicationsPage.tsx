import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Search, Plus, Briefcase, Star, StarOff,
    ExternalLink, Trash2, ChevronUp, ChevronDown,
    SlidersHorizontal, X, MapPin, Clock,
} from 'lucide-react';
import { useApplications, useToggleFavorite, useDeleteApplication } from '@/hooks/useApplications';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { StatusBadge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { Tooltip } from '@/components/ui/Tooltip';
import { EmptyState } from '@/components/ui/EmptyState';
import { CreateApplicationModal } from '@/components/features/CreateApplicationModal';
import { DeleteConfirmModal } from '@/components/features/DeleteConfirmModal';
import {
    formatSalary, timeAgo,
    PRIORITY_LABELS, WORK_MODE_LABELS, JOB_TYPE_LABELS,
} from '@/utils/formatters';
import type { ApplicationStatus, WorkMode, JobType, ApplicationSummary, ApplicationsQuery } from '@/types';
import { cn } from '@/utils/cn';

// ── Filter bar ─────────────────────────────────────────────────────────────────
interface FilterBarProps {
    filters: ApplicationsQuery;
    onChange: (patch: Partial<ApplicationsQuery>) => void;
    onReset: () => void;
    activeCount: number;
}

const FilterBar = ({ filters, onChange, onReset, activeCount }: FilterBarProps) => (
    <div className="flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-48">
            <Input
                placeholder="Search job title, company…"
                icon={<Search />}
                value={filters.search ?? ''}
                onChange={(e) => onChange({ search: e.target.value || undefined, page: 1 })}
            />
        </div>

        <Select
            value={filters.status ?? ''}
            onChange={(e) =>
                onChange({ status: (e.target.value as ApplicationStatus) || undefined, page: 1 })
            }
            placeholder="All statuses"
            className="w-40"
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
            value={filters.workMode ?? ''}
            onChange={(e) =>
                onChange({ workMode: (e.target.value as WorkMode) || undefined, page: 1 })
            }
            placeholder="Work mode"
            className="w-36"
        >
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
        </Select>

        <Select
            value={filters.jobType ?? ''}
            onChange={(e) =>
                onChange({ jobType: (e.target.value as JobType) || undefined, page: 1 })
            }
            placeholder="Job type"
            className="w-36"
        >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
            <option value="FREELANCE">Freelance</option>
        </Select>

        <Select
            value={filters.isFavorite === true ? 'true' : filters.isFavorite === false ? 'false' : ''}
            onChange={(e) => {
                const v = e.target.value;
                onChange({
                    isFavorite: v === 'true' ? true : v === 'false' ? false : undefined,
                    page: 1,
                });
            }}
            placeholder="Favorites"
            className="w-32"
        >
            <option value="true">Starred only</option>
            <option value="false">Unstarred</option>
        </Select>

        {activeCount > 0 && (
            <Button variant="ghost" size="md" icon={<X />} onClick={onReset}>
                Clear ({activeCount})
            </Button>
        )}
    </div>
);

// ── Sort header cell ───────────────────────────────────────────────────────────
interface SortCellProps {
    field: ApplicationsQuery['sortBy'];
    current: ApplicationsQuery['sortBy'];
    order: ApplicationsQuery['sortOrder'];
    onSort: (field: ApplicationsQuery['sortBy']) => void;
    children: React.ReactNode;
    className?: string;
}

const SortCell = ({ field, current, order, onSort, children, className }: SortCellProps) => {
    const active = current === field;
    return (
        <th
            className={cn(
                'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary',
                'cursor-pointer select-none hover:text-text transition-colors',
                className,
            )}
            onClick={() => onSort(field)}
        >
            <span className="inline-flex items-center gap-1">
                {children}
                <span className="flex flex-col gap-px">
                    <ChevronUp className={cn('h-3 w-3', active && order === 'asc' ? 'text-accent' : 'text-border-strong')} />
                    <ChevronDown className={cn('h-3 w-3', active && order === 'desc' ? 'text-accent' : 'text-border-strong')} />
                </span>
            </span>
        </th>
    );
};

// ── Application row ────────────────────────────────────────────────────────────
interface RowProps {
    app: ApplicationSummary;
    onDelete: (app: ApplicationSummary) => void;
}

const ApplicationRow = ({ app, onDelete }: RowProps) => {
    const navigate = useNavigate();
    const toggleFav = useToggleFavorite();
    const priority = PRIORITY_LABELS[app.priority];

    return (
        <tr
            className="group border-b border-border hover:bg-surface-hover transition-colors cursor-pointer"
            onClick={() => navigate(`/applications/${app.id}`)}
        >
            {/* Favorite */}
            <td className="w-10 px-3 py-3.5">
                <button
                    className="text-text-tertiary hover:text-[#d97706] transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFav.mutate(app.id);
                    }}
                >
                    {app.isFavorite
                        ? <Star className="h-4 w-4 fill-[#d97706] text-[#d97706]" />
                        : <StarOff className="h-4 w-4 opacity-0 group-hover:opacity-100" />
                    }
                </button>
            </td>

            {/* Company + title */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bg-secondary border border-border text-sm font-semibold text-text-secondary select-none">
                        {app.company.name[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                        <p className="font-medium text-text text-sm truncate max-w-56">
                            {app.jobTitle}
                        </p>
                        <p className="text-xs text-text-secondary truncate">{app.company.name}</p>
                    </div>
                </div>
            </td>

            {/* Status */}
            <td className="px-4 py-3.5">
                <StatusBadge status={app.status} size="sm" />
            </td>

            {/* Location + work mode */}
            <td className="px-4 py-3.5 hidden lg:table-cell">
                <div className="flex flex-col gap-0.5">
                    {app.workMode && (
                        <span className="text-xs text-text-secondary">
                            {WORK_MODE_LABELS[app.workMode]}
                        </span>
                    )}
                    {app.location && (
                        <span className="flex items-center gap-1 text-xs text-text-tertiary">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="truncate max-w-32">{app.location}</span>
                        </span>
                    )}
                </div>
            </td>

            {/* Salary */}
            <td className="px-4 py-3.5 hidden xl:table-cell">
                <span className="font-mono text-xs text-text-secondary">
                    {formatSalary(app.salary?.min, app.salary?.max, app.salary?.currency)}
                </span>
            </td>

            {/* Priority */}
            <td className="px-4 py-3.5 hidden lg:table-cell">
                <span
                    className="inline-flex items-center gap-1 text-xs font-medium"
                    style={{ color: priority.color }}
                >
                    <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ backgroundColor: priority.color }}
                    />
                    {priority.label}
                </span>
            </td>

            {/* Applied date */}
            <td className="px-4 py-3.5 hidden md:table-cell">
                <span className="flex items-center gap-1 text-xs text-text-tertiary">
                    <Clock className="h-3 w-3 shrink-0" />
                    {app.appliedAt ? timeAgo(app.appliedAt) : '—'}
                </span>
            </td>

            {/* Meta counts */}
            <td className="px-4 py-3.5 hidden xl:table-cell">
                <div className="flex items-center gap-2 text-xs text-text-tertiary">
                    <span>{app._count.notes} notes</span>
                    <span>·</span>
                    <span>{app._count.contacts} contacts</span>
                </div>
            </td>

            {/* Actions */}
            <td className="px-4 py-3.5">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {app.jobUrl && (
                        <Tooltip content="Open posting">
                            <button
                                className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] hover:bg-bg-secondary text-text-tertiary hover:text-text transition-colors"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(app.jobUrl!, '_blank');
                                }}
                            >
                                <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                        </Tooltip>
                    )}
                    <Tooltip content="Delete">
                        <button
                            className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-sm)] hover:bg-[var(--color-danger-bg)] text-text-tertiary hover:text-[var(--color-danger)] transition-colors"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete(app);
                            }}
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </button>
                    </Tooltip>
                </div>
            </td>
        </tr>
    );
};

// ── Pagination ─────────────────────────────────────────────────────────────────
interface PaginationProps {
    page: number;
    totalPages: number;
    total: number;
    limit: number;
    onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, total, limit, onChange }: PaginationProps) => {
    const from = (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border">
            <p className="text-xs text-text-tertiary">
                Showing {from}–{to} of {total}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={page <= 1}
                    onClick={() => onChange(page - 1)}
                >
                    Previous
                </Button>
                {/* Page numbers — show up to 5 */}
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const p = totalPages <= 5
                        ? i + 1
                        : page <= 3
                            ? i + 1
                            : page >= totalPages - 2
                                ? totalPages - 4 + i
                                : page - 2 + i;
                    return (
                        <button
                            key={p}
                            onClick={() => onChange(p)}
                            className={cn(
                                'h-7 w-7 rounded-[var(--radius-sm)] text-xs font-medium transition-colors',
                                p === page
                                    ? 'bg-accent text-white'
                                    : 'text-text-secondary hover:bg-surface-hover',
                            )}
                        >
                            {p}
                        </button>
                    );
                })}
                <Button
                    variant="secondary"
                    size="sm"
                    disabled={page >= totalPages}
                    onClick={() => onChange(page + 1)}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};

// ── Main page ──────────────────────────────────────────────────────────────────
const DEFAULT_FILTERS: ApplicationsQuery = {
    page: 1, limit: 20,
    sortBy: 'createdAt', sortOrder: 'desc',
};

export const ApplicationsPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [createOpen, setCreateOpen] = useState(searchParams.get('new') === 'true');
    const [deleteTarget, setDeleteTarget] = useState<ApplicationSummary | null>(null);

    // Filters live in state — sync to URL if you want shareable links
    const [filters, setFilters] = useState<ApplicationsQuery>(DEFAULT_FILTERS);

    const updateFilters = useCallback((patch: Partial<ApplicationsQuery>) => {
        setFilters((prev) => ({ ...prev, ...patch }));
    }, []);

    const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);

    const handleSort = useCallback((field: ApplicationsQuery['sortBy']) => {
        setFilters((prev) => ({
            ...prev,
            sortBy: field,
            sortOrder: prev.sortBy === field && prev.sortOrder === 'desc' ? 'asc' : 'desc',
            page: 1,
        }));
    }, []);

    const { data, isLoading, isFetching } = useApplications(filters);
    const deleteApp = useDeleteApplication();

    // Count active filters (excluding pagination + sort)
    const activeFilterCount = [
        filters.status, filters.workMode, filters.jobType,
        filters.isFavorite, filters.search,
    ].filter(Boolean).length;

    const handleDelete = () => {
        if (!deleteTarget) return;
        deleteApp.mutate(deleteTarget.id, {
            onSuccess: () => setDeleteTarget(null),
        });
    };

    return (
        <div className="flex flex-col h-full min-h-screen">
            {/* Page header */}
            <div className="sticky top-0 z-20 bg-bg border-b border-border">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h1 className="text-lg font-semibold text-text">Applications</h1>
                            {data?.meta && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-bg-secondary border border-border text-xs font-medium text-text-secondary">
                                    {data.meta.total}
                                </span>
                            )}
                            {isFetching && !isLoading && (
                                <Spinner size="sm" />
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="secondary"
                                size="sm"
                                icon={<SlidersHorizontal />}
                                className={activeFilterCount > 0 ? 'border-accent text-accent' : ''}
                            >
                                Filters
                                {activeFilterCount > 0 && (
                                    <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-white text-[10px]">
                                        {activeFilterCount}
                                    </span>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                icon={<Plus />}
                                onClick={() => setCreateOpen(true)}
                            >
                                Add application
                            </Button>
                        </div>
                    </div>

                    <FilterBar
                        filters={filters}
                        onChange={updateFilters}
                        onReset={resetFilters}
                        activeCount={activeFilterCount}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
                {isLoading ? (
                    <div className="flex items-center justify-center py-32">
                        <Spinner size="lg" />
                    </div>
                ) : !data?.data.length ? (
                    <EmptyState
                        icon={<Briefcase />}
                        title={activeFilterCount > 0 ? 'No matching applications' : 'No applications yet'}
                        description={
                            activeFilterCount > 0
                                ? 'Try adjusting or clearing your filters.'
                                : 'Add your first application to start tracking your job search.'
                        }
                        action={
                            activeFilterCount > 0 ? (
                                <Button variant="secondary" onClick={resetFilters} icon={<X />}>
                                    Clear filters
                                </Button>
                            ) : (
                                <Button onClick={() => setCreateOpen(true)} icon={<Plus />}>
                                    Add application
                                </Button>
                            )
                        }
                    />
                ) : (
                    <div className="rounded-[var(--radius-lg)] border border-border bg-surface overflow-hidden shadow-[var(--shadow-card)]">
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-bg-secondary border-b border-border">
                                    <tr>
                                        <th className="w-10 px-3 py-3" />
                                        <SortCell field="jobTitle" current={filters.sortBy} order={filters.sortOrder} onSort={handleSort}>
                                            Role
                                        </SortCell>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary">
                                            Status
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary hidden lg:table-cell">
                                            Location
                                        </th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary hidden xl:table-cell">
                                            Salary
                                        </th>
                                        <SortCell field="priority" current={filters.sortBy} order={filters.sortOrder} onSort={handleSort} className="hidden lg:table-cell">
                                            Priority
                                        </SortCell>
                                        <SortCell field="appliedAt" current={filters.sortBy} order={filters.sortOrder} onSort={handleSort} className="hidden md:table-cell">
                                            Applied
                                        </SortCell>
                                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-text-tertiary hidden xl:table-cell">
                                            Activity
                                        </th>
                                        <th className="w-20 px-4 py-3" />
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.data.map((app) => (
                                        <ApplicationRow
                                            key={app.id}
                                            app={app}
                                            onDelete={setDeleteTarget}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {data.meta.totalPages > 1 && (
                            <Pagination
                                page={filters.page ?? 1}
                                totalPages={data.meta.totalPages}
                                total={data.meta.total}
                                limit={filters.limit ?? 20}
                                onChange={(p) => updateFilters({ page: p })}
                            />
                        )}
                    </div>
                )}
            </div>

            {/* Modals */}
            <CreateApplicationModal
                open={createOpen}
                onClose={() => {
                    setCreateOpen(false);
                    setSearchParams({});
                }}
            />
            <DeleteConfirmModal
                open={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleteApp.isPending}
            />
        </div>
    );
};