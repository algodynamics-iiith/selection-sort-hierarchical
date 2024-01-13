"use client" // Client-side Component to allow for state changes and routing.

import Layout from "@/app/layout"
import Instructions from "./instructions"
import ActionButton from "@/app/_components/_buttons/actionButton"
import CreateArray from "@/app/_components/_constructors/createArray"
import ThemeToggle from "@/app/_components/_buttons/darkModeToggleButton"
import { Suspense, useEffect, useState } from "react"
import API from "@/app/api"
import { useAppDispatch, useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { selectTheme, selectUserId, SelectionSortState, updateUserId, storeLevelStates, updateRunId, selectLevelStates, selectInitialArray, selectRunId } from "@/lib/features/userData/userDataSlice"
import Loading from "./loading"

// API Function Calls

/**
 * API call to create a run for a userId and set the runId.
 * @param userId The userId of the user.
 * @param setRunId Function to set the runId.
 */
const createRun = async (userId: string, setRunId: React.Dispatch<React.SetStateAction<string>>) => {
  console.log("Creating runId.")
  // If API Gateway is defined.
  if (API.getUri() !== undefined) {
    // API call.
    await API
      .post(
        `/createRun`, JSON.stringify({
          id: userId,
          machineId: "selectionSortHierarchical",
        })
      )
      .then((response: any) => {
        // Set the runId.
        setRunId(response.data.id)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }
  // If testing.
  else { setRunId("testRunID") }
}

/**
 * API call to update the Run parameters.
 * @param payload Payload for the API.
 * @param runId The runId of the current run.
 * @param type The action performed.
 * @param preState The state before the action.
 * @param postState The state after the action.
 */
const updateRun = async (
  payload: any,
  runId: string,
  type: string,
  preState: SelectionSortState,
  postState: SelectionSortState
) => {
  // If runId is undefined, then the user has not been initialised.
  if (runId === "") {
    return
  }
  // Log the current state into the browser console.
  console.log(JSON.stringify({
    id: runId,
    payload: payload === undefined ? {} : payload,
    type: type,
    preState: preState === undefined ? {} : preState,
    postState: postState === undefined ? {} : postState,
    timestamp: Date.now()
  }))
  // If API Gateway is defined.
  if (API.getUri() !== undefined) {
    // API call.
    await API
      .post(
        `/updateRun`, JSON.stringify({
          id: runId,
          payload: payload === undefined ? {} : payload,
          type: type,
          preState: preState === undefined ? {} : preState,
          postState: postState === undefined ? {} : postState,
          timestamp: Date.now()
        })
      )
      .then(response => {
        console.log(response)
        console.log(response.data)
      })
      .catch(error => {
        console.log(error)
      })
  }
}

/**
 * API call to update that the run is completed.
 * @param id The userId of the user of the current run.
 * @param setCompleted Function to set the status to completed.
 */
const complete = async (id: string, setCompleted: React.Dispatch<React.SetStateAction<boolean>>) => {
  let endpoint = `/complete/` + id
  // If API Gateway is defined.
  if (API.getUri() !== undefined) {
    // API call.
    await API
      .get(endpoint)
      .then(response => {
        console.log(response)
        console.log(response.data)
        setCompleted(true)
        // window.alert("Thank you for your participation.")
      })
      .catch(error => {
        console.log(error)
      })
  }
  else { setCompleted(true) }
}

// List of Actions
const Action = Object.freeze({
  Init: 'InitLevelZero',
  Undo: 'Undo',
  Redo: 'Redo',
  Reset: 'Reset',
  Submit: 'Submit',
  CancelSubmit: 'CancelSubmit',
  ConfirmSubmit: 'ConfirmSubmit',
  SelectionSort: 'SelectionSort',
  DiveIntoLevelOne: 'DiveIntoLevelOne'
})

// List of Prompts
const Prompts = Object.freeze({
  Init: "Level Zero.",
  Undo: "Undo successful.",
  Redo: "Redo successful.",
  Reset: "Experiment reset to initial state.",
  Submit: "Confirm submission?",
  CancelSubmit: "Submission cancelled.",
  ConfirmSubmit: "Submission confirmed!",
  SelectionSort: "Performed Selection Sort on the array.",
  DiveIntoLevelOne: "Entering lower level of Selection Sort Abstraction.",
})

/**
 * Function that creates an instance of a Selection Sort State.
 * @param array Array of numbers.
 * @param i Current index.
 * @param max Index of max value.
 * @param b Boundary index.
 * @returns SelectionSortState instance.
 */
function createState(array: number[], i: number, max: number, b: number): SelectionSortState {
  let state: SelectionSortState = {} as SelectionSortState

  state.array = array
  state.b = b
  state.i = i
  state.max = max

  return state
}

// const state: SelectionSortState = {
//   array: [1234, 567, 89, 0],
//   i: 0,
//   max: 0,
//   b: 4
// }

// const prompt = "Experiment Initialised."

/**
 * Function to update the array containing list of previous states.
 * @param pastStates Array with list of previous states.
 * @param state State to be added.
 * @returns Updated past states array.
 */
function handlePastStateUpdate(pastStates: SelectionSortState[], state: SelectionSortState) {
  let newPastStateArray = pastStates.slice()
  newPastStateArray.push({ ...state })
  return newPastStateArray
}

/**
 * Function to update the array containing list of future states.
 * @param futureStates Array with list of future states.
 * @param state State to be added.
 * @returns Updated future states array.
 */
function handleFutureStateUpdate(futureStates: SelectionSortState[], state: SelectionSortState) {
  let newFutureStateArray = futureStates.slice()
  newFutureStateArray.unshift({ ...state })
  return newFutureStateArray
}

/**
 * Function to perform selection sort.
 * @param array Array to perform Selection Sort on.
 * @returns Sorted array.
 */
function performSelectionSort(array: number[]) {
  // Duplicate the array.
  let newArray = array.slice()

  // Evaluate for every boundary element.
  for (let b = newArray.length; b > 0; b--) {
    // Initialise max.
    let max = 0
    // Find max.
    for (let i = 0; i < b; i++) {
      if (newArray[i] > newArray[max])
        max = i
    }
    // Swap if boundary element is not max.
    if (max !== (b - 1)) {
      const temp = newArray[max]
      newArray[max] = newArray[b - 1]
      newArray[b - 1] = temp
    }
  }

  return newArray
}

const levelNumber = 0

export default function Experiment() {
  // Router for navigation between pages.
  const router = useRouter()
  // Store Reducer dispatcher.
  const dispatch = useAppDispatch()
  // Initialisation.
  const userId = useAppSelector(selectUserId)
  const theme = useAppSelector(selectTheme)
  const initialArray = useAppSelector(selectInitialArray)
  const initialState = useAppSelector(selectLevelStates)[levelNumber]
  const [runId, setRunId] = useState<string>(useAppSelector(selectRunId))
  const [preState, setPreState] = useState<SelectionSortState>({} as SelectionSortState)
  const [state, setState] = useState<SelectionSortState>(initialState.current)
  const [pastStates, setPastStates] = useState<SelectionSortState[]>(initialState.previous)
  const [futureStates, setFutureStates] = useState<SelectionSortState[]>(initialState.next)
  const [type, setType] = useState<string>(Action.Init)
  const [prompt, setPrompt] = useState<string>(Prompts.Init)
  const [completed, setCompleted] = useState<boolean>(false)

  // Handlers.
  function handleSelectionSort() {
    const newArray = performSelectionSort(state.array)
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(createState(newArray, 0, 0, 0))
    setType(Action.SelectionSort)
    setPrompt(Prompts.SelectionSort)
  }

  function handleDiveIntoLevelOne() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(state)
    setType(Action.DiveIntoLevelOne)
    setPrompt(Prompts.DiveIntoLevelOne)
    dispatch(updateUserId(userId))
    dispatch(updateRunId(runId))
    dispatch(storeLevelStates({
      level: levelNumber,
      currentState: { ...state },
      previousStates: pastStates.slice(),
      nextStates: futureStates.slice(),
    }))
    dispatch(storeLevelStates({
      level: levelNumber + 1,
      currentState: { ...state },
      previousStates: [],
      nextStates: [],
    }))
  }

  function handleUndo() {
    let newPastStates = pastStates.slice()
    newPastStates.pop()
    setPreState({ ...state })
    setPastStates(newPastStates)
    setFutureStates(handleFutureStateUpdate(futureStates, state))
    setState(pastStates[pastStates.length - 1])
    setType(Action.Undo)
    setPrompt(Prompts.Undo)
  }

  function handleRedo() {
    let newFutureStates = futureStates.slice()
    newFutureStates.shift()
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates(newFutureStates)
    setState(futureStates[0])
    setType(Action.Redo)
    setPrompt(Prompts.Redo)
  }

  function handleReset() {
    setPreState({ ...state })
    setPastStates([])
    setFutureStates([])
    setState(createState(initialArray, 0, 0, initialArray.length))
    setType(Action.Reset)
    setPrompt(Prompts.Reset)
  }

  function handleSubmit() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(state)
    setType(Action.Submit)
    setPrompt(Prompts.Submit)
  }

  function handleConfirmSubmit() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState({ ...state })
    setType(Action.ConfirmSubmit)
    setPrompt(Prompts.ConfirmSubmit)
    if (runId !== "") { complete(runId, setCompleted) }
  }

  function handleCancelSubmit() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState({ ...state })
    setType(Action.CancelSubmit)
    setPrompt(Prompts.CancelSubmit)
  }

  function checkSorted() {
    let sorted: boolean = true
    for (let index = 1; index < state.array.length; index++) {
      if (state.array[index] < state.array[index - 1]) {
        sorted = false
        break
      }
    }
    return sorted
  }

  // Log actions.
  useEffect(() => {
    console.log(userId)
    // Generating Run ID
    if (userId !== "" && runId === "") {
      // console.log(userId)
      createRun(userId, setRunId)
    }
    // Redirect to lower level upon clicking Dive In.
    else if (type === Action.DiveIntoLevelOne) {
      router.push("/level-one")
    }
    // Log run actions.
    else if (runId !== "") {
      updateRun({}, runId, type, preState, state)
    }
    // Redirect upon completion.
    if (completed) {
      router.push("/thanks")
    }
  }, [router, userId, runId, type, preState, state, completed])

  return (
    <Layout >
      {/* Header */}
      <header
        id='headerBlock'
        className={'grid p-4 grid-cols-4 justify-around bg-gradient-to-r from-blue-600 from-25% to-sky-600  shadow-lg'}
      >
        <span className={"px-4 font-sans text-2xl font-bold text-slate-50 col-span-3 justify-self-start"}>
          Driving Test - Selection Sort - Level Zero
        </span>
        <div className='col-span-1 flex justify-around items-center'>
          <ThemeToggle />
          <Suspense fallback={null}>
            {/* Submit Button */}
            <button
              type='button'
              className='transition ease-out hover:scale-110 hover:duration-400
                px-2 py-1 border-2 border-white/75 hover:border-white hover:bg-slate-50/10 rounded-full
                text-xl font-semibold text-slate-50'
              onClick={() => handleSubmit()}
            >
              Submit
            </button>
          </Suspense>
        </div>
      </header>
      {/* Experiment */}
      <Suspense fallback={<Loading />}>
        <div className="flex-grow flex overflow-hidden">
          {/* Information */}
          <div className="max-w-lg overflow-y-auto shadow-md p-6 text-lg">
            <Instructions />
          </div>
          {/* Activity */}
          <div className="w-full text-lg overflow-x-auto">
            <div className="relative h-full w-full">
              {/* Submit Window */}
              <div
                className={"absolute z-10 justify-center items-center align-middle flex flex-col w-full h-full "
                  + (type == Action.Submit ? "backdrop-blur-md" : "hidden")}
              >
                <div
                  className={"flex flex-col justify-center items-center align-middle text-lg w-1/3 h-1/3 shadow-lg p-2 rounded-md "
                    + (theme === "Light" ? "bg-gray-50 text-gray-900 border-black" : "bg-gray-900 text-gray-100 border-gray-100")}
                >
                  <span className="flex text-center">Comfirm Submission?</span>
                  <div className="flex flex-row justify-between p-2">
                    <ActionButton
                      id="confirm"
                      type="primary"
                      handler={() => handleConfirmSubmit()}
                    >
                      Confirm
                    </ActionButton>
                    <ActionButton
                      id="cancel"
                      type="secondary"
                      handler={() => handleCancelSubmit()}
                    >
                      Cancel
                    </ActionButton>
                  </div>
                </div>
              </div>
              {/* Controls */}
              <div className={"flex flex-col justify-evenly items-center w-full h-full "}>
                {/* Prompt */}
                <div className="w-full">
                  <div
                    className={"text-center m-4 p-2 rounded-md border-2 text-black "
                      + ((prompt === Prompts.SelectionSort || prompt === Prompts.ConfirmSubmit)
                        ? "bg-green-300 border-green-400"
                        : "bg-blue-300 border-blue-400"
                      )
                    }
                  >
                    {prompt}
                  </div>
                </div>
                {/* Variables */}
                <div className="flex flex-row w-full items-center justify-center h-1/2">
                  {/* <div className="flex flex-col text-center w-1/6 p-1 text-xl">
                    i = {state.i}
                    <br />
                    max = {state.max}
                    <br />
                    b = {state.b}
                  </div> */}
                  <CreateArray array={state.array} sorted={checkSorted()} hideIndex />
                </div>
                {/* Buttons */}
                <div className="flex flex-col items-center space-y-2 p-2">
                  <ActionButton
                    id="select-sort"
                    type="primary"
                    handler={() => handleSelectionSort()}
                  >
                    Perform Selection Sort
                  </ActionButton>
                  <ActionButton
                    id="select-sort-dive"
                    type="subset"
                    handler={() => handleDiveIntoLevelOne()}
                  >
                    Dive Into Selection Sort
                  </ActionButton>
                  <div className="flex justify-between">
                    <ActionButton
                      id="undo"
                      type="secondary"
                      disabled={pastStates.length === 0}
                      handler={() => handleUndo()}
                    >
                      Undo
                    </ActionButton>
                    <ActionButton
                      id="redo"
                      type="secondary"
                      disabled={futureStates.length === 0}
                      handler={() => handleRedo()}
                    >
                      Redo
                    </ActionButton>
                    <ActionButton
                      id="reset"
                      type="secondary"
                      handler={() => handleReset()}
                    >
                      Reset
                    </ActionButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Suspense>
      {/* Copyright */}
      <div className={"text-center p-2 border-t-2 " + (theme === "Dark" ? "border-gray-100" : "border-gray-900")}>Copyright &copy; 2023 Algodynamics.</div>
    </Layout>
  )
}
