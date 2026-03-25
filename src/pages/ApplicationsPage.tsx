import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "@/api/application.api";
import { useNavigate } from "react-router-dom";
import { Application } from "@/types/application.types";
import { ApplicationStatus } from "@/types";


const statusOptions: { label: string; value: "" | ApplicationStatus }[] = [
    { label: "All Status", value: "" },
    { label: "Wishlist", value: "WISHLIST" },
    { label: "Applied", value: "APPLIED" },
    { label: "Interview", value: "INTERVIEW" },
    { label: "Offer", value: "OFFER" },
    { label: "Rejected", value: "REJECTED" },
];

const statusBadgeClass = (status: ApplicationStatus) => {
    switch (status) {
        case "WISHLIST":
            return "bg-gray-100 text-gray-700";
        case "APPLIED":
            return "bg-blue-100 text-blue-700";
        case "INTERVIEW":
            return "bg-yellow-100 text-yellow-700";
        case "OFFER":
            return "bg-green-100 text-green-700";
        case "REJECTED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
};

export default function ApplicationsPage() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState<"" | ApplicationStatus>("");
    const [page, setPage] = useState(1);
    const limit = 8;

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["applications", { search, status, page, limit }],
        queryFn: () =>
            applicationApi.getAll({
                search: search.trim() || undefined,
                status: status || undefined,
                page,
                limit,
            }),
        staleTime: 1000 * 30,
    });

    const applications = data?.data ?? [];
    const totalPages = data?.meta?.totalPages ?? 1;


    const handleSearchChange = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleStatusChange = (value: "" | ApplicationStatus) => {
        setStatus(value);
        setPage(1);
    };

    const clearFilters = () => {
        setSearch("");
        setStatus("");
        setPage(1);
    };

    const deleteMutation = useMutation({
        mutationFn: (id: string) => applicationApi.delete(id),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
        },

        onError: () => {
            alert("Failed to delete application");
        },
    });

    const handleDelete = async (id: string) => {
        const ok = window.confirm("Delete this application?");
        if (!ok) return;

        deleteMutation.mutate(id);
    };

    return (

        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
                        <p className="text-sm text-gray-500">
                            Track your job applications in one place.
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/applications/new")}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                        + New Application
                    </button>
                </div>

                <div className="mb-6 grid gap-3 rounded-2xl border bg-white p-4 shadow-sm sm:grid-cols-3">
                    <input
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Search by company or role..."
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    />

                    <select
                        value={status}
                        onChange={(e) => handleStatusChange(e.target.value as "" | ApplicationStatus)}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 outline-none focus:border-blue-500"
                    >
                        {statusOptions.map((opt) => (
                            <option key={opt.label} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={clearFilters}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                    >
                        Clear Filters
                    </button>
                </div>

                {isLoading && (
                    <div className="rounded-2xl border bg-white p-6 text-center text-gray-500 shadow-sm">
                        Loading applications...
                    </div>
                )}

                {isError && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-red-700">
                        Failed to load applications.
                        {" "}
                        {error instanceof Error ? error.message : ""}
                    </div>
                )}

                {!isLoading && !isError && applications.length === 0 && (
                    <div className="rounded-2xl border bg-white p-10 text-center shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900">No applications found</h2>
                        <p className="mt-2 text-sm text-gray-500">
                            Add your first job application or adjust filters.
                        </p>
                    </div>
                )}

                {!isLoading && !isError && applications.length > 0 && (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {applications.map((app: Application) => (
                                <div
                                    key={app.id}
                                    className="rounded-2xl border bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {app.jobTitle}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                {app.company?.name ?? "Unknown Company"}
                                            </p>
                                        </div>

                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-semibold ${statusBadgeClass(
                                                app.status
                                            )}`}
                                        >
                                            {app.status}
                                        </span>
                                    </div>

                                    <div className="mt-4 space-y-2 text-sm text-gray-600">
                                        {app.location && <p>📍 {app.location}</p>}
                                        <p>Created: {new Date(app.createdAt).toLocaleDateString()}</p>
                                    </div>

                                    <div className="mt-5 flex gap-2">
                                        <button
                                            onClick={() => navigate(`/applications/${app.id}/edit`)}
                                            className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium hover:bg-gray-100">
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(app.id)}
                                            disabled={deleteMutation.isPending}
                                            className="flex-1 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                                        >
                                            {deleteMutation.isPending ? "Deleting..." : "Delete"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 flex items-center justify-between rounded-2xl border bg-white px-4 py-3 shadow-sm">
                            <p className="text-sm text-gray-600">
                                Page {page} of {totalPages}
                            </p>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Previous
                                </button>

                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}