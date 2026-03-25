import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "@/api/application.api";
import ApplicationForm, { ApplicationFormData } from "@/components/ApplicationForm";
import { useState } from "react";

export default function EditApplicationPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState("");

    // fetch existing data
    const { data, isLoading, isError } = useQuery({
        queryKey: ["application", id],
        queryFn: () => applicationApi.getById(id!),
        enabled: !!id,
    });

    const mutation = useMutation({
        mutationFn: (data: ApplicationFormData) =>
            applicationApi.update(id!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            navigate("/applications");
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || "Update failed");
        },
    });

    const onSubmit = (formData: ApplicationFormData) => {
        setErrorMessage("");
        mutation.mutate(formData);
    };

    if (isLoading) {
        return <div className="p-6 text-center">Loading...</div>;
    }

    if (isError || !data) {
        return <div className="p-6 text-center">Error fetching data...</div>;
    }

    const formData: ApplicationFormData = {
        companyName: data.company.name,
        jobTitle: data.jobTitle,
        status: data.status,
        jobType: data.jobType,
        location: data.location
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <ApplicationForm
                defaultValues={formData}
                onSubmit={onSubmit}
                isLoading={mutation.isPending}
                errorMessage={errorMessage}
                buttonText="Update Application"
            />
        </div>
    );
}