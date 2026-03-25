import { Application, CreateApplicationInput, PaginatedApplications, UpdateApplicationInput } from "@/types/application.types";
import { apiClient } from "./client";
import { ApiResponse } from "@/types";

export const applicationApi = {
    create: async (data: CreateApplicationInput): Promise<Application> => {
        const res = await apiClient.post<ApiResponse<Application>>(
            "/applications",
            data
        );

        return res.data.data!;
    },

    getAll: async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        status?: string;
    }): Promise<PaginatedApplications> => {
        const res = await apiClient.get<PaginatedApplications>(
            "/applications",
            {
                params,
            }
        );

        console.log("Response: ", res.data)

        return res.data;
    },

    getById: async (id: string): Promise<Application> => {
        const res = await apiClient.get<ApiResponse<Application>>(
            `/applications/${id}`
        );

        console.log("Application: ", res)

        return res.data.data!;
    },

    update: async (
        id: string,
        data: UpdateApplicationInput
    ): Promise<Application> => {
        const res = await apiClient.patch<ApiResponse<Application>>(
            `/applications/${id}`,
            data
        );

        return res.data.data!;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/applications/${id}`);
    },
};