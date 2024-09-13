import bcryptjs from 'bcryptjs';
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextRequest, NextResponse } from "next/server";



connect();

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { username, email, password } = await request.json();

    // Log the incoming request body for debugging
    console.log("Request Body:", { username, email, password });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
  
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists", success: false },
        { status: 400 }
      );
    }

    // Hash the user's password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return success response
    return NextResponse.json(
      { message: "Account created successfully", success: true, payload: savedUser },
      { status: 200 },
     
   
    );
  } catch (error) {
    // Log the error for debugging
    console.error("Error:", error);

    // Return error response
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
