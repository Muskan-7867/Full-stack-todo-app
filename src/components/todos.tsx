"use client";

import { useState, useEffect } from "react";


import { TrashIcon, PencilIcon } from "@heroicons/react/24/outline"; // Importing PencilIcon for editing

import { useSearchParams } from "next/navigation";

type Todo = {
  _id: string;
  task: string;
  status: "pending" | "completed";
};

const Todos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<string>("");
  const searchParams = useSearchParams();
  const filterStatus = searchParams.get("todos");

  const fetchTodos = async () => {
    try {
      const response = await fetch("/api/todos", { method: "GET" });
      const text = await response.text();
      const data = text ? JSON.parse(text) : { payload: [] };

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch todos");
      }

      if (!Array.isArray(data.payload)) {
        throw new Error("Invalid data structure received from the server.");
      }

      setTodos(data.payload);
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      setError(error.message || "An error occurred while fetching todos.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);


 
  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === "active") {
      return todo.status === "pending";
    }
    if (filterStatus === "completed") {
      return todo.status === "completed";
    }

    return true; // For 'All' case or when no filter is applied

  });

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch("/api/delete/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          throw new Error(result.message || "Failed to delete todo");
        } else {
          throw new Error("Unexpected response from the server.");
        }
      }

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error: any) {
      console.error("Error deleting todo:", error);
      setError(error.message || "An error occurred while deleting the todo.");
    }
  };

  const handleUpdate = async (id: string, updatedFields: Partial<Todo>) => {
    try {
      const response = await fetch("/api/update/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updatedFields }),
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
          const result = await response.json();
          throw new Error(result.message || "Failed to update todo");
        } else {
          throw new Error("Unexpected response from the server.");
        }
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, ...updatedFields } : todo
        )
      );

      setEditingId(null);
      setEditingTask("");
    } catch (error: any) {
      console.error("Error updating todo:", error);
      setError(error.message || "An error occurred while updating the todo.");
    }
  };

  const handleStatusChange = async (id: string, checked: boolean) => {
    const newStatus = checked ? "completed" : "pending";
    await handleUpdate(id, { status: newStatus });
  };

  const handleEditClick = (id: string, currentTask: string) => {
    setEditingId(id);
    setEditingTask(currentTask);
  };

  const handleEditComplete = async (id: string) => {
    if (editingTask.trim()) {
      await handleUpdate(id, { task: editingTask });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-lg">
      {error && <p className="text-red-500 font-medium">{error}</p>}
      <ul className="space-y-4">
        {filteredTodos.map((todo, index) => (
          <li
            key={todo._id}

            className={`flex items-center space-x-4 space-y-2 mx-12 border-b text-2xl border-black pb-4 transition-all duration-300 transform ${

              index !== todos.length - 1 ? "mb-4" : ""
            } ${todo.status === "completed" ? "opacity-50" : "opacity-100"}`}
          >
            <input
              type="checkbox"
              checked={todo.status === "completed"}
              onChange={(e) => handleStatusChange(todo._id, e.target.checked)}

              className="mr-4 mt-2 transform transition duration-200 hover:scale-110"
              aria-label="Toggle status "

            
            />
            {editingId === todo._id ? (
              <input
                type="text"
                value={editingTask}
                onChange={(e) => setEditingTask(e.target.value)}
                onBlur={() => handleEditComplete(todo._id)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleEditComplete(todo._id);
                }}
                autoFocus

                className="w-full p-4 rounded-lg focus:outline-none focus:ring-2 transition transform duration-200 hover:scale-105"

                
              />
            ) : (
              <span
                className={`flex-grow ${

                  todo.status === "completed" ? "line-through" : ""
     
                }`}
              >
                {todo.task}
              </span>
            )}
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(todo._id, todo.task)}
                className="p-2 rounded hover:bg-blue-100 transition duration-300 transform hover:scale-110"
                aria-label="Edit todo"
              >

                <PencilIcon className="h-6 w-6 text-blue-500 hover:text-blue-700" />

              
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="p-2 rounded hover:bg-red-100 transition duration-300 transform hover:scale-110"
                aria-label="Delete todo"
              >
                <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
