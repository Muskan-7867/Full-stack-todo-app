import { useState } from "react";

type TodoUpdateProps = {
  todoId: string;
  task: string;
  targetTime: string;
  status: "pending" | "completed";
  setTodos: React.Dispatch<React.SetStateAction<any[]>>;
  onComplete: (id: string, updatedTask: string) => void; // Function to notify completion
};

const TodoUpdate = ({ todoId, task, targetTime, status, setTodos, onComplete }: TodoUpdateProps) => {
  const [updatedTask, setUpdatedTask] = useState(task);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/update/todo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: todoId, task: updatedTask, status }),
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || "Failed to update todo");
      }

      // Notify parent of the completion (update state)
      onComplete(todoId, updatedTask);
    } catch (error: any) {
      console.error("Error updating todo:", error.message);
    }
  };

 

  return (
    <form onSubmit={handleUpdate} className="flex  w-[80%]">
      <input
        type="text"
        value={updatedTask}
        onChange={(e) => setUpdatedTask(e.target.value)}
        
        className="border border-b-black rounded p-2"
        required
      />

      <button type="submit" className="bg-blue-500 text-white p-2 h-12 mt-[10%] rounded flex items-center justify-center">
        Save
      </button>
    </form>
  );
};

export default TodoUpdate;
