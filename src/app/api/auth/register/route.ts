import bcryptjs from 'bcryptjs';
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextRequest, NextResponse } from "next/server";
import { SendVerificationEmail } from 'src/helpers/SendVerificationEmail';

export async function POST(request) {
  await connect();
  try {
    const { username, email, password } = await request.json();
    console.log("Request Body:", { username, email, password });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUser) {
      if (existingUser.isVerified) {
        return NextResponse.json(
          { message: "User already exists with this email!", success: false },
          { status: 400 }
        );
      } else {
        // Update existing user's information if not verified
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUser.password = hashedPassword;
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
        await existingUser.save();

        // Send verification email
        const emailResponse = await SendVerificationEmail(
          email,
          username,
          verifyCode
        );

        if (!emailResponse.success) {
          return NextResponse.json(
            { message: emailResponse.message, success: false },
            { status: 500 }
          );
        }
}
    }

    // Hash the user's password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    // Create a new user
    const newUser = new User({
      username,
      email,
      verifyCode,
      verifyCodeExpiry: expiryDate,
      password: hashedPassword,
      isVerified: false,
      isAcceptingMessage: true,
      messages: [],
    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Send verification email
    const emailResponse = await SendVerificationEmail(
      email,
      username,
      verifyCode
    );

    if (!emailResponse.success) {
      return NextResponse.json(
        { message: emailResponse.message, success: false },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json(
      {
        message: "Account created successfully!! Please verify your email!",
        success: true,
        payload: savedUser,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error registering user:", error);

    // Return error response
    return NextResponse.json(
      { error: error.message, success: false },
      { status: 500 }
    );
  }
}