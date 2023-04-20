import { useState } from "react";
import "./App.css";

type Node = {
  value: number;
  left: Node | null;
  right: Node | null;
};

function App() {
  const [inputArray, setInputArray] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    const values = inputValue.split(",").map((value) => parseInt(value.trim()));

    if (values.some((value) => isNaN(value) || value <= 0)) {
      alert(
        "Invalid input! Please enter a comma-separated list of positive integers. eg. 1,2,3"
      );
      return;
    }

    setInputArray(values);

    // Build the binary tree
    const binaryTree = buildBinaryTree(values);
    console.log(binaryTree)
    
  };

  const buildBinaryTree = (values: number[], i: number = 0): Node | null => {
    if (i >= values.length || values[i] === null) {
      return null;
    }
  
    const node: Node = { value: values[i], left: null, right: null };
    node.left = buildBinaryTree(values, 2 * i + 1);
    node.right = buildBinaryTree(values, 2 * i + 2);
  
    return node;
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter comma seperated integers"
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    </div>
  );
}

export default App;
