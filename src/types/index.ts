export type Role = 'USER' | 'ADMIN';

export type ApplicationStatus =
    | 'WISHLIST'
    | 'APPLIED'
    | 'PHONE_SCREEN'
    | 'INTERVIEW'
    | 'OFFER'
    | 'REJECTED'
    | 'WITHDRAWN'
    | 'GHOSTED';

export type WorkMode = 'REMOTE' | 'HYBRID' | 'ONSITE';
export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'FREELANCE';
export type NoteType = 'GENERAL' | 'INTERVIEW_PREP' | 'FOLLOW_UP' | 'FEEDBACK';

export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: Role;
    avatarUrl: string | null;
    isEmailVerified: boolean;
    createdAt: string;
}

export interface Company {
    id: string;
    name: string;
    website: string | null;
    logoUrl: string | null;
    industry: string | null;
    location: string | null;
}

export interface SalaryRange {
    id: string;
    min: number | null;
    max: number | null;
    currency: string;
}

export interface Note {
    id: string;
    applicationId: string;
    type: NoteType;
    content: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface Contact {
    id: string;
    applicationId: string;
    name: string;
    role: string | null;
    email: string | null;
    linkedinUrl: string | null;
    phone: string | null;
    createdAt: string;
}

export interface StatusHistory {
    id: string;
    applicationId: string;
    fromStatus: ApplicationStatus | null;
    toStatus: ApplicationStatus;
    changedAt: string;
    note: string | null;
}

export interface ApplicationSummary {
    id: string;
    jobTitle: string;
    jobUrl: string | null;
    status: ApplicationStatus;
    workMode: WorkMode | null;
    jobType: JobType | null;
    location: string | null;
    priority: number;
    isFavorite: boolean;
    appliedAt: string | null;
    interviewAt: string | null;
    offerDeadline: string | null;
    createdAt: string;
    updatedAt: string;
    company: Pick<Company, 'id' | 'name' | 'logoUrl' | 'industry'>;
    salary: SalaryRange | null;
    _count: { notes: number; contacts: number };
}

export interface ApplicationDetail extends ApplicationSummary {
    jobDescription: string | null;
    resumeUrl: string | null;
    coverLetterUrl: string | null;
    company: Company;
    notes: Note[];
    contacts: Contact[];
    statusHistory: StatusHistory[];
}

export interface ApplicationStats {
    total: number;
    byStatus: Record<ApplicationStatus, number>;
    recentActivity: Array<{
        id: string;
        jobTitle: string;
        companyName: string;
        status: ApplicationStatus;
        updatedAt: string;
    }>;
    upcomingInterviews: Array<{
        id: string;
        jobTitle: string;
        companyName: string;
        interviewAt: string;
    }>;
    responseRate: number;
}

// API response wrapper — matches backend ApiResponse<T>
export interface ApiResponse<T = undefined> {
    success: boolean;
    message: string;
    data?: T;
    errors?: Record<string, string[]>;
    meta?: PaginationMeta;
}

export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

// Auth
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface LoginResponse {
    user: User;
    tokens: AuthTokens;
}

// Query params for applications list
export interface ApplicationsQuery {
    page?: number;
    limit?: number;
    status?: ApplicationStatus;
    workMode?: WorkMode;
    jobType?: JobType;
    priority?: number;
    isFavorite?: boolean;
    search?: string;
    sortBy?: 'createdAt' | 'updatedAt' | 'appliedAt' | 'jobTitle' | 'priority';
    sortOrder?: 'asc' | 'desc';
}