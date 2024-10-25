"use client"
import jwt from 'jsonwebtoken';
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextResponse } from "next/server";

import { useRouter } from 'next/navigation';

export async function GET(request) {
  const router = useRouter();
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

    return NextResponse.json({ message: "Account verified successfully!", success: true }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "Invalid link or token expired", success: false }, { status: 400 });
  }
} 