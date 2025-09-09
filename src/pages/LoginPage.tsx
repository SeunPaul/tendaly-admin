import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import logo from "../assets/illustration/logo.png";
import loginImage from "../assets/images/login.jpg";

interface LoginFormData {
  email: string;
  password: string;
}

const schema = yup
  .object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  })
  .required();

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated, isLoading } = useAuth();
  const [loginError, setLoginError] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: yupResolver(schema),
  });

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-nunito">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to dashboard if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setLoginError("");
    try {
      const result = await login(data.email, data.password);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setLoginError(result.error || "Login failed");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="h-screen flex overflow-hidden relative">
      {/* Left Panel - Login Form */}
      <div className="w-1/2 bg-gray-50 flex flex-col relative">
        {/* Login Form Container */}
        <div className="flex-1 flex items-center justify-center px-16">
          <div className="w-full max-w-md">
            {/* Login Card */}
            <div className="mb-8">
              <img src={logo} alt="Tendaly Logo" className="h-8" />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Welcome Text */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 font-nunito mb-2">
                  Welcome back!
                </h1>
                <p className="text-gray-600 font-nunito">
                  Please login using your account
                </p>
              </div>

              {/* Login Form */}
              <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                {/* Error Message */}
                {loginError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-red-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-800 font-nunito">
                          {loginError}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-900 font-nunito mb-2"
                  >
                    Email address
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-nunito ${
                      errors.email ? "border-red-300" : "border-gray-300"
                    }`}
                    placeholder="johndoe@tendaly.com"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600 font-nunito">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-900 font-nunito mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      {...register("password")}
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-nunito pr-12 ${
                        errors.password ? "border-red-300" : "border-gray-300"
                      }`}
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="h-5 w-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-600 font-nunito">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Forgot Password Link */}
                <div className="text-right">
                  <a
                    href="#"
                    className="text-sm text-blue-600 hover:text-blue-500 font-nunito"
                  >
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={isSubmitting || isLoading}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-nunito transition-colors duration-200"
                >
                  {isSubmitting || isLoading ? "Logging in..." : "Login"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Promotional Image */}
      <div className="w-1/2 relative overflow-hidden">
        <img
          src={loginImage}
          alt="Care that connects"
          className="w-full h-full object-cover"
        />

        {/* Text Overlay */}
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-bold font-nunito leading-tight">
            Care that connects,
            <br />
            Ease that lasts.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
