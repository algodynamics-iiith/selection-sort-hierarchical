"use client" // Client-side Component to allow for routing.

import { useRouter } from 'next/navigation'
import { MouseEvent, useEffect } from 'react'
import { AxiosInstance } from 'axios'
import backendClient from '../../api'
import { useAppDispatch, useAppSelector } from '@/lib/hooks'
import { selectUserId, updateUserId } from '@/lib/features/userData/userDataSlice'

/**
 * Function to generate an Agree button.
 * @returns Button which carries out the Agree function.
 */
function AgreeButton({ route }: { route: string }) {
  // Axios client for backend.
  let client: AxiosInstance | null = null
  // Update the backend for other functions to refer.
  if (backendClient.getUri() !== undefined)
    client = backendClient

  // Router for navigation between pages.
  const router = useRouter()

  const userId = useAppSelector(selectUserId)

  useEffect(() => {
    console.log("userId:", userId)
    if (userId !== "") {
      console.log("Redirecting to experiment.")
      router.replace(route)
    }
  }, [router, userId, route])

  // Function to update the userId.
  const dispatch = useAppDispatch();
  const handleUpdateUserId = (id: string) => {
    dispatch(updateUserId(id))
  }

  /**
   * Function to fetch the algorithmID and redirect the user to the experiment page.
   * @param input userID.
   * @param router Next.js router object.
   * @param client Axios client for backend.
   */
  const getAlgorithm = async (
    input: string,
    router: ReturnType<typeof useRouter>,
    client: AxiosInstance | null,
    setUserId: Function,
  ) => {
    console.log("Entered getAlgorithm")
    // Path to use getAlgorithm API.
    let final = "/getAlgorithm/" + input
    if (!client) {
      // Update userId in the store for accessing across pages.
      setUserId(input)
      // Redirect to the experiment.
      router.replace(route)
    }
    else {
      // Fetch the algorithmId.
      await client
        .get(final)
        .then((response: any) => {
          // Read userID and algorithmID and store them in local storage.
          let id: string = response.data.id
          let algorithmId: string = response.data.algorithmId
          localStorage.setItem("userID", id)
          // Update userId in the store for accessing across pages.
          setUserId(id)
          console.log("Set userId.")
          localStorage.setItem("algorithmID", algorithmId)
        })
        .catch((error: any) => {
          console.log(error)
          alert("Something went wrong.")
        })
    }
  }

  /**
   * Function to create/fetch userID and proceed with getAlgorithm API.
   * @param e (optional) HTML element whose properties can be modified.
   * @param router Next.js router object.
   * @param client Axios client for backend.
   */
  const onClickAgree = async (
    e: MouseEvent<HTMLButtonElement>,
    router: ReturnType<typeof useRouter>,
    client: AxiosInstance | null,
    setUserId: Function,
  ) => {
    // Logging for testing.
    console.log("Clicked Agree Button.")
    // Disable button.
    e.currentTarget.disabled = true
    // Remove hover and blue color from class
    e.currentTarget.classList.remove("hover:bg-blue-600")
    e.currentTarget.classList.remove("bg-blue-500")
    // Add gray color
    e.currentTarget.classList.add("bg-gray-500")

    // Call createUser API to generate userID.
    if (client) {
      let input = ""
      while (input === "") {
        // Prompt for userID.
        const id = prompt("Please enter your roll number.")
        if (id !== null) {
          // Create user or check if already existing through endpoint.
          const res = await client.get("/createUser/" + id)
          input = res.data.id
          // Store userId in local storage.
          localStorage.setItem("userID", input)
          // Get the algorithmId.
          getAlgorithm(input, router, client, setUserId)
        }
        else
          alert("Please enter your roll number to proceed further!")
      }
    }
    // When no client is provided.
    else {
      // Get the algorithmId.
      getAlgorithm("testUserID", router, client, setUserId)
    }
  }

  return (
    <button
      type="button"
      id="agree"
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-4 m-1 rounded text-lg"
      // Read Roll Number, generate userID and call getAlgorithm function to fetch algorithmID.
      onClick={(e) => onClickAgree(e, router, client, handleUpdateUserId)}
    >
      Agree
    </button>
  )
}

export default AgreeButton
