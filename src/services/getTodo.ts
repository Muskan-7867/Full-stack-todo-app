const getAllTodos = async(userId:any)=>{
   try {
     const response = await fetch("/api/todos", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({ _id: userId }),
       });
       const data = await response.json();
 return data
   } catch (error) {
    throw new Error("Something wenbwrong")
   }
}

export default getAllTodos