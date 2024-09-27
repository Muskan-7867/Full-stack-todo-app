import { clearLocalStorageTodos, getTodosFromLocalStorage } from "src/utills/localstorage";

export const syncLocalTodosToDatabase = async () => {
  const localTodos = getTodosFromLocalStorage(); // Retrieve locally stored todos

  if (localTodos && localTodos.length > 0) {
    try {
      // Send each todo to the database
      for (const todo of localTodos) {
        const response = await fetch("/api/create/todo", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(todo), // Send each todo
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to sync local todo");
        }
      }

      clearLocalStorageTodos(); // Clear synced todos from local storage
      console.log("Todos synced successfully from local storage!");
    } catch (error: any) {
      console.error("Error syncing local todos:", error.message);
    }
  } else {
    console.log("No local todos to sync.");
  }
};
