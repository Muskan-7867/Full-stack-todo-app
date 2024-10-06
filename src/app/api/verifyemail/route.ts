import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await connect();
  try {
    const { searchParams } = new URL(request.url);
    const otp = searchParams.get("otp");

    if (!otp) {
      return NextResponse.json(
        { message: "Verification code is missing.", success: false },
        { status: 400 }
      );
    }

    const user = await User.findOne({ verifyCode: otp });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid verification code.", success: false },
        { status: 400 }
      );
    }

    if (user.verifyCodeExpiry < new Date()) {
      return NextResponse.json(
        { message: "Verification code has expired.", success: false },
        { status: 400 }
      );
    }

    // Verification success
    user.isVerified = true;
    user.verifyCode = null; // Clear the code once used
    user.verifyCodeExpiry = null; // Set verifyCodeExpiry to null safely
    await user.save();

    return NextResponse.json(
      { message: "Email verified successfully!", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { message: "An error occurred. Please try again.", success: false },
      { status: 500 }
    );
  }
}
