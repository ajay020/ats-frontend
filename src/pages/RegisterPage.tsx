import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { RegisterFormValues, registerSchema } from "@/schemas/auth.schema";
import { authApi } from "@/api/auth.api";


export default function RegisterPage() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormValues>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterFormValues) => {
        try {
            await authApi.register({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
                password: data.password,
            });

            // after register → go to login
            navigate("/login");
        } catch (error: any) {
            console.error(error);
            alert(error?.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-6 rounded shadow w-full max-w-md space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">
                    Create Account
                </h1>

                {/* First Name */}
                <div>
                    <input
                        {...register("firstName")}
                        placeholder="First Name"
                        className="w-full border p-2 rounded"
                    />
                    {errors.firstName && (
                        <p className="text-red-500 text-sm">
                            {errors.firstName.message}
                        </p>
                    )}
                </div>

                {/* Last Name */}
                <div>
                    <input
                        {...register("lastName")}
                        placeholder="Last Name"
                        className="w-full border p-2 rounded"
                    />
                    {errors.lastName && (
                        <p className="text-red-500 text-sm">
                            {errors.lastName.message}
                        </p>
                    )}
                </div>

                {/* Email */}
                <div>
                    <input
                        {...register("email")}
                        placeholder="Email"
                        className="w-full border p-2 rounded"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">
                            {errors.email.message}
                        </p>
                    )}
                </div>

                {/* Password */}
                <div>
                    <input
                        type="password"
                        {...register("password")}
                        placeholder="Password"
                        className="w-full border p-2 rounded"
                    />
                    {errors.password && (
                        <p className="text-red-500 text-sm">
                            {errors.password.message}
                        </p>
                    )}
                </div>

                {/* Confirm Password */}
                <div>
                    <input
                        type="password"
                        {...register("confirmPassword")}
                        placeholder="Confirm Password"
                        className="w-full border p-2 rounded"
                    />
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">
                            {errors.confirmPassword.message}
                        </p>
                    )}
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {isSubmitting ? "Creating..." : "Register"}
                </button>

                {/* Redirect */}
                <p className="text-sm text-center">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="text-blue-600 cursor-pointer"
                    >
                        Login
                    </span>
                </p>
            </form>
        </div>
    );
}