import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useCurrentUser } from "src/hooks/useCurrentUser";
import { PencilIcon } from "@heroicons/react/24/solid";
import TodoDelete from "./TodoDelete";
import TodoUpdate from "./TodoUpdate";
import getAllTodos from "src/services/getTodo";

type Todo = {
  _id: string;
  task: string;
  status: "pending" | "completed";
  targetTime: string;
};

interface Props{
  reRender: boolean;
}

const Todos:React.FC<Props> = ({reRender}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useCurrentUser();

  const searchParams = useSearchParams();
  const filterStatus = searchParams.get("todos");

  const fetchTodos = async () => {
    if (!user?.userId) {
      setError("User ID is required to fetch todos.");
      return;
    }

    setLoading(true);
    try {
      const data = await getAllTodos(user.userId);

      if (!Array.isArray(data?.payload)) {
        throw new Error("Invalid data structure received from the server.");
      }

      const todosWithValidDates = data?.payload.map((todo: Todo) => {
        const targetTime = new Date(todo.targetTime);
        if (isNaN(targetTime.getTime())) {
          console.error("Invalid Date for Todo:", todo);
          return { ...todo, targetTime: new Date().toISOString() };
        }
        return { ...todo, targetTime: targetTime.toISOString() };
      });

      setTodos(todosWithValidDates);
    } catch (error: any) {
      console.error("Error fetching todos:", error);
      setError(error.message || "An error occurred while fetching todos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId ) {
      fetchTodos();
    }

  }, [user,reRender]);



  const handleStatusChange = async (id: string, isChecked: boolean) => {
    try {
      const updatedStatus = isChecked ? "completed" : "pending"; // Determine new status
      const response = await fetch("/api/update/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: updatedStatus }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update todo status");
      }

      // Update local state after successful API response
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, status: updatedStatus } : todo
        )
      );
    } catch (error: any) {
      console.error("Error updating todo status:", error);
      setError(
        error.message || "An error occurred while updating todo status."
      );
    }
  };

  const handleEditClick = (id: string) => {
    setEditingId(id); // Track the todo being edited
  };

  const handleUpdateComplete = (id: string, updatedTask: string) => {
    // Update the todo after editing is done
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, task: updatedTask } : todo
      )
    );
    setEditingId(null); // Stop editing mode
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterStatus === "active") return todo.status === "pending";
    if (filterStatus === "completed") return todo.status === "completed";
    return true;
  });

  return (
    <div className="mx-auto p-8 rounded-lg w-full max-w-4xl">
      {loading && <p>Loading todos...</p>}
      {error && <p className="font-medium text-red-500">{error}</p>}
      <ul className="space-y-4">
        {filteredTodos.map((todo, index) => (
          <li
            key={todo._id}
            className={`flex items-center text-white space-x-4 border-b text-2xl border-white pb-4 transition-all duration-300 transform ${
              index !== todos.length - 1 ? "mb-4" : ""
            } ${todo.status === "completed" ? "opacity-50" : "opacity-100"}`}
          >
            <input
              type="checkbox"
              checked={todo.status === "completed"}
              onChange={(e) => handleStatusChange(todo._id, e.target.checked)}
              className="mt-2 mr-4 transform transition duration-200 hover:scale-110"
              aria-label="Toggle status"
            />

            {editingId === todo._id ? (
              <TodoUpdate
                todoId={todo._id}
                task={todo.task}
                targetTime={todo.targetTime}
                status={todo.status}
                setTodos={setTodos}
                onComplete={handleUpdateComplete} // Pass the completion handler
              />
            ) : (
              <span
                className={`flex-grow ${
                  todo.status === "completed" ? "line-through" : ""
                }`}
              >
                {todo.task}
                <span className="text-gray-500">
                  {" "}
                  (Due: {new Date(todo.targetTime).toLocaleString()})
                </span>
              </span>
            )}

            <div className="flex space-x-2">
              <button
                onClick={() => handleEditClick(todo._id)}
                className="hover:bg-blue-100 p-2 rounded"
                aria-label="Edit todo"
              >
                <PencilIcon className="w-6 h-6 text-blue-900 hover:text-blue-700 dark:text-blue-500" />
              </button>

              <TodoDelete todoId={todo._id} setTodos={setTodos} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todos;
