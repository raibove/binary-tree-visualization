import { useState } from 'react'
import './App.css'

function App() {
  const [inputArray, setInputArray] = useState<number[]>([])
  const [inputValue, setInputValue] = useState("")

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>)=>{
    setInputValue(event.target.value)
  }

  const handleSubmit = ()=>{
    const values = inputValue.split(',').map(value=> parseInt(value.trim()))

    if (values.some((value) => isNaN(value) || value <= 0)) {
      alert("Invalid input! Please enter a comma-separated list of positive integers. eg. 1,2,3");
      return;
    }

    setInputArray(values)
  }

  return (
    <div className="App">
      <div>
        <input type="text" value={inputValue} onChange={handleChange} placeholder="Enter comma seperated integers"/>
        <button type="submit" onClick={handleSubmit}>Submit</button>
      </div>
    </div>
  )
}

export default App
