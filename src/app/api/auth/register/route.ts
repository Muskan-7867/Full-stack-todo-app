import bcrypt from "bcryptjs"; // Correct import for bcryptjs in ES modules
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextRequest, NextResponse } from "next/server";
const { sendMail } = require("src/helpers/sendMail");

export async function POST(request) {
  await connect(); // Connect to the database
  try {
    // Parse the incoming request body
    const { username, email, password } = await request.json();
    console.log("Request Body:", { username, email, password });

    // Generate verification code
    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      // If the user exists but is not verified, update their information
      if (!existingUser.isVerified) {
        const hashedPassword = await bcrypt.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode; // Save verification code

        await existingUser.save();

        // Send verification email
        await sendMail(
          email,
          "Verify your account",
          `Hi ${existingUser.username}, here is your verification code: ${verifyCode}`
        );

        return NextResponse.json(
          { message: "User updated with verification code", success: true },
          { status: 200 }
        );
      } else {
        // If the user is already verified
        return NextResponse.json(
          { message: "User already exists and is verified!", success: false },
          { status: 400 }
        );
      }
    } else {
      // If the user does not exist, hash the password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Send welcome email
      await sendMail(
        email,
        "Welcome to Our Todo App!!",
        `Hi ${username}, thank you for registering! `
      );

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
