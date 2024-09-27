import { NextRequest, NextResponse } from 'next/server';
import Todo from 'src/models/todomodel'; 
import { connect } from 'src/utills/db'; 
import mongoose from 'mongoose'; // Import mongoose for ObjectId

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json(); 
    const { task, userId } = reqBody; 

    console.log("Request Body:", reqBody);

    if (!task) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Convert userId to ObjectId if it's not already an ObjectId

    // Create a new Todo instance with automatic targetTime
    const newTodo = new Todo({
      task,
      userId : userId || "fake id", // Default userId
      status: 'pending', // Default status
      targetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    // Save the new Todo to the database
    const savedTodo = await newTodo.save();

    // Return success response
    return NextResponse.json(
      {
        message: 'Todo created successfully',
        success: true,
        payload: savedTodo, // Include the saved Todo in the response
      },
      { status: 201 } // 201 Created status
    );
  } catch (error: any) {
    // Return error response
    console.error("Error in POST /todos:", error);
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
