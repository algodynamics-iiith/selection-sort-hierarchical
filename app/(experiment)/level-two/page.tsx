"use client" // Client-side Component to allow for state changes and routing.

import Layout from "@/app/layout"
import Instructions from "./instructions"
import ActionButton from "@/app/_components/_buttons/actionButton"
import CreateArray from "@/app/_components/_constructors/createArray"
import ThemeToggle from "@/app/_components/_buttons/darkModeToggleButton"
import { Suspense, useEffect, useState } from "react"
import API from "@/app/api"
import { useAppSelector } from "@/lib/hooks"
import { useRouter } from "next/navigation"
import { selectTheme, selectUserId, SelectionSortState, selectRunId, selectLevelStates, updateUserId, updateRunId, storeLevelStates, selectInitialArray, selectArrayLength } from "@/lib/features/userData/userDataSlice"
import Loading from "./loading"

// API Function Calls

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

// List of Actions
const Action = Object.freeze({
  Init: 'InitLevelTwo',
  Undo: 'Undo',
  Redo: 'Redo',
  Reset: 'Reset',
  Exit: 'ExitLevelTwo',
  Increment: 'Increment',
  UpdateMax: 'UpdateMax',
  SwapMax: 'SwapMax',
  DecrementAndReset: 'DecrementAndReset',
})

// List of Prompts
const Prompts = Object.freeze({
  Init: "Level Two.",
  Undo: "Undo successful.",
  Redo: "Redo successful.",
  Reset: "Experiment reset to initial state.",
  Exit: "Exiting to higher level.",
  Increment: "Value of 'i' increased by 1.",
  IncrementFail: "Value of 'i' cannot be increased anymore.",
  UpdateMax: "Value of 'max' updated.",
  SwapMax: "Swapped the 'max' and boundary elements.",
  DecrementAndReset: "Value of 'b' decremented by 1 and 'i', 'max' reset to 0.",
  DecrementAndResetFail: "Value of 'b' cannot be decreased further.",
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

const levelNumber = 2

export default function Experiment() {
  // Router for navigation between pages.
  const router = useRouter()
  // Initialisation.
  const userId = useAppSelector(selectUserId)
  const theme = useAppSelector(selectTheme)
  const runId = useAppSelector(selectRunId)
  const initialArray = useAppSelector(selectInitialArray)
  const arrayLength = initialArray.length
  const initialState = useAppSelector(selectLevelStates)[levelNumber - 1]
  const [preState, setPreState] = useState<SelectionSortState>({} as SelectionSortState)
  const [state, setState] = useState<SelectionSortState>(initialState.current)
  const [pastStates, setPastStates] = useState<SelectionSortState[]>([])
  const [futureStates, setFutureStates] = useState<SelectionSortState[]>([])
  const [type, setType] = useState<string>(Action.Init)
  const [prompt, setPrompt] = useState<string>(Prompts.Init)
  const [completed, setCompleted] = useState<boolean>(false)

  // Handlers.
  function handleIncrementI() {
    if (state.i < state.array.length - 1) {
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(state.array, state.i + 1, state.max, state.b))
      setType(Action.Increment)
      setPrompt(Prompts.Increment)
    }
    else { setPrompt(Prompts.IncrementFail) }
  }

  function handleUpdateMax() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(createState(state.array, state.i, state.i, state.b))
    setType(Action.UpdateMax)
    setPrompt(Prompts.UpdateMax)
  }

  function handleSwapMax() {
    let newArray = state.array.slice()
    newArray[state.max] = state.array[state.b - 1]
    newArray[state.b - 1] = state.array[state.max]
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(createState(newArray, state.i, state.i, state.b))
    setType(Action.SwapMax)
    setPrompt(Prompts.SwapMax)
  }

  function handleDecrementAndReset() {
    if (state.b > 0) {
      setPreState({ ...state })
      setPastStates(handlePastStateUpdate(pastStates, state))
      setFutureStates([])
      setState(createState(state.array, 0, 0, state.b - 1))
      setType(Action.DecrementAndReset)
      setPrompt(Prompts.DecrementAndReset)
    }
    else { setPrompt(Prompts.DecrementAndResetFail) }
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

  function handleDone() {
    setPreState({ ...state })
    setPastStates(handlePastStateUpdate(pastStates, state))
    setFutureStates([])
    setState(state)
    setType(Action.Exit)
    setPrompt(Prompts.Exit)
    setCompleted(true)
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
    // Log run actions.
    if (runId !== "") {
      updateRun({}, runId, type, preState, state)
    }
    // Redirect upon completion.
    if (completed) {
      router.push("/level-one")
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
          Driving Test - Selection Sort - Level Two
        </span>
        <div className='col-span-1 flex justify-around items-center'>
          <ThemeToggle />
          <Suspense fallback={null}>
            {/* Done Button */}
            {/* <button
              type='button'
              className='transition ease-out hover:scale-110 hover:duration-400
                px-2 py-1 border-2 border-white/75 hover:border-white hover:bg-slate-50/10 rounded-full
                text-xl font-semibold text-slate-50'
              onClick={() => handleDone()}
            >
              Done
            </button> */}
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
              {/* Controls */}
              <div className={"flex flex-col justify-evenly items-center w-full h-full "}>
                {/* Prompt */}
                <div className="w-full">
                  <div
                    className={"text-center m-4 p-2 rounded-md border-2 text-black "
                      + ((prompt === Prompts.DecrementAndResetFail || prompt === Prompts.IncrementFail)
                        ? "bg-red-300 border-red-400"
                        : (prompt === Prompts.DecrementAndReset || prompt === Prompts.Increment || prompt === Prompts.SwapMax || prompt === Prompts.UpdateMax)
                          ? "bg-green-300 border-green-400"
                          : "bg-blue-300 border-blue-400"
                      )
                    }
                  >
                    {prompt}
                  </div>
                </div>
                {/* Variables */}
                <div className="grid grid-cols-1 grid-rows-3 w-full items-center justify-center h-1/2">
                  <div className="flex w-full h-full row-start-2 justify-start items-start overflow-visible">
                    <div className="flex flex-col justify-center items-center text-center w-1/6 h-full p-1 text-xl">
                      i = {state.i}
                      <br />
                      max = {state.max}
                      <br />
                      b = {state.b}
                    </div>
                    <CreateArray array={state.array} selected={state.max} sorted={checkSorted()} currentIndex={state.i} currentBoundary={state.b} />
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex flex-col items-center space-y-2 p-2">
                  <div className="flex justify-between">
                    <ActionButton
                      id="inc"
                      type="primary"
                      disabled={state.i >= arrayLength - 1}
                      handler={() => handleIncrementI()}
                    >
                      Increment i
                    </ActionButton>
                    <ActionButton
                      id="update"
                      type="primary"
                      handler={() => handleUpdateMax()}
                    >
                      Update max
                    </ActionButton>
                    {/* <ActionButton
                      id="swap"
                      type="primary"
                      disabled={state.b < 1}
                      handler={() => handleSwapMax()}
                    >
                      Swap max
                    </ActionButton> */}
                    {/* <ActionButton
                      id="dec"
                      type="primary"
                      disabled={state.b <= 0}
                      handler={() => handleDecrementAndReset()}
                    >
                      Decrement b, Reset i and max
                    </ActionButton> */}
                  </div>
                  <div className="flex justify-between">
                    <ActionButton
                      id="select-sort-dive"
                      type="subset"
                      handler={() => handleDone()}
                    >
                      Exit Level
                    </ActionButton>
                  </div>
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
