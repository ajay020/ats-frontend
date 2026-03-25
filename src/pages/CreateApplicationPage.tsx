import ApplicationForm, { ApplicationFormData } from "@/components/ApplicationForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { applicationApi } from "@/api/application.api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function CreateApplicationPage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [errorMessage, setErrorMessage] = useState("");

    const mutation = useMutation({
        mutationFn: applicationApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["applications"] });
            navigate("/applications");
        },
        onError: (error: any) => {
            setErrorMessage(error.response?.data?.message || "Failed to create");
        },
    });

    const onSubmit = (data: ApplicationFormData) => {
        setErrorMessage("");
        mutation.mutate(data);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <ApplicationForm
                onSubmit={onSubmit}
                isLoading={mutation.isPending}
                errorMessage={errorMessage}
                buttonText="Create Application"
            />
        </div>
    );
}