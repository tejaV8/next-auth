"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const buttonDisabled = email.length === 0 || loading;

  const onSubmit = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/forgotpassword", {
        email,
      });
      setSent(true);
      toast.success(response.data.message || "Password reset email sent");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Could not send reset email"
        : error instanceof Error
          ? error.message
          : "Could not send reset email";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
          Forgot Password
        </h1>

        <p className="mb-6 text-center text-gray-500">
          Enter your email and we will send you a reset link.
        </p>

        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              className="w-full rounded-xl border border-gray-300 p-3 text-black transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Enter email"
            />
          </div>

          <button
            onClick={onSubmit}
            disabled={buttonDisabled}
            className={`w-full rounded-xl p-3 font-semibold text-white transition duration-200 ${
              buttonDisabled
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          {sent && (
            <p className="text-center text-sm text-green-700">
              Check Mailtrap for the password reset email.
            </p>
          )}

          <p className="text-center text-sm text-gray-600">
            Remembered it?{" "}
            <Link href="/login" className="font-medium text-black hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
