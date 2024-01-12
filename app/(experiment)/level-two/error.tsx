'use client' // Error components must be Client Components.

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service.
    console.error(error)
  }, [error])

  return (
    <div className={" h-screen overflow-hidden flex flex-col bg-slate-50 font-sans"}>
      <span className={"px-4 font-sans text-l font-bold text-gray-950 col-span-4 justify-self-center"}>
        Something went wrong while loading the experiment.
      </span>
      <button
        type="button"
        className={"flex m-2 p-3 justify-center items-center rounded-md shadow-md bg-amber-300"}
        onClick={
          // Attempt to recover by trying to re-render the segment.
          () => reset()
        }
      >
        Try Again
      </button>
    </div>
  )
}
