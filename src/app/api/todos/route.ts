import { NextRequest, NextResponse } from "next/server";
import Todo from "src/models/todomodel"; // Adjust the path as necessary
import { connect } from "src/utills/db"; // Adjust the path as necessary

async function fetchTodos(userId: string) {
  await connect(); 
  return await Todo.find({ userId: userId });
}

export async function POST(request: NextRequest) {
  const { _id: userId } = await request.json(); // Extract user ID from the request body

  if (!userId) {
    return NextResponse.json(
      { message: "User ID is required", success: false },
      { status: 400 }
    );
  }

  try {
    const todos = await fetchTodos(userId);
    return NextResponse.json(
      { payload: todos, success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching todos:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching todos", success: false },
      { status: 500 }
    );
  }
}
