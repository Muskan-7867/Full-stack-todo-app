import bcryptjs from "bcryptjs";
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
  await connect();
  try {
    const { username, email, password } = await request.json();
    console.log("Request Body:", { username, email, password });

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If user exists but not verified, update their info
      if (!existingUser.isVerified) {
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUser.password = hashedPassword; 
        
        await existingUser.save(); 
      } else {
        return NextResponse.json(
          { message: "User already exists and is verified!", success: false },
          { status: 400 }
        );
      }
    } else {
      // Hash the user's password
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);
      
      // Create a new user
      const newUser = new User({
        username,
        email,
        
       
        password: hashedPassword,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      // Save the user to the database
      const savedUser = await newUser.save();

      // Return success response
      return NextResponse.json(
        {
          message: "Account created successfully!!",
          success: true,
          payload: savedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error registering user:", error);

    // Return error response
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}
