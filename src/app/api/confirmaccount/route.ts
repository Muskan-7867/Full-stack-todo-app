import jwt from 'jsonwebtoken';
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextResponse } from "next/server";

export async function GET(request) {
  await connect(); 

  // Get the URL and extract the token
  const { searchParams } = new URL(request.url); // Create a URL object from the request URL
  const token = searchParams.get("token"); // Get the token from the query parameters

  if (!token) {
    return NextResponse.json({ message: "No token provided", success: false }, { status: 400 });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mySecret');

    // Find the user by decoded ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json({ message: "User not found", success: false }, { status: 404 });
    }

    // Mark the user as verified
    user.isVerified = true;
    await user.save();

    // Redirect to the login page after successful verification
    return NextResponse.redirect('/login'); // Redirecting to the login page

  } catch (error) {
    // Handle different JWT errors
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.json({ message: "Token has expired. Please request a new verification link.", success: false }, { status: 400 });
    } else if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ message: "Invalid token. Please try again with a valid link.", success: false }, { status: 400 });
    } else {
      return NextResponse.json({ message: "Something went wrong. Please try again later.", success: false }, { status: 500 });
    }
  }
}
