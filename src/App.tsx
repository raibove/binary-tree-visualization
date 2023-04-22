import { useState, useRef, useEffect } from "react";
import "./App.css";

type Node = {
  value: number;
  left: Node | null;
  right: Node | null;
  x: number;
  y: number;
  highlight: boolean;
};

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [inputValue, setInputValue] = useState("");
  const [binaryTree, setBinaryTree] = useState<Node | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth - 100;
        redrawBinaryTree();
      }
    };

    function handleClick(event: MouseEvent) {
      if (canvas) {
        resetHighlight(binaryTree);

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        const node = findClickedNode(binaryTree, x, y);

        node.forEach((n) => {
          n.highlight = true;
        });

        redrawBinaryTree();
      }
    }

    if (canvas) {
      canvas.addEventListener("click", handleClick);
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("click", handleClick);
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [binaryTree]);

  function resetHighlight(node: Node | null) {
    if (node) {
      node.highlight = false;
      resetHighlight(node.left);
      resetHighlight(node.right);
    }
  }

  function findClickedNode(node: Node | null, x: number, y: number): Node[] {
    if (!node) {
      return [];
    }

    const radius = 20;

    // Calculate the coordinates of the center of the node's circle.
    const centerX = node.x + radius;
    const centerY = node.y + radius;

    // Calculate the distance between the click location and the center of the node's circle.
    const dx = x - centerX;
    const dy = y - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // If the distance is less than the radius of the node's circle, the click was inside the circle.
    if (distance <= radius) {
      return [node];
    }

    // Recursively check if the click was inside any of the node's children.
    const left = findClickedNode(node.left, x, y);
    if (left.length > 0) {
      return [node, ...left];
    }

    const right = findClickedNode(node.right, x, y);
    if (right.length > 0) {
      return [node, ...right];
    }

    // If the click was not inside any of the nodes or their children, return null.
    return [];
  }

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

    // Build the binary tree
    const newBinaryTree = buildBinaryTree(values);
    setBinaryTree(newBinaryTree);

    // Draw the binary tree on the canvas
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        drawBinaryTree(context, newBinaryTree, canvas.width / 2, 50, 80, 80);
      }
    }
  };

  const redrawBinaryTree = () => {
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

    const node: Node = {
      value: values[i],
      left: null,
      right: null,
      x: 0,
      y: 0,
      highlight: false,
    };
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

    node.x = x;
    node.y = y;

    const radius = 15;
    const centerX = x + radius;
    const centerY = y + radius;

    context.lineWidth = 1;

    context.beginPath();
    context.fillStyle = "white";
    context.strokeStyle = "black";

    if (node.highlight) {
      context.fillStyle = "blue";
    }
    context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    context.stroke();
    context.fill();

    context.fillStyle = "black";
    context.fillText(node.value.toString(), centerX, centerY);

    if (node.left !== null) {
      const leftX = x - dx + radius;
      const leftY = y + dy;

      context.beginPath();
      context.moveTo(centerX, centerY + radius);
      context.lineTo(leftX, leftY);

      if (node.left.highlight) {
        context.strokeStyle = "blue";
      }
      context.stroke();

      drawBinaryTree(context, node.left, x - dx, y + dy, dx / 2, dy);
    }

    if (node.right !== null) {
      const rightX = x + dx + radius;
      const rightY = y + dy;

      context.beginPath();
      context.moveTo(centerX, centerY + radius);
      context.lineTo(rightX, rightY);
      if (node.right.highlight) {
        context.strokeStyle = "blue";
      }
      context.stroke();

      drawBinaryTree(context, node.right, x + dx, y + dy, dx / 2, dy);
    }
  };

  return (
    <div className="App">
      <div className="tree-input">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder="Enter comma seperated integers"
        />
        <button type="submit" onClick={handleSubmit}>
          Submit
        </button>
        <canvas
          ref={canvasRef}
          width={window.innerWidth - 100}
          height={window.innerHeight - 150}
        />
      </div>
    </div>
  );
}

export default App;
