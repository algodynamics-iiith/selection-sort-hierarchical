import ArrayElement from "@/app/_components/_buttons/arrayElements"

export default function CreateArray({
  array,
  selected,
  sorted,
  descending,
  hideIndex,
  currentIndex,
  currentBoundary,
  currentMax,
  currentMin,
}: {
  array: number[],
  selected?: number,
  sorted?: boolean | number,
  descending?: boolean,
  hideIndex?: boolean,
  currentIndex?: number,
  currentBoundary?: number,
  currentMax?: number,
  currentMin?: number,
}) {
  function checkBoundarySorted(array: number[], boundary: number, descending?: boolean) {
    let index = boundary
    while ((index + 1) < array.length) {
      if (descending && (array[index] < array[index + 1])) { return false }
      else if (array[index] > array[index + 1]) { return false }

      index += 1
    }
    return true
  }

  return (
    <div className="flex w-full justify-evenly items-start">
      {/* Value Names */}
      <div className="flex flex-col justify-start items-center space-y-2">
        <span className="p-3 text-sky-600 text-2xl">array:</span>
        <span className="text-amber-600 text-2xl" hidden={hideIndex}>position:</span>
      </div>
      {/* Array Elements */}
      {array.map((value, index) => {
        return (<div className="flex flex-col justify-start items-center space-y-2" key={index}>
          <ArrayElement
            value={value}
            index={index}
            highlight={index === selected}
            sorted={
              (typeof sorted === "number")
                ? ((index >= sorted) && checkBoundarySorted(array, sorted, descending))
                : sorted
            }
          />
          <span className="text-amber-600 text-2xl" hidden={hideIndex}>{index}</span>
          <span className="text-amber-600 text-2xl" hidden={currentIndex === index ? false : true}>i</span>
          <span className="text-purple-600 text-2xl" hidden={currentBoundary === index ? false : true}>b</span>
          <span className="text-purple-600 text-2xl" hidden={(currentBoundary && ((currentBoundary - 1) === index)) ? false : true}>f</span>
          <span className="text-purple-600 text-2xl" hidden={currentMax === index ? false : true}>max</span>
          <span className="text-purple-600 text-2xl" hidden={currentMin === index ? false : true}>min</span>
        </div>)
      })}
      {/* Boundary */}
      {(hideIndex !== true) && <div className="flex flex-col justify-start items-center space-y-2">
        <div className="flex justify-center mt-1 px-5 py-7 text-2xl rounded-lg">{`${' '}`}</div>
        <span className="text-amber-600 text-2xl" hidden={hideIndex}>{array.length}</span>
        <span className="text-amber-600 text-2xl" hidden={currentIndex === array.length ? false : true}>i</span>
        <span className="text-purple-600 text-2xl" hidden={currentBoundary === array.length ? false : true}>b</span>
      </div>}
    </div>
  )
}
