import { NextResponse } from "next/server";
import Todo from "src/models/todomodel";
import { connect } from "src/utills/db";

connect();

export async function PUT(request) {
  try {
   
    const { id, task, status, targetTime } = await request.json();
    
    if (!id) {
      return NextResponse.json(
        { message: "Missing ID in request body" },
        { status: 400 }
      );
    }

    const updateTodo = await Todo.findByIdAndUpdate(
      id,
      { task, status, targetTime },
      { new: true }
    );

    if (!updateTodo) {
      return NextResponse.json(
        { message: "Todo not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Todo updated successfully",
        Todo: updateTodo,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating todo:", error);
    return NextResponse.json(
      {
        message: "An error occurred while updating the todo",
      },
      {
        status: 500,
      }
    );
  }
}
