
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';
import User from 'src/models/usermodel';

const jwtSecret = "mySecret";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Token missing' },
        { status: 401 }
      );
    }

    //sabashje aahi krna c api call kio kita aa

   
    // const decoded = jwt.verify(token, jwtSecret) as { isVerified: boolean; email: string };
    const decoded = jwt.verify(token, jwtSecret)
    console.log("decodedd",decoded);

    const user = await User.findOne({email : decoded.email}).select("-password -todos")   //not give password
    
    console.log(user);
    

    return NextResponse.json(
      { isAuthenticated: true, user },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: 'Verification failed', isAuthenticated: false },
      { status: 401 }
    );
  }
}
