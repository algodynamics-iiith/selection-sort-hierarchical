import { selectTheme } from "@/lib/features/userData/userDataSlice"
import { useAppSelector } from "@/lib/hooks"

export default function Information() {
  const theme = useAppSelector(selectTheme)
  return (
    <div className="flex-col space-y-4">
      <h1 className="text-center font-bold text-lg">Objective</h1>
      <p>
        Apply Selection Sort Algorithm on the given array to sort it using the provided controls.
        <br />
        <em>Please note that:</em>
      </p>
      <ol className="list-decimal ps-5">
        <li>You are not supposed to apply any optimizations over the original selection sort algorithm.</li>
        <li>Sorting of the array is the secondary objective; The primary objective is the correct application of the selection sort algorithm.</li>
      </ol>
      <div className="text-center m-1 flex-col justify-center space-y-2">
        <h1 className="font-bold text-lg">Variables Description</h1>
        <table className="w-full" id="variables-table">
          <thead>
            <tr>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Variable</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Data Type</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Valid values</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Initialization</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>i</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>int</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>[0,n)</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>0</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>max</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>int</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>[0,n)</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>0</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>b</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>int</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>[0,n]</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>n</td>
            </tr>
          </tbody>
        </table>
        <p>where n is the length of the array.</p>
      </div>
      <div className="text-center m-1 flex-col justify-center space-y-2">
        <h1 className="font-bold text-lg">Controls Description</h1>
        <table className="w-full" id="variables-table">
          <thead>
            <tr>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Control</th>
              <th className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Increment i</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Increments i by 1, if i &lt; n - 1</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Update max and Increment i</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Updates the value of max as i and increments i by 1, if i &lt; n - 1</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Swap max</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Swaps the array indices of max and b - 1</td>
            </tr>
          </tbody>
          <tbody>
            <tr>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Decrement b, Reset i and max</td>
              <td className={"border-2 " + (theme === "Light" ? "border-black" : "border-white")}>Decrements b by 1 and resets i and max to 0, if b &gt; 0</td>
            </tr>
          </tbody>
        </table>
        <p>where n is the length of the array.</p>
      </div>
      <div className="m-1 space-y-2">
        <h1 className="text-center font-bold text-lg">Procedure</h1>
        <ol className="list-decimal ps-5">
          <li>Click on suitable control to simulate next step of selection sort algorithm.</li>
          <li>You can <em>Undo</em> and <em>Redo</em> actions or <em>Reset</em> the experiment by clicking on the respective buttons as per your need.</li>
          <li>Click on the <em>Submit Run</em> button when you are done.</li>
        </ol>
      </div>
    </div>
  )
}
