import ArrayElement from "@/app/_components/_buttons/arrayElements"

export default function CreateArray({
  array,
  selected,
  sorted,
  hideIndex,
  currentIndex,
  currentBoundary,
}: {
  array: number[],
  selected?: number,
  sorted?: boolean,
  hideIndex?: boolean,
  currentIndex?: number,
  currentBoundary?: number,
}) {
  return (
    <div className="flex w-full justify-evenly items-start">
      <div className="flex flex-col justify-start items-center space-y-2">
        <span className="p-3 text-sky-600 text-2xl">array:</span>
        <span className="text-amber-600 text-2xl" hidden={hideIndex}>index:</span>
      </div>
      {array.map((value, index) => {
        return (<div className="flex flex-col justify-start items-center space-y-2" key={index}>
          <ArrayElement value={value} index={index} highlight={index === selected} sorted={sorted} />
          <span className="text-amber-600 text-2xl" hidden={hideIndex}>{index}</span>
          <span className="text-amber-600 text-2xl" hidden={currentIndex === index ? false : true}>i</span>
          <span className="text-purple-600 text-2xl" hidden={currentBoundary === index ? false : true}>b</span>
        </div>)
      })}
    </div>
  )
}
