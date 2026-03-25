import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const status = ["WISHLIST", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]

/* ================= SCHEMA ================= */

const schema = z.object({
    companyName: z.string().min(2, "Company is required"),
    jobTitle: z.string().min(2, "Position is required"),
    status: z.enum(status).optional(),
    jobType: z.string().optional(),
    location: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof schema>;

const statusOptions = [
    { value: "", lable: "Select status" },
    { value: status[0], lable: status[0] },
    { value: status[1], lable: status[1] },
    { value: status[2], lable: status[2] },
    { value: status[3], lable: status[3] },
    { value: status[4], lable: status[4] },

]

/* ================= PROPS ================= */

type Props = {
    defaultValues?: Partial<ApplicationFormData>;
    onSubmit: (data: ApplicationFormData) => void;
    isLoading?: boolean;
    errorMessage?: string;
    buttonText: string;
};

/* ================= COMPONENT ================= */

export default function ApplicationForm({
    defaultValues,
    onSubmit,
    isLoading,
    errorMessage,
    buttonText,
}: Props) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ApplicationFormData>({
        resolver: zodResolver(schema),
        defaultValues,
    });

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
        >
            <h1 className="text-2xl font-bold text-center">
                {buttonText}
            </h1>

            {errorMessage && (
                <div className="bg-red-100 text-red-700 p-2 rounded text-sm">
                    {errorMessage}
                </div>
            )}

            <input
                {...register("companyName")}
                placeholder="Company"
                className="w-full border p-2 rounded"
            />
            {errors.companyName && (
                <p className="text-red-500 text-sm">{errors.companyName.message}</p>
            )}

            <input
                {...register("jobTitle")}
                placeholder="job title"
                className="w-full border p-2 rounded"
            />
            {errors.jobTitle && (
                <p className="text-red-500 text-sm">{errors.jobTitle.message}</p>
            )}

            <select {...register("status")} className="w-full border p-2 rounded">
                {
                    statusOptions.map(s => <option value={s.value}>{s.lable}</option>)
                }
            </select>

            <input
                {...register("jobType")}
                placeholder="Job Type"
                className="w-full border p-2 rounded"
            />

            <input
                {...register("location")}
                placeholder="Location"
                className="w-full border p-2 rounded"
            />

            <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 rounded disabled:bg-blue-300"
            >
                {isLoading ? "Saving..." : buttonText}
            </button>
        </form>
    );
}