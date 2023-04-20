import { useState, useRef } from "react";
import "./App.css";

type Node = {
  value: number;
  left: Node | null;
  right: Node | null;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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

    // Draw the binary tree on the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBinaryTree(context, binaryTree, canvas.width / 2, 50, 80, 80);
      }
    }
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

  const drawBinaryTree = (
    context: CanvasRenderingContext2D,
    node: Node | null,
    x: number,
    y: number,
    dx: number,
    dy: number
  ) => {
    if (node === null) {
      return;
    }

    const radius = 20;
    const centerX = x + radius;
    const centerY = y + radius;

    context.beginPath();
    context.fillStyle = "white";
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.strokeStyle = "black";
    context.stroke();
    context.fillStyle = "black";
    context.fillText(node.value.toString(), centerX, centerY);

    if (node.left !== null) {
      const leftX = x - dx + radius;
      const leftY = y + dy;

      context.beginPath();
      context.moveTo(centerX, centerY + radius);
      context.lineTo(leftX, leftY);
      context.stroke();

      drawBinaryTree(context, node.left, x - dx, y + dy, dx / 2, dy);
    }
    if (node.right !== null) {
      const rightX = x + dx + radius;
      const rightY = y + dy;

      context.beginPath();
      context.moveTo(centerX, centerY + radius);
      context.lineTo(rightX, rightY);
      context.stroke();

      drawBinaryTree(context, node.right, x + dx, y + dy, dx / 2, dy);
    }
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
        <canvas ref={canvasRef} width={600} height={400} />
      </div>
    </div>
  );
}

export default App;
