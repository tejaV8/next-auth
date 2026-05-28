"use client";

import axios from "axios";
import Link from "next/link";
import React from "react";

type VerifyStatus = "checking" | "missing-token" | "success" | "error";

type VerifyEmailClientProps = {
  token: string;
};

export function VerifyEmailClient({ token }: VerifyEmailClientProps) {
  const [status, setStatus] = React.useState<VerifyStatus>(
    token ? "checking" : "missing-token",
  );
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    async function verifyUserEmail() {
      if (!token) {
        return;
      }

      try {
        const response = await axios.post("/api/users/verifyemail", { token });
        setMessage(response.data.message || "Email verified successfully");
        setStatus("success");
      } catch (error: unknown) {
        const fallback = "This verification link is invalid or expired.";

        if (axios.isAxiosError(error)) {
          setMessage(error.response?.data?.error || fallback);
        } else {
          setMessage(fallback);
        }

        setStatus("error");
      }
    }

    verifyUserEmail();
  }, [token]);

  return (
    <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
      <h1 className="mb-3 text-3xl font-bold text-gray-900">Verify Email</h1>

      {status === "checking" && (
        <p className="text-gray-600">Checking your verification link...</p>
      )}

      {status === "missing-token" && (
        <p className="text-red-600">No verification token was found.</p>
      )}

      {status === "success" && (
        <div className="space-y-4">
          <p className="text-green-700">{message}</p>
          <Link
            href="/login"
            className="inline-flex rounded-xl bg-black px-5 py-3 font-semibold text-white hover:bg-gray-800"
          >
            Login
          </Link>
        </div>
      )}

      {status === "error" && <p className="text-red-600">{message}</p>}
    </div>
  );
}
