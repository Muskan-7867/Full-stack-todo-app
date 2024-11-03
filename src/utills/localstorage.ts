// src/utills/localstorage.ts

// Save a new todo to local storage
export const saveTodoToLocalStorage = (todo: { task: string; status: string }) => {
  try {
    const todos = JSON.parse(localStorage.getItem("todos") || "[]") as Array<{ task: string; status: string }>;
    todos.push(todo); // Add the new todo to the array
    localStorage.setItem("todos", JSON.stringify(todos)); // Save updated array back to local storage
  } catch (error) {
    console.error("Error saving todo to localStorage:", error);
  }
};

// Retrieve all todos from local storage
export const getTodosFromLocalStorage = () => {
  try {
    return JSON.parse(localStorage.getItem("todos") || "[]") as Array<{ task: string; status: string }>;
  } catch (error) {
    console.error("Error retrieving todos from localStorage:", error);
    return []; // Return an empty array if an error occurs
  }
};

// Clear all todos from local storage
export const clearLocalStorageTodos = () => {
  try {
    localStorage.removeItem("todos");
  } catch (error) {
    console.error("Error clearing todos from localStorage:", error);
  }
};
