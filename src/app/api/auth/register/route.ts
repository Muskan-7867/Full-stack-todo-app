import bcryptjs from "bcryptjs";
import User from "src/models/usermodel";
import { connect } from "src/utills/db";
import { NextRequest, NextResponse } from "next/server";
import { EmailTemplate } from "src/helpers/emailTemplate";
const { sendMail } = require('src/helpers/sendMail');

export async function POST(request) {
  await connect(); // Connect to the database

  try {
    const { username, email, password } = await request.json();
    console.log("Request Body:", { username, email, password });

    // Check if the user already exists
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Update password if user is not verified
        const hashedPassword = await bcryptjs.hash(password, 10);
        existingUser.password = hashedPassword;

        await existingUser.save(); // Save updated user data

        // Return response for updated unverified user
        return NextResponse.json(
          {
            message: "User exists but was not verified, password updated!",
            success: true,
          },
          { status: 200 }
        );
      } else {
        return NextResponse.json(
          { message: "User already exists and is verified!", success: false },
          { status: 400 }
        );
      }
    } else {
      // Hash the password for a new user
      const salt = await bcryptjs.genSalt(10);
      const hashedPassword = await bcryptjs.hash(password, salt);

      // Create a new user with the hashed password
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        isAcceptingMessage: true,
        messages: [],
      });

      // Save the new user to the database
      const savedUser = await newUser.save();

      // Send welcome email
      sendMail(email, "Welcome to Our Todo app!!", "", EmailTemplate(username));

      // Return success response for new user creation
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
