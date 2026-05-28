import { connect } from "@/dbConfig/dbConfig";
import { sendEmail } from "@/helpers/mailer";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await connect();

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "No account exists with this email" },
        { status: 404 },
      );
    }

    await sendEmail({
      email,
      emailType: "RESET",
      userId: user._id.toString(),
    });

    return NextResponse.json({
      message: "Password reset email sent. Please check your inbox.",
      success: true,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Could not send password reset email",
      },
      { status: 500 },
    );
  }
}
