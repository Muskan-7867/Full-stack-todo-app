

const addTodo = async(form:any)=>{
    try {
         const response = await fetch("/api/create/todo", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(form),
            });
        const data = await response.json();

           return data
    } catch (error) {
        console.log(error)
        return "Something went wrong"
    }
}

export default addTodo;