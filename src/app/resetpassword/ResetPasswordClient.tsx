"use client";

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "react-hot-toast";

type ResetPasswordClientProps = {
  token: string;
};

export function ResetPasswordClient({ token }: ResetPasswordClientProps) {
  const router = useRouter();
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);

  const buttonDisabled =
    !token ||
    password.length < 6 ||
    confirmPassword.length < 6 ||
    password !== confirmPassword ||
    loading;

  const onResetPassword = async () => {
    try {
      setLoading(true);
      const response = await axios.post("/api/users/resetpassword", {
        token,
        password,
      });

      setSuccess(true);
      toast.success(response.data.message || "Password reset successfully");
      router.push("/login");
    } catch (error: unknown) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.error || "Password reset failed"
        : error instanceof Error
          ? error.message
          : "Password reset failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
      <h1 className="mb-2 text-center text-3xl font-bold text-gray-800">
        Reset Password
      </h1>

      <p className="mb-6 text-center text-gray-500">
        Create a new password for your account.
      </p>

      {!token ? (
        <div className="space-y-4 text-center">
          <p className="text-red-600">No reset token was found.</p>
          <Link href="/forgotpassword" className="font-medium text-black hover:underline">
            Request a new link
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              New Password
            </label>

            <input
              className="w-full rounded-xl border border-gray-300 p-3 text-black transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>

            <input
              className="w-full rounded-xl border border-gray-300 p-3 text-black transition focus:outline-none focus:ring-2 focus:ring-gray-400"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Confirm new password"
            />
          </div>

          {password !== confirmPassword && confirmPassword.length > 0 && (
            <p className="text-sm text-red-600">Passwords do not match.</p>
          )}

          <button
            onClick={onResetPassword}
            disabled={buttonDisabled}
            className={`w-full rounded-xl p-3 font-semibold text-white transition duration-200 ${
              buttonDisabled
                ? "cursor-not-allowed bg-gray-400"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {success && (
            <p className="text-center text-sm text-green-700">
              Password reset successfully.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
