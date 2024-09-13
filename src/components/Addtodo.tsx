
import { useState } from "react";

type TodoForm = {
  task: string;
 
};

const Addtodo = () => {
  const [form, setForm] = useState<TodoForm>({
    task: "",
    
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch("/api/create/todo", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create Todo");
      }

      setSuccessMessage("Todo created successfully!");
      setForm({ task: "" }); 
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-lg">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-grow">
        <input
  type="text"
  id="task"
  name="task"
  value={form.task}
  onChange={handleChange}
  required
  placeholder="Enter your task"
  className="border border-gray-400 rounded-sm w-full md:w-[42rem] lg:w-[42rem] my-4 sm:my-6 md:my-8 p-2 px-4 text-lg sm:text-xl tracking-wide font-bold transition duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
/>

        </div>
       

        <button
  type="submit"
  disabled={loading}
  className={`p-2.5 px-6 sm:px-7 md:px-8 border-0 rounded-sm font-bold cursor-pointer mt-4 sm:mt-0 bg-sky-900 text-white transform transition duration-300 ${
    loading
      ? "bg-blue-400 cursor-not-allowed"
      : "bg-green-600 hover:bg-sky-700 hover:scale-105 active:scale-95"
  }`}
>
  {loading ? "Creating..." : "Add Todo"}
</button>

      </form>

      {error && (
        <p className="mt-6 text-red-500 font-medium animate-fade-in">
          {error}
        </p>
      )}
      {successMessage && (
        <p className="mt-6 text-green-500 text-center text-2xl animate-fade-in">
          {successMessage}
        </p>
      )}
      <hr className="my-6 border-black" />
    </div>
  );
};

export default Addtodo;
