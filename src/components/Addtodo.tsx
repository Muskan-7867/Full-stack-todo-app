import { useState, useEffect } from "react";
import Cookies from "js-cookie";
import { saveTodoToLocalStorage } from "src/utills/localstorage"; // Adjust path
import { useCurrentUser } from "src/hooks/useCurrentUser"; // Adjust path
import { syncLocalTodosToDatabase } from "./SyncTodo";
import { SyncLoader } from "react-spinners";

type TodoForm = {
  task: string;
  userId: string | "" | undefined | null;
};

const getUserIsLoggedIn = () => {
  const authCookie = Cookies.get("authToken"); 
  return !!authCookie; 
};

const AddTodo = ({ onTodosUpdated }) => { 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { user, isAuthenticated } = useCurrentUser();

  const [form, setForm] = useState<TodoForm>({
    task: "",
    userId: user?.userId || "",
  });

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      userId: user?.userId || "",
    }));
  }, [user, isAuthenticated]);

  useEffect(() => {
    if (getUserIsLoggedIn()) {
      syncLocalTodosToDatabase(); // Call the separated sync function
    }
  }, [user]); // Trigger sync when the user is logged in

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      task: e.target.value,
      userId: user?.userId || "", // Ensure userId is updated
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (!getUserIsLoggedIn()) {
        saveTodoToLocalStorage({ task: form.task, status: "pending" });
        setSuccessMessage("Todo saved locally! Will sync when you log in.");
      } else {
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
        setSuccessMessage("Todo created successfully in the database!");

        
        if (onTodosUpdated) {
          onTodosUpdated(); 
        }
      }
      setForm({ task: "", userId: user?.userId || "" });
    } catch (error: any) {
      setError(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto p-8 rounded-lg w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="flex items-center space-x-4">
        <div className="flex-grow">
          <input type="text" id="task" name="task" value={form.task} onChange={handleChange} required
            placeholder="Enter your task" className="border-slate-800 my-4 sm:my-6 md:my-8 px-4 py-4 border rounded-lg focus:ring-2 focus:ring-slate-800 w-full md:w-[42rem] lg:w-[42rem] font-bold text-lg text-slate-800 sm:text-xl tracking-wide transition duration-300 focus:outline-none"
          />
        </div>

        <button type="submit" disabled={loading} className={`py-4 px-6 sm:px-4  md:px-8 border-0 rounded-sm font-bold cursor-pointer mt-4 sm:mt-0 bg-slate-800 dark:bg-sky-900 text-white transform transition duration-300 ${
            loading ? " cursor-not-allowed": " hover:bg-white hover:text-slate-800 hover:scale-105 active:scale-95"
          }`}>
        {loading ? <SyncLoader size={5} color="#fff" />  : "Add Todo"}
       </button>
      </form>
      {error && ( <p className="mt-6 font-medium text-red-500 animate-fade-in">{error} </p>)}
      {successMessage && (
        <p className="mt-6 text-2xl text-center text-sky-500 dark:text-sky-900 animate-fade-in">
          {successMessage}
        </p>
      )}
      <hr className="border-white my-6" />
    </div>
  );
};

export default AddTodo;
