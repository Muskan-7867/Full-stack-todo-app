import { TrashIcon } from "@heroicons/react/24/solid";

type Todo = {
  _id: string;
  task: string;
  status: "pending" | "completed";
  targetTime: string;
};

type TodoDeleteProps = {
  todoId: string;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoDelete = ({ todoId, setTodos }: TodoDeleteProps) => {
  const handleDelete = async () => {
    try {
      const response = await fetch("/api/delete/todo", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: todoId }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to delete todo");
      }

      // Remove the deleted todo from the list
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== todoId));
    } catch (error: any) {
      console.error("Error deleting todo:", error.message);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="p-2 rounded hover:bg-red-100 transition duration-300 transform hover:scale-110"
      aria-label="Delete todo"
    >
      <TrashIcon className="h-6 w-6 text-red-500 hover:text-red-700" />
    </button>
  );
};

export default TodoDelete;
