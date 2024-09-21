import { NextResponse } from "next/server";
import Todo from "src/models/todomodel";
import { connect } from "src/utills/db";

async function fetchTodos() {
  await connect(); 
  return await Todo.find();
}

export async function GET() {
  try {
    const todos = await fetchTodos();
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
