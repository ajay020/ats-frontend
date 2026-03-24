import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "@/api/application.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const schema = z.object({
    companyName: z.string().min(2, "Company name is required"),
    jobTitle: z.string().min(2, "Job title is required"),
    status: z.enum(["applied", "interview", "offer", "rejected"]).optional(),
    jobType: z.string().optional(),
    location: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function CreateApplicationPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState("");

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    const mutation = useMutation({
        mutationFn: applicationApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            navigate("/applications");
        },
        onError: (error: any) => {
            console.log("Err: ", error)
            setErrorMessage(
                error.response?.data?.message || "Failed to create application"
            );
        },
    });

    const onSubmit = (data: FormData) => {
        setErrorMessage("");
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">
                    Add Application
                </h1>

                {/* Error */}
                {errorMessage && (
                    <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                        {errorMessage}
                    </div>
                )}

                {/* Company */}
                <div>
                    <input
                        {...register("companyName")}
                        placeholder="Company"
                        className="w-full border p-2 rounded"
                    />
                    {errors.companyName && (
                        <p className="text-red-500 text-sm">
                            {errors.companyName.message}
                        </p>
                    )}
                </div>

                {/* Position */}
                <div>
                    <input
                        {...register("jobTitle")}
                        placeholder="Position"
                        className="w-full border p-2 rounded"
                    />
                    {errors.jobTitle && (
                        <p className="text-red-500 text-sm">
                            {errors.jobTitle.message}
                        </p>
                    )}
                </div>

                {/* Status */}
                <div>
                    <select
                        {...register("status")}
                        className="w-full border p-2 rounded"
                    >
                        <option value="">Select Status</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="offer">Offer</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                {/* Job Type */}
                <div>
                    <input
                        {...register("jobType")}
                        placeholder="Job Type (e.g. Remote, Full-time)"
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Location */}
                <div>
                    <input
                        {...register("location")}
                        placeholder="Location"
                        className="w-full border p-2 rounded"
                    />
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
                >
                    {mutation.isPending ? "Saving..." : "Create Application"}
                </button>

                {/* Back */}
                <p
                    onClick={() => navigate("/applications")}
                    className="text-sm text-center text-blue-600 cursor-pointer"
                >
                    Back to Applications
                </p>
            </form>
        </div>
    );
}