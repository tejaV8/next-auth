"use client";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();

  const [user, setUser] = React.useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = React.useState(false);
  const buttonDisabled = user.email.length === 0 || user.password.length === 0;

  const onLogin = async () => {
    try {
      setLoading(true);

      const response = await axios.post("/api/users/login", user);

      console.log("Login success", response.data);

      toast.success("Login success");

      router.push("/profile");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Login failed"
        : error instanceof Error
          ? error.message
          : "Login failed";
      console.log("Login failed", message);

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">
          {loading ? "Processing..." : "Welcome Back"}
        </h1>

        <p className="text-center text-gray-500 mb-6">Login to your account</p>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>

            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 text-black transition"
              id="email"
              type="text"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              placeholder="Enter email"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>

            <input
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-400 text-black transition"
              id="password"
              type="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              placeholder="Enter password"
            />
          </div>

          <button
            onClick={onLogin}
            disabled={buttonDisabled}
            className={`w-full p-3 rounded-xl text-white font-semibold transition duration-200 ${
              buttonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {buttonDisabled ? "Fill all fields" : "Login"}
          </button>

          <Link
            href="/forgotpassword"
            className="text-center text-sm font-medium text-black hover:underline"
          >
            Forgot password?
          </Link>

          <p className="text-center text-sm text-gray-600 mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-black font-medium hover:underline"
            >
              Signup
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
