import { NextRequest, NextResponse } from 'next/server';
import Todo from 'src/models/todomodel'; 
import { connect } from 'src/utills/db'; 


connect();


export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json(); 
    const { task, user } = reqBody; 


    if (!task) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

    // Create a new Todo instance with automatic targetTime
    const newTodo = new Todo({
      task,
      status: 'pending', // Default status
      targetTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
      user, // If a user ID is provided
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
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
