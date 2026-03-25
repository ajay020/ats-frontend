export type Company = {
    _id: string;
    name: string;
}

export type ApplcationStatus = "WISHLIST" | "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type Application = {
    id: string;
    company: Company;
    jobTitle: string;
    status: ApplcationStatus
    jobType?: string;
    location?: string;
    createdAt: string;
    updatedAt: string;
};

export type PaginatedApplications = {
    data: Application[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    }
};

export type CreateApplicationInput = {
    companyName: string;
    jobTitle: string;
    status?: string;
    jobType?: string;
    location?: string;
};

export type UpdateApplicationInput = Partial<CreateApplicationInput>;