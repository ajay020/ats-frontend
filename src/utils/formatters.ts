// Salary formatter — 120000 → "$120k"
export const formatSalary = (min?: number | null, max?: number | null, currency = 'USD'): string => {
    const symbol = currency === 'USD' ? '$' : currency;
    const fmt = (n: number) =>
        n >= 1000 ? `${symbol}${Math.round(n / 1000)}k` : `${symbol}${n}`;
    if (min && max) return `${fmt(min)} – ${fmt(max)}`;
    if (min) return `From ${fmt(min)}`;
    if (max) return `Up to ${fmt(max)}`;
    return '—';
};

// Relative date — "3 days ago", "just now"
export const timeAgo = (dateStr: string): string => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (mins < 2) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Priority label
export const PRIORITY_LABELS: Record<number, { label: string; color: string }> = {
    0: { label: 'Low', color: '#9b9890' },
    1: { label: 'Medium', color: '#d97706' },
    2: { label: 'High', color: '#dc2626' },
};

export const WORK_MODE_LABELS: Record<string, string> = {
    REMOTE: 'Remote', HYBRID: 'Hybrid', ONSITE: 'On-site',
};

export const JOB_TYPE_LABELS: Record<string, string> = {
    FULL_TIME: 'Full-time', PART_TIME: 'Part-time',
    CONTRACT: 'Contract', INTERNSHIP: 'Internship', FREELANCE: 'Freelance',
};