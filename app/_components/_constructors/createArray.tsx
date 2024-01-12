import ArrayElement from "@/app/_components/_buttons/arrayElements"

export default function CreateArray({ array, selected }: { array: number[], selected?: number }) {
  return (
    <div className="flex w-full justify-evenly items-center">
      <div className="flex flex-col justify-center items-center space-y-2">
        <span className="p-3 text-sky-600 text-2xl">value:</span>
        <span className="text-amber-600 text-2xl">index:</span>
      </div>
      {array.map((value, index) => {
        return (<div className="flex flex-col justify-center items-center space-y-2" key={index}>
          <ArrayElement value={value} index={index} highlight={index === selected} />
          <span className="text-amber-600 text-2xl">{index}</span>
        </div>)
      })}
    </div>
  )
}
