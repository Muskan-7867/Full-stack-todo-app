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

interface Props {
  reRender: boolean;
}

const Todos: React.FC<Props> = ({ reRender }) => {
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
    if (user?.userId) {
      fetchTodos();
    }
  }, [user, reRender]);

  useEffect(() => {
    const checkDueDates = async () => {
      const now = new Date();

      todos.forEach(async (todo) => {
        const dueTime = new Date(todo.targetTime);

        // Check if the task is pending and due within the next hour (3600000 ms)
        if (todo.status === "pending" && dueTime.getTime() - now.getTime() < 3600000) {
          try {
            await fetch("src/utills/sendMail", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                to: user.email,
                subject: "Task Due Reminder",
                text: `Reminder: The task "${todo.task}" is due soon! Please complete it by ${new Date(todo.targetTime).toLocaleString()}.`,
                html: `<p>Reminder: The task "<strong>${todo.task}</strong>" is due soon! Please complete it by ${new Date(todo.targetTime).toLocaleString()}.</p>`,
              }),
            });
          } catch (error) {
            console.error("Error sending reminder email:", error);
          }
        }
      });
    };

    const intervalId = setInterval(checkDueDates, 15 * 60 * 1000); // Check every 15 minutes
    return () => clearInterval(intervalId);
  }, [todos, user]);

  const handleStatusChange = async (id: string, isChecked: boolean) => {
    try {
      const updatedStatus = isChecked ? "completed" : "pending";
      const response = await fetch("/api/update/todo", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: updatedStatus }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update todo status");
      }

      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, status: updatedStatus } : todo
        )
      );
    } catch (error: any) {
      console.error("Error updating todo status:", error);
      setError(error.message || "An error occurred while updating todo status.");
    }
  };

  const handleEditClick = (id: string) => {
    setEditingId(id);
  };

  const handleUpdateComplete = (id: string, updatedTask: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo._id === id ? { ...todo, task: updatedTask } : todo
      )
    );
    setEditingId(null);
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
          onComplete={handleUpdateComplete}
          

        />
      ) : (
        <span className={`flex-grow ${todo.status === "completed" ? "line-through" : ""}`}>
          {todo.task}
          <span className="ml-2 text-gray-400 text-xl">
            Due: {new Date(todo.targetTime).toLocaleString()} {/* Display targetTime */}
          </span>
        </span>
      )}
      {/* Wrapper for icons with added margin */}
      <span className="flex items-center space-x-3 ml-4">
        <PencilIcon
          onClick={() => handleEditClick(todo._id)}
          className="w-5 h-5 cursor-pointer"
          aria-label="Edit Todo"
        />
        <TodoDelete todoId={todo._id} setTodos={setTodos} />
      </span>
    </li>
  ))}
</ul>


    </div>
  );
};

export default Todos;
