import { useQuery } from "@tanstack/react-query";
import { applicationApi } from "@/api/application.api";
import { useNavigate } from "react-router-dom";
import { Application } from "@/types/application.types";


export default function DashboardPage() {
    const navigate = useNavigate();

    const { data, isLoading } = useQuery({
        queryKey: ["applications"],
        queryFn: () => applicationApi.getAll({ limit: 100 }),
    });

    const applications = data?.data ?? [];

    /* ================= STATS ================= */

    const total = applications.length;
    const applied = applications.filter(a => a.status === "APPLIED").length;
    const interview = applications.filter(a => a.status === "INTERVIEW").length;
    const offer = applications.filter(a => a.status === "OFFER").length;
    const rejected = applications.filter(a => a.status === "REJECTED").length;

    const recent = applications.slice(0, 5);

    if (isLoading) {
        return <div className="p-6 text-center">Loading dashboard...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-gray-500 text-sm">
                        Overview of your job applications
                    </p>
                </div>

                {/* Stats */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                    <StatCard title="Total" value={total} />
                    <StatCard title="Applied" value={applied} />
                    <StatCard title="Interview" value={interview} />
                    <StatCard title="Offer" value={offer} />
                    <StatCard title="Rejected" value={rejected} />
                </div>

                {/* Recent Applications */}
                <div className="bg-white rounded-2xl shadow p-5">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-semibold text-lg">Recent Applications</h2>
                        <button
                            onClick={() => navigate("/applications")}
                            className="text-sm text-blue-600 hover:underline"
                        >
                            View all
                        </button>
                    </div>

                    {recent.length === 0 ? (
                        <p className="text-sm text-gray-500">
                            No applications yet.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {recent.map((app: Application) => (
                                <div
                                    key={app.id}
                                    className="flex justify-between items-center border rounded-lg p-3 hover:bg-gray-50"
                                >
                                    <div>
                                        <p className="font-medium">{app.jobTitle}</p>
                                        <p className="text-sm text-gray-500">
                                            {app.company.name}
                                        </p>
                                    </div>

                                    <span className="text-xs px-2 py-1 rounded bg-gray-100">
                                        {app.status}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

/* ================= SMALL COMPONENT ================= */

function StatCard({ title, value }: { title: string; value: number }) {
    return (
        <div className="bg-white rounded-2xl shadow p-4 text-center">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
        </div>
    );
}