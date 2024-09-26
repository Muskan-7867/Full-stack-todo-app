// Save todos to localStorage
export const saveTodoToLocalStorage = (todo: { task: string; status: string }) => {
    try {
     
      const todos = JSON.parse(localStorage.getItem("todos") || "[]") as Array<{ task: string; status: string }>;
      todos.push(todo);
      localStorage.setItem("todos", JSON.stringify(todos));
    } catch (error) {
      console.error("Error saving todo to localStorage:", error);
    }
  };
  
  
  export const getTodosFromLocalStorage = () => {
    try {
      return JSON.parse(localStorage.getItem("todos") || "[]") as Array<{ task: string; status: string }>;
    } catch (error) {
      console.error("Error retrieving todos from localStorage:", error);
      return []; 
    }
  };
  

  export const clearLocalStorageTodos = () => {
    try {
      localStorage.removeItem("todos");
    } catch (error) {
      console.error("Error clearing todos from localStorage:", error);
    }
  };
  