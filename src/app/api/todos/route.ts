// api/todos/route.ts
import { NextResponse } from "next/server";
import Todo from "src/models/todomodel";
import { connect } from "src/utills/db";

connect();

export async function GET() {
  try {
    const todos = await Todo.find(); // Fetch all todos
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
