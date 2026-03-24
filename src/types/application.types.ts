export type Application = {
    _id: string;
    company: string;
    position: string;
    status: "applied" | "interview" | "offer" | "rejected";
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