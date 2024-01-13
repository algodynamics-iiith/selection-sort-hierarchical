import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../../store'

type ThemeStates = "Light" | "Dark"

// Selection Sort State Interface.
export interface SelectionSortState {
  array: number[],
  i: number,
  max: number,
  b: number,
}

// Define a type for the slice state
export interface UserDataState {
  userId: string,
  runId: string,
  theme: ThemeStates,
  levelStates: {
    current: SelectionSortState,
    previous: SelectionSortState[],
    next: SelectionSortState[]
  }[]
}

const arrayLength = 6

/**
 * Function to create a random array without duplicates.
 * @returns Array containing arrayLength numbers.
 */
function createRandomArray() {
  let array: number[] = []
  let count = arrayLength

  while (count > 0) {
    const number = Math.round(Math.random() * 10)
    let noDuplicates = true

    // Checking for duplicates.
    for (let index = 0; index < array.length && noDuplicates; index++) {
      if (array[index] === number)
        noDuplicates = false
    }

    // If no duplicates are present.
    if (noDuplicates) {
      array.push(number)
      count -= 1
    }
  }

  return array
}

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

const initialArray = createRandomArray()
const initialSelectionSortState = createState(initialArray, 0, 0, arrayLength)

// Define the initial state using that type
const initialState: UserDataState = {
  userId: "",
  runId: "",
  theme: "Light",
  levelStates: [
    // Level 0 - Selection Sort
    {
      current: initialSelectionSortState,
      previous: [],
      next: [],
    },
    // Level 1 - Find Max, Swap Max, Decrement And Reset
    {
      current: {} as SelectionSortState,
      previous: [],
      next: [],
    },
    // Level 2 - Increment I, Update Max, Swap Max, Decrement And Reset
    {
      current: {} as SelectionSortState,
      previous: [],
      next: [],
    },
  ]
}

export const userDataSlice = createSlice({
  name: 'userData',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    // Update the userId
    updateUserId: (state, action: PayloadAction<string>) => {
      state.userId = action.payload
    },
    // Update the runId
    updateRunId: (state, action: PayloadAction<string>) => {
      state.runId = action.payload
    },
    // Update the theme
    updateTheme: (state, action: PayloadAction<ThemeStates>) => {
      state.theme = action.payload
    },
    // Store State of level
    storeLevelStates: (state, action: PayloadAction<{
      level: number,
      currentState: SelectionSortState,
      previousStates: SelectionSortState[],
      nextStates: SelectionSortState[]
    }>) => {
      state.levelStates[action.payload.level].current = action.payload.currentState
      state.levelStates[action.payload.level].previous = action.payload.previousStates
      state.levelStates[action.payload.level].next = action.payload.nextStates
    }
  }
})

export const { updateUserId, updateRunId, updateTheme, storeLevelStates } = userDataSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUserId = (state: RootState) => state.userData.userId
export const selectRunId = (state: RootState) => state.userData.runId
export const selectTheme = (state: RootState) => state.userData.theme
export const selectLevelStates = (state: RootState) => state.userData.levelStates
export const selectInitialArray = () => initialArray
export const selectArrayLength = () => arrayLength

export default userDataSlice.reducer
