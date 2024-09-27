// import useSWR from "swr"

// const fetcher = async (id) => {
//     await fetch("/api/todos", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ _id:id }),
//       });

// }


// export function useUser (id) {
//     const { data, error, isLoading } = useSWR(`/api/user/${id}`, fetcher(id))
   
//     return {
//       user: data,
//       isLoading,
//       isError: error
//     }
//   }