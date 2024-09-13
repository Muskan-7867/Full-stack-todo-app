
import { NextRequest, NextResponse } from 'next/server';
import Todo from 'src/models/todomodel';
import { connect } from 'src/utills/db';


connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { task, status = 'pending' } = reqBody; 

    if (!task) {
      return NextResponse.json(
        { error: 'Missing required fields', success: false },
        { status: 400 }
      );
    }

  
    const newTodo = new Todo({
      task,
      status,
    });

    const savedTodo = await newTodo.save();

   
    return NextResponse.json(
      {
        message: 'Todo created successfully',
        success: true,
        payload: savedTodo,
      },
      { status: 200 }
    );
  } catch (error: any) {
   
    return NextResponse.json(
      {
        error: error.message || 'Internal server error',
        success: false,
      },
      { status: 500 }
    );
  }
}
